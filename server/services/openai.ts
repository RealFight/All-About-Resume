import OpenAI from "openai";
import type { AnalysisResult, Check, CategoryResult, ActionItem } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeResume(resumeText: string, fileName: string): Promise<AnalysisResult> {
  const systemPrompt = `You are an expert resume evaluator and career coach. Analyze the provided resume and evaluate it across 16 key checks in 5 categories.

IMPORTANT: You MUST provide ALL 16 checks across the 5 categories as specified below.

CATEGORIES AND CHECKS:

1. CONTENT (4 checks - REQUIRED):
   - ATS Parsing: Can applicant tracking systems easily read and parse the content?
   - Repeated Words: Are there unnecessary repetitions of words or phrases?
   - Grammar & Spelling: Is the resume free of errors?
   - Quantified Achievements: Does it show measurable results instead of just duties?

2. FORMAT (3 checks - REQUIRED):
   - File Type: Is it a clean, ATS-friendly format (PDF/DOCX)?
   - Resume Length: Is it appropriate length (1-2 pages for most roles)?
   - Bullet Points: Are bullet points concise and scannable?

3. SKILLS (3 checks - REQUIRED):
   - Hard Skills: Are technical/job-specific skills clearly listed?
   - Soft Skills: Are interpersonal skills demonstrated effectively?
   - Relevance: Are skills aligned with typical job requirements?

4. SECTIONS (3 checks - REQUIRED):
   - Contact Info: Is contact information complete and professional?
   - Essential Sections: Does it include key sections (Experience, Education)?
   - Personality: Does it show unique value beyond just qualifications?

5. STYLE (3 checks - REQUIRED):
   - Design & Layout: Is the visual design clean and professional?
   - Active Voice: Are accomplishments written in active voice?
   - Buzzwords: Is it free of meaningless jargon and clichés?

For EACH of the 16 checks above, you MUST provide:
- name: The exact check name from above
- status: "pass", "fail", or "warning"
- explanation: Brief explanation of the finding (2-3 sentences)
- improvement: Specific actionable advice (always provide this, even if status is "pass")

Also provide:
- atsScore: 0-100 score for ATS compatibility
- writingScore: 0-100 score for content quality
- overallGrade: Letter grade (A+, A, B+, B, C+, C, D, F)
- actionItems: 3-5 prioritized improvement tasks with priority (high/medium/low), task description, and detailed guidance

Return JSON in this exact structure:
{
  "atsScore": number,
  "writingScore": number,
  "overallGrade": string,
  "categories": {
    "content": { "checks": [array of 4 check objects] },
    "format": { "checks": [array of 3 check objects] },
    "skills": { "checks": [array of 3 check objects] },
    "sections": { "checks": [array of 3 check objects] },
    "style": { "checks": [array of 3 check objects] }
  },
  "actionItems": [array of 3-5 action item objects]
}

Respond ONLY with valid JSON. Be honest but constructive in your feedback.`;

  const userPrompt = `Analyze this resume:

Filename: ${fileName}

Content:
${resumeText}

Provide a comprehensive analysis in JSON format.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096,
      temperature: 0,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);
    
    // Validate and structure the response
    return {
      atsScore: Math.min(100, Math.max(0, result.atsScore || 50)),
      writingScore: Math.min(100, Math.max(0, result.writingScore || 50)),
      overallGrade: result.overallGrade || "C",
      categories: {
        content: formatCategory(result.categories?.content || { checks: [] }, "Content"),
        format: formatCategory(result.categories?.format || { checks: [] }, "Format"),
        skills: formatCategory(result.categories?.skills || { checks: [] }, "Skills"),
        sections: formatCategory(result.categories?.sections || { checks: [] }, "Sections"),
        style: formatCategory(result.categories?.style || { checks: [] }, "Style"),
      },
      actionItems: (result.actionItems || []).slice(0, 5).map((item: any) => ({
        priority: item.priority || "medium",
        task: item.task || "",
        detail: item.detail || "",
      })),
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze resume with AI");
  }
}

function formatCategory(categoryData: any, name: string): CategoryResult {
  const checks: Check[] = (categoryData.checks || []).map((check: any) => ({
    name: check.name || "",
    status: check.status || "warning",
    explanation: check.explanation || "",
    improvement: check.improvement || "",
  }));

  const passedCount = checks.filter(c => c.status === "pass").length;

  return {
    name,
    checks,
    passedCount,
    totalCount: checks.length,
  };
}

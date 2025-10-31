import nodemailer from "nodemailer";
import type { AnalysisResult } from "@shared/schema";

// Create transporter lazily
let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) {
    return transporter;
  }

  // Try to create a test account for development
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Email service initialized with test account");
    return transporter;
  } catch (error) {
    console.error("Failed to create email test account:", error);
    throw new Error("Email service unavailable");
  }
}

export async function sendAnalysisEmail(
  email: string,
  analysis: AnalysisResult,
  fileName: string
): Promise<void> {
  const emailHtml = generateEmailHtml(analysis, fileName);

  try {
    const emailTransporter = await getTransporter();
    
    const info = await emailTransporter.sendMail({
      from: '"All About Resume" <noreply@allaboutresume.com>',
      to: email,
      subject: `Your Resume Analysis Results - ${analysis.overallGrade} Grade`,
      html: emailHtml,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Email preview URL: %s", previewUrl);
    }
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
}

function generateEmailHtml(analysis: AnalysisResult, fileName: string): string {
  const { atsScore, writingScore, overallGrade, categories, actionItems } = analysis;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Resume Analysis</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .grade { font-size: 48px; font-weight: bold; margin: 10px 0; }
    .scores { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0; }
    .score-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
    .score-value { font-size: 36px; font-weight: bold; color: #3b82f6; }
    .category { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .category-header { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
    .check { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .check:last-child { border-bottom: none; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .status-pass { background: #dcfce7; color: #166534; }
    .status-warning { background: #fef3c7; color: #854d0e; }
    .status-fail { background: #fee2e2; color: #991b1b; }
    .action-items { margin-top: 30px; }
    .action-item { background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0; border-radius: 4px; }
    .priority { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .priority-high { background: #fee2e2; color: #991b1b; }
    .priority-medium { background: #fef3c7; color: #854d0e; }
    .priority-low { background: #dcfce7; color: #166534; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Resume Analysis Results</h1>
    <div class="grade">${overallGrade}</div>
    <p>Overall Grade for ${fileName}</p>
  </div>

  <div class="scores">
    <div class="score-card">
      <div class="score-value">${atsScore}</div>
      <div>ATS Parseability</div>
    </div>
    <div class="score-card">
      <div class="score-value">${writingScore}</div>
      <div>Writing Quality</div>
    </div>
  </div>

  <h2>Category Breakdown</h2>
  ${Object.values(categories).map(category => `
    <div class="category">
      <div class="category-header">${category.name} (${category.passedCount}/${category.totalCount} passed)</div>
      ${category.checks.map(check => `
        <div class="check">
          <div>
            <span class="status status-${check.status}">${check.status.toUpperCase()}</span>
            <strong>${check.name}</strong>
          </div>
          <div style="font-size: 14px; color: #64748b; margin-top: 5px;">${check.explanation}</div>
          ${check.improvement && check.status !== 'pass' ? `<div style="font-size: 14px; color: #3b82f6; margin-top: 5px;">💡 ${check.improvement}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="action-items">
    <h2>Priority Action Items</h2>
    ${actionItems.map((item, idx) => `
      <div class="action-item">
        <div style="margin-bottom: 8px;">
          <span style="font-weight: 600; margin-right: 8px;">${idx + 1}.</span>
          <span class="priority priority-${item.priority}">${item.priority}</span>
        </div>
        <div style="font-weight: 600; margin-bottom: 5px;">${item.task}</div>
        <div style="font-size: 14px; color: #64748b;">${item.detail}</div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p><strong>All About Resume</strong></p>
    <p>Free AI-powered resume analysis to help you succeed</p>
  </div>
</body>
</html>
  `.trim();
}

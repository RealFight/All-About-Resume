import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume Analysis Schema
export const resumeAnalyses = pgTable("resume_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  email: text("email"),
  parsedText: text("parsed_text").notNull(),
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for Resume Analysis Results
export type CheckStatus = "pass" | "fail" | "warning";

export interface Check {
  name: string;
  status: CheckStatus;
  explanation: string;
  improvement?: string;
}

export interface CategoryResult {
  name: string;
  checks: Check[];
  passedCount: number;
  totalCount: number;
}

export interface AnalysisResult {
  atsScore: number;
  writingScore: number;
  overallGrade: string;
  categories: {
    content: CategoryResult;
    format: CategoryResult;
    skills: CategoryResult;
    sections: CategoryResult;
    style: CategoryResult;
  };
  actionItems: ActionItem[];
}

export interface ActionItem {
  priority: "high" | "medium" | "low";
  task: string;
  detail: string;
}

// Zod Schemas
export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;

// Upload Request Schema
export const uploadResumeSchema = z.object({
  email: z.string().email().optional(),
});

export type UploadResumeRequest = z.infer<typeof uploadResumeSchema>;

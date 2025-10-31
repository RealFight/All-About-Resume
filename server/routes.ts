import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { parseFile } from "./services/fileParser";
import { analyzeResume } from "./services/openai";
import { sendAnalysisEmail } from "./services/email";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and analyze resume
  app.post("/api/analyze", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { buffer, originalname, mimetype, size } = req.file;

      // Parse the file
      const parsedText = await parseFile(buffer, mimetype);

      if (!parsedText || parsedText.trim().length < 50) {
        return res.status(400).json({ error: "Resume content is too short or unreadable" });
      }

      // Analyze with OpenAI
      const analysisResult = await analyzeResume(parsedText, originalname);

      // Store the analysis
      const analysis = await storage.createAnalysis({
        fileName: originalname,
        fileSize: size,
        email: null,
        parsedText,
        analysisResult,
      });

      res.json({ id: analysis.id });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to analyze resume",
      });
    }
  });

  // Get analysis results
  app.get("/api/results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json({
        analysis: analysis.analysisResult,
      });
    } catch (error) {
      console.error("Get results error:", error);
      res.status(500).json({ error: "Failed to get results" });
    }
  });

  // Send results via email
  app.post("/api/results/:id/email", async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Send email
      await sendAnalysisEmail(
        email,
        analysis.analysisResult as any,
        analysis.fileName
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

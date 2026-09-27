import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  analyzeUploadedResume,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
} from "../controllers/resumeController.js";

const router = express.Router();


// POST /api/resumes/analyze
router.post(
  "/analyze",
  upload.single("resume"),
  analyzeUploadedResume
);


// GET /api/resumes
router.get(
  "/",
  getResumeAnalyses
);


// GET /api/resumes/:id
router.get(
  "/:id",
  getResumeAnalysisById
);


// DELETE /api/resumes/:id
router.delete(
  "/:id",
  deleteResumeAnalysis
);


export default router;
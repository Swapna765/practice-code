import fs from "fs";

import extractTextFromPDF from "../services/resumeParser.js";
import analyzeResume from "../services/analysisService.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";


// =====================================================
// ANALYZE UPLOADED RESUME
// =====================================================

const analyzeUploadedResume = async (req, res, next) => {
  let filePath = null;

  try {
    // Check if PDF was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    filePath = req.file.path;

    // Get job description
    const jobDescription =
      req.body.jobDescription || "";

    // -----------------------------------------------
    // 1. Extract text from PDF
    // -----------------------------------------------

    console.log(
      "📄 Starting PDF text extraction..."
    );

    const resumeText =
      await extractTextFromPDF(filePath);

    console.log(
      `✅ PDF text extracted successfully (${resumeText.length} characters)`
    );

    // -----------------------------------------------
    // 2. Analyze resume with Gemini
    // -----------------------------------------------

    console.log(
      "🤖 Sending resume to Gemini..."
    );

    const analysis = await analyzeResume(
      resumeText,
      jobDescription
    );

    console.log(
      "✅ Gemini analysis completed"
    );

    // -----------------------------------------------
    // 3. Save analysis to MongoDB
    // -----------------------------------------------

    console.log(
      "💾 Saving analysis to MongoDB..."
    );

    const savedAnalysis =
      await ResumeAnalysis.create({
        fileName: req.file.originalname,

        jobDescription,

        extractedText: resumeText,

        atsScore: analysis.atsScore,

        summary: analysis.summary,

        strengths: analysis.strengths,

        improvements: analysis.improvements,

        performanceMetrics:
          analysis.performanceMetrics,

        keywords: analysis.keywords,
      });

    console.log(
      "✅ Analysis saved to MongoDB"
    );

    // -----------------------------------------------
    // 4. Send response
    // -----------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Resume analyzed successfully",

      data: {
        id: savedAnalysis._id,

        fileName:
          savedAnalysis.fileName,

        atsScore:
          savedAnalysis.atsScore,

        summary:
          savedAnalysis.summary,

        strengths:
          savedAnalysis.strengths,

        improvements:
          savedAnalysis.improvements,

        performanceMetrics:
          savedAnalysis.performanceMetrics,

        keywords:
          savedAnalysis.keywords,

        createdAt:
          savedAnalysis.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "❌ Resume controller error:",
      error.message
    );

    next(error);

  } finally {

    // -----------------------------------------------
    // Delete temporary uploaded PDF
    // -----------------------------------------------

    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        fs.unlinkSync(filePath);

        console.log(
          "🗑️ Uploaded PDF deleted"
        );

      } catch (deleteError) {
        console.error(
          "Failed to delete uploaded file:",
          deleteError.message
        );
      }
    }
  }
};


// =====================================================
// GET ALL RESUME ANALYSES
// =====================================================

const getResumeAnalyses = async (
  req,
  res,
  next
) => {
  try {

    console.log(
      "📚 Fetching resume analysis history..."
    );

    const analyses =
      await ResumeAnalysis.find()
        .select(
          "fileName atsScore summary createdAt performanceMetrics keywords"
        )
        .sort({
          createdAt: -1,
        });

    console.log(
      `✅ Found ${analyses.length} resume analyses`
    );

    return res.status(200).json({
      success: true,

      count: analyses.length,

      data: analyses,
    });

  } catch (error) {

    console.error(
      "❌ Get resume analyses error:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// GET ONE RESUME ANALYSIS
// =====================================================

const getResumeAnalysisById = async (
  req,
  res,
  next
) => {
  try {

    console.log(
      "🔍 Fetching resume analysis:",
      req.params.id
    );

    const analysis =
      await ResumeAnalysis.findById(
        req.params.id
      );

    // Analysis not found
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "Resume analysis not found",
      });
    }

    console.log(
      "✅ Resume analysis found"
    );

    return res.status(200).json({
      success: true,

      data: analysis,
    });

  } catch (error) {

    console.error(
      "❌ Get resume analysis error:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// DELETE ONE RESUME ANALYSIS
// =====================================================

const deleteResumeAnalysis = async (
  req,
  res,
  next
) => {
  try {

    console.log(
      "🗑️ Deleting resume analysis:",
      req.params.id
    );

    const analysis =
      await ResumeAnalysis.findByIdAndDelete(
        req.params.id
      );

    // Analysis not found
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "Resume analysis not found",
      });
    }

    console.log(
      "✅ Resume analysis deleted"
    );

    return res.status(200).json({
      success: true,

      message:
        "Resume analysis deleted successfully",
    });

  } catch (error) {

    console.error(
      "❌ Delete resume analysis error:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

export {
  analyzeUploadedResume,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
};
import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    performanceMetrics: {
      atsCompatibility: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      keywordOptimization: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      contentQuality: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      formatting: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    keywords: {
      matched: {
        type: [String],
        default: [],
      },

      missing: {
        type: [String],
        default: [],
      },

      recommended: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);

export default ResumeAnalysis;
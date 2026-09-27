import analyzeResumeWithGemini from "./geminiService.js";
import matchKeywords from "../utils/keywordMatcher.js";
import calculateATSScore from "../utils/atsCalculator.js";

const analyzeResume = async (resumeText, jobDescription = "") => {
  try {
    // 1. Get AI analysis from Gemini
    const aiAnalysis = await analyzeResumeWithGemini(
      resumeText,
      jobDescription
    );

    // 2. Match resume keywords with job description
    const keywordAnalysis = matchKeywords(
      resumeText,
      jobDescription
    );

    // 3. Get performance metrics from Gemini
    const performanceMetrics = {
      atsCompatibility:
        Number(aiAnalysis.performanceMetrics?.atsCompatibility) || 0,

      keywordOptimization:
  jobDescription.trim()
    ? keywordAnalysis.keywordOptimization
    : Number(
        aiAnalysis.performanceMetrics?.keywordOptimization
      ) || 0,

      contentQuality:
        Number(aiAnalysis.performanceMetrics?.contentQuality) || 0,

      formatting:
        Number(aiAnalysis.performanceMetrics?.formatting) || 0,
    };

    // 4. Calculate final ATS score
    const atsScore = calculateATSScore(performanceMetrics);

    // 5. Combine everything into one result
    return {
      atsScore,

      summary: aiAnalysis.summary || "",

      strengths: Array.isArray(aiAnalysis.strengths)
        ? aiAnalysis.strengths
        : [],

      improvements: Array.isArray(aiAnalysis.improvements)
        ? aiAnalysis.improvements
        : [],

      performanceMetrics,

      keywords: {
        matched: keywordAnalysis.matched,
        missing: keywordAnalysis.missing,
        recommended: keywordAnalysis.recommended,
      },
    };
  } catch (error) {
    console.error("Resume analysis error:", error.message);

    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

export default analyzeResume;
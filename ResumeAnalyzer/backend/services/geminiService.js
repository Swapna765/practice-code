import ai from "../config/gemini.js";
import buildResumeAnalysisPrompt from "../utils/promptBuilder.js";

const primaryModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const fallbackModel = "gemini-3.6-flash";
const retryableStatuses = new Set([429, 500, 502, 503, 504]);

const generateWithRetry = async (prompt, model) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
      });
    } catch (error) {
      const status = error?.status || error?.code;

      if (!retryableStatuses.has(Number(status)) || attempt === 2) {
        throw error;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 1000 * (attempt + 1));
      });
    }
  }

  throw new Error("Gemini request failed after retries");
};

const analyzeResumeWithGemini = async (
  resumeText,
  jobDescription = ""
) => {
  try {
    const prompt = buildResumeAnalysisPrompt(
      resumeText,
      jobDescription
    );

    let response;

    try {
      response = await generateWithRetry(prompt, primaryModel);
    } catch (primaryError) {
      if (primaryModel === fallbackModel) {
        throw primaryError;
      }

      console.warn(`Gemini model ${primaryModel} unavailable; trying ${fallbackModel}.`);
      response = await generateWithRetry(prompt, fallbackModel);
    }

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    // Remove markdown code fences if Gemini returns them
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const analysis = JSON.parse(cleanedText);

    return analysis;
  } catch (error) {
    console.error("Gemini analysis error:", error);

    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Gemini analysis failed: ${reason}`);
  }
};

export default analyzeResumeWithGemini;
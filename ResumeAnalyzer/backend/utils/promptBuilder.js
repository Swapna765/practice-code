const buildResumeAnalysisPrompt = (resumeText, jobDescription = "") => {
  return `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the following resume carefully.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "No job description was provided."}

Return ONLY valid JSON in exactly this structure:

{
  "summary": "A short overall assessment of the resume",

  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],

  "improvements": [
    "improvement 1",
    "improvement 2",
    "improvement 3"
  ],

  "performanceMetrics": {
    "atsCompatibility": 0,
    "keywordOptimization": 0,
    "contentQuality": 0,
    "formatting": 0
  },

  "keywords": {
    "matched": [],
    "missing": [],
    "recommended": []
  }
}

Rules:

- All performance metric values must be numbers from 0 to 100.
- Identify strengths based only on the actual resume.
- Identify improvements based only on the actual resume.
- If a job description is provided, compare the resume against it.
- "matched" should contain relevant keywords found in both the resume and job description.
- "missing" should contain important job-description keywords missing from the resume.
- "recommended" should contain useful keywords the candidate could naturally add.
- Do not invent experience, education, projects, certifications, or skills.
- Do not assume information that is not present in the resume.
- Keep the feedback practical and useful for improving ATS compatibility.
- Return JSON only.
`;
};

export default buildResumeAnalysisPrompt;
import api from "./api";


// =====================================================
// ANALYZE RESUME
// =====================================================

export const analyzeResume = async (
  file,
  jobDescription = ""
) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "jobDescription",
    jobDescription
  );

  const response = await api.post(
    "/resumes/analyze",
    formData
  );

  return response.data;
};


// =====================================================
// GET ALL RESUME ANALYSES
// =====================================================

export const getResumeAnalyses = async () => {
  const response = await api.get(
    "/resumes"
  );

  return response.data;
};


// =====================================================
// GET ONE RESUME ANALYSIS
// =====================================================

export const getResumeAnalysisById = async (
  id
) => {
  const response = await api.get(
    `/resumes/${id}`
  );

  return response.data;
};


// =====================================================
// DELETE RESUME ANALYSIS
// =====================================================

export const deleteResumeAnalysis = async (
  id
) => {
  const response = await api.delete(
    `/resumes/${id}`
  );

  return response.data;
};
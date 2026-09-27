import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/resume.api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadZone from "../components/upload/UploadZone";
import JobDescriptionInput from "../components/upload/JobDescriptionInput";
import AnalyzeButton from "../components/upload/AnalyzeButton";
import "./analyze.css";

function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Select a PDF resume before starting the analysis.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await analyzeResume(file, jobDescription);
      navigate(`/results/${response.data.id}`, { state: response.data });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Analysis failed. Check that the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="analyze-page">
        <div className="container">
          <div className="analyze-header">
            <h1>Analyze Your Resume</h1>

            <p>
              Upload your resume and get an AI-powered ATS analysis
              with actionable recommendations.
            </p>
          </div>

          <div className="analyze-content">
            <UploadZone file={file} setFile={setFile} />
            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
            {error && <p className="analyze-error">{error}</p>}
            <AnalyzeButton onClick={handleAnalyze} disabled={!file} loading={loading} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Analyze;
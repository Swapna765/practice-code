import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getResumeAnalysisById } from "../services/resume.api";
import ScoreOverview from "../components/dashboard/ScoreOverview";
import PerformanceMetrics from "../components/dashboard/PerformanceMetrics";
import StrengthsCard from "../components/dashboard/StrengthsCard";
import ImprovementsCard from "../components/dashboard/ImprovementsCard";
import KeywordOptimization from "../components/dashboard/KeywordOptimization";
import "../styles/results.css";

function Results() {
  const { id } = useParams();
  const { state } = useLocation();
  const [analysis, setAnalysis] = useState(state || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!analysis) getResumeAnalysisById(id).then((response) => setAnalysis(response.data)).catch(() => setError("This analysis could not be found."));
  }, [analysis, id]);

  if (error) return <><Navbar /><main className="results-page"><div className="container"><p className="page-error">{error}</p><Link to="/history" className="back-link"><ArrowLeft size={16} /> Back to history</Link></div></main></>;
  if (!analysis) return <><Navbar /><main className="results-page"><div className="container"><p className="results-loading">Loading your analysis...</p></div></main></>;

  const metrics = analysis.performanceMetrics || {};
  const keywords = analysis.keywords || {};
  return <><Navbar /><main className="results-page"><div className="container"><Link to="/history" className="back-link"><ArrowLeft size={16} /> Back to history</Link><div className="results-heading"><div><p className="eyebrow">Analysis complete</p><h1>{analysis.fileName}</h1></div></div><div className="dashboard-layout"><ScoreOverview score={analysis.atsScore} summary={analysis.summary} /><PerformanceMetrics metrics={metrics} /><KeywordOptimization keywords={keywords} /><div className="dashboard-insights"><StrengthsCard strengths={analysis.strengths} /><ImprovementsCard improvements={analysis.improvements} /></div></div></div></main><Footer /></>;
}

export default Results;
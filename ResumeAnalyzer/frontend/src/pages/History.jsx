import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { deleteResumeAnalysis, getResumeAnalyses } from "../services/resume.api";
import "../styles/history.css";

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    getResumeAnalyses().then((response) => setAnalyses(response.data || [])).catch(() => setError("Could not load analysis history."));
  }, []);

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Delete the analysis for "${fileName}"?`)) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await deleteResumeAnalysis(id);
      setAnalyses((currentAnalyses) => currentAnalyses.filter((analysis) => analysis._id !== id));
    } catch {
      setError("Could not delete this analysis.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <><Navbar /><main className={`history-page${analyses.length === 0 && !error ? " history-page--empty" : ""}`}><div className="container"><div className="page-heading"><p className="eyebrow">Your workspace</p><h1>Analysis history</h1><p>Review every resume you have scored and jump back into the details.</p></div>{error && <p className="page-error">{error}</p>}{analyses.length === 0 && !error ? <div className="empty-state"><FileText size={30} /><h2>No analyses yet</h2><p>Upload your first resume to start building your personal benchmark.</p><Link to="/analyze" className="history-action">Analyze a resume <ArrowRight size={16} /></Link></div> : <div className="history-list">{analyses.map((analysis) => <div className="history-row" key={analysis._id}><Link className="history-link" to={`/results/${analysis._id}`}><div className="history-file"><FileText size={20} /><div><strong>{analysis.fileName}</strong><span>{new Date(analysis.createdAt).toLocaleDateString()}</span></div></div><div className="history-score"><strong>{analysis.atsScore}</strong><span>ATS score</span></div><ArrowRight size={18} /></Link><button className="history-delete" type="button" onClick={() => handleDelete(analysis._id, analysis.fileName)} disabled={deletingId === analysis._id} aria-label={`Delete ${analysis.fileName}`} title={`Delete ${analysis.fileName}`}><Trash2 size={17} />{deletingId === analysis._id ? "Deleting..." : "Delete"}</button></div>)}</div>}</div></main><Footer /></>
  );
}

export default History;
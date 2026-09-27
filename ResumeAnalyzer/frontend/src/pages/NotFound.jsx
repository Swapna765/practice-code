import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/history.css";

function NotFound() {
  return (
    <><Navbar /><main className="history-page"><div className="container"><div className="empty-state"><FileQuestion size={34} /><p className="eyebrow">404 error</p><h1>That page wandered off.</h1><p>The route you opened does not exist in CVSpark.</p><Link to="/" className="history-action"><ArrowLeft size={16} /> Return home</Link></div></div></main><Footer /></>
  );
}

export default NotFound;
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-eyebrow">Resume intelligence, simplified</span>
          <h3>
            CV<span>Spark</span>
          </h3>

          <p>
            Analyze your resume, improve your ATS score, and get
            AI-powered recommendations to make your resume
            job-ready.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>

          <Link to="/analyze">
            Analyze Resume
          </Link>

          <Link to="/history">
            History
          </Link>
        </div>

       

      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CVSpark. All rights reserved.</p>
        <span>Built for better applications</span>
      </div>

    </footer>
  );
}

export default Footer;
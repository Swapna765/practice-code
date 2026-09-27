import {
  ArrowRight,
  CheckCircle,
  FileSearch,
  BarChart3,
  Sparkles,
  Target,
  Upload,
  Brain,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

import "./home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {/* ================= HERO ================= */}

      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              AI-Powered Resume Analysis
            </div>

            <h1>
              Make Your Resume
              <span> Job-Ready</span>
            </h1>

            <p>
              Analyze your resume with AI, discover your ATS score, identify
              missing keywords, and get actionable recommendations to improve
              your chances of getting hired.
            </p>

            <div className="hero-buttons">
              <Link to="/analyze">
                <Button>
                  Analyze My Resume
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button variant="secondary">How It Works</Button>
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle size={17} />
                Free to analyze
              </div>

              <div className="trust-item">
                <CheckCircle size={17} />
                AI-powered insights
              </div>

              <div className="trust-item">
                <CheckCircle size={17} />
                Instant results
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}

          <div className="hero-preview">
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <p className="preview-label">Resume Analysis</p>

                  <h3>Your ATS Score</h3>
                </div>

                <div className="preview-icon">
                  <FileSearch size={22} />
                </div>
              </div>

              <div className="score-preview">
                <div className="score-circle">
                  <span>88</span>
                  <small>/100</small>
                </div>

                <div className="score-info">
                  <strong>Excellent</strong>
                  <p>Your resume has strong ATS compatibility.</p>
                </div>
              </div>

              <div className="preview-metrics">
                <div className="preview-metric">
                  <div>
                    <span>ATS Compatibility</span>
                    <strong>85%</strong>
                  </div>

                  <div className="metric-bar">
                    <div style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div className="preview-metric">
                  <div>
                    <span>Keyword Optimization</span>
                    <strong>92%</strong>
                  </div>

                  <div className="metric-bar">
                    <div style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div className="preview-metric">
                  <div>
                    <span>Content Quality</span>
                    <strong>78%</strong>
                  </div>

                  <div className="metric-bar">
                    <div style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="features-section">
        <div className="container">
          <div className="section-heading">
            <div className="section-badge">Powerful Features</div>

            <h2>
              Everything You Need to
              <span> Improve Your Resume</span>
            </h2>

            <p>
              Get detailed insights into your resume and understand exactly what
              you can improve.
            </p>
          </div>

          <div className="features-grid">
            <Card className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={24} />
              </div>

              <h3>ATS Score</h3>

              <p>
                Get a comprehensive ATS score based on compatibility, keywords,
                content quality, and formatting.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <Target size={24} />
              </div>

              <h3>Keyword Matching</h3>

              <p>
                Compare your resume against a job description and discover
                matched and missing keywords.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <Brain size={24} />
              </div>

              <h3>AI Recommendations</h3>

              <p>
                Receive AI-powered suggestions to strengthen your resume and
                improve its overall quality.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>

              <h3>Performance Metrics</h3>

              <p>
                See your resume performance through easy-to-understand progress
                indicators.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <div className="section-badge">Simple Process</div>

            <h2>
              Analyze Your Resume in
              <span> 3 Simple Steps</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>

              <div className="step-icon">
                <Upload size={25} />
              </div>

              <h3>Upload Resume</h3>

              <p>Upload your resume as a PDF file.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>

              <div className="step-icon">
                <Brain size={25} />
              </div>

              <h3>AI Analysis</h3>

              <p>
                Our AI analyzes your resume and compares it with your target job
                description.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>

              <div className="step-icon">
                <BarChart3 size={25} />
              </div>

              <h3>Get Results</h3>

              <p>
                View your ATS score, strengths, weaknesses, keywords, and
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2>Ready to Improve Your Resume?</h2>

              <p>
                Upload your resume and discover what you can improve before
                sending it to recruiters.
              </p>

              <Link to="/analyze">
                <Button>
                  Start Analyzing
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

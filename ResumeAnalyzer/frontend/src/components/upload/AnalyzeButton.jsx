import "./AnalyzeButton.css";

function AnalyzeButton({ onClick, disabled = false, loading = false }) {
  return (
    <button
      type="button"
      className="analyze-button"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Analyzing Resume..." : "Analyze Resume"}
    </button>
  );
}

export default AnalyzeButton;

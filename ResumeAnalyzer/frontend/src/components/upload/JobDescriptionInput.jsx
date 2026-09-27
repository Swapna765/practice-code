import "./JobDescriptionInput.css";

function JobDescriptionInput({ value, onChange }) {
  return (
    <div className="jd-section">
      <div className="jd-header">
        <h2>Job Description</h2>
        <span>Optional</span>
      </div>

      <p className="jd-description">
        Paste the job description to get more accurate keyword matching and ATS
        recommendations.
      </p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the job description here..."
        rows={8}
      />

      <div className="jd-footer">
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}

export default JobDescriptionInput;

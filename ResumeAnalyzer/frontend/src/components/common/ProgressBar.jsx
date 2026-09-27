import "./ProgressBar.css";

function ProgressBar({ value = 0, label, showValue = true }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="progress-wrapper">

      {label && (
        <div className="progress-header">
          <span>{label}</span>

          {showValue && (
            <span className="progress-value">
              {safeValue}%
            </span>
          )}
        </div>
      )}

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>

    </div>
  );
}

export default ProgressBar;
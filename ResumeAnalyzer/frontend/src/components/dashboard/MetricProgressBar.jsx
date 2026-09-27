function MetricProgressBar({ label, value = 0 }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="dashboard-metric">
      <div>
        <span>{label}</span>
        <strong>{score}%</strong>
      </div>
      <div className="dashboard-metric-track">
        <i style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default MetricProgressBar;

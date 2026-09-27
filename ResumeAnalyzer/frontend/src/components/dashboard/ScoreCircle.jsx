function ScoreCircle({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div
      className="dashboard-score-circle"
      style={{ "--score": `${value * 3.6}deg` }}
    >
      <div>
        <strong>{value}</strong>
        <span>/100</span>
      </div>
    </div>
  );
}

export default ScoreCircle;

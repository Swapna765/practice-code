function ScoreBadge({ score = 0 }) {
  const value = Number(score) || 0;
  const label =
    value >= 80
      ? "Excellent"
      : value >= 60
        ? "Good"
        : value >= 40
          ? "Needs work"
          : "Early draft";

  return (
    <span
      className={`dashboard-score-badge score-${value >= 80 ? "high" : value >= 60 ? "medium" : "low"}`}
    >
      {label}
    </span>
  );
}

export default ScoreBadge;

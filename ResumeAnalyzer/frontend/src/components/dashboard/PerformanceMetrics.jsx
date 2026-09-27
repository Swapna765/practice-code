import MetricProgressBar from "./MetricProgressBar";

const metricLabels = {
  atsCompatibility: "ATS compatibility",
  keywordOptimization: "Keyword optimization",
  contentQuality: "Content quality",
  formatting: "Formatting",
};

function PerformanceMetrics({ metrics = {} }) {
  return (
    <section className="dashboard-card resume-health-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="dashboard-kicker">Performance</p>
          <h2>Resume health</h2>
        </div>
      </div>
      <div className="dashboard-metrics">
        {Object.entries(metricLabels).map(([key, label]) => (
          <MetricProgressBar key={key} label={label} value={metrics[key]} />
        ))}
      </div>
    </section>
  );
}

export default PerformanceMetrics;

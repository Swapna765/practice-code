import { CheckCircle2 } from "lucide-react";

function StrengthsCard({ strengths = [] }) {
  return (
    <section className="dashboard-card insight-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="dashboard-kicker">What works</p>
          <h2>Strengths</h2>
        </div>
        <CheckCircle2 />
      </div>
      <ul>
        {strengths.length ? (
          strengths.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>No strengths were returned for this analysis.</li>
        )}
      </ul>
    </section>
  );
}

export default StrengthsCard;

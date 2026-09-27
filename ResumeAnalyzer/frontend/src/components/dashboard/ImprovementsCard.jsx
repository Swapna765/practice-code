import { CircleAlert } from "lucide-react";

function ImprovementsCard({ improvements = [] }) {
  return (
    <section className="dashboard-card insight-card improvements-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="dashboard-kicker">Next steps</p>
          <h2>Improvements</h2>
        </div>
        <CircleAlert />
      </div>
      <ul>
        {improvements.length ? (
          improvements.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>No improvement suggestions were returned.</li>
        )}
      </ul>
    </section>
  );
}

export default ImprovementsCard;

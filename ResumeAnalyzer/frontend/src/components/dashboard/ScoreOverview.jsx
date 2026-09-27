import ScoreBadge from "./ScoreBadge";
import ScoreCircle from "./ScoreCircle";

function ScoreOverview({ score = 0, summary = "" }) {
	return (
		<section className="dashboard-card score-overview">
			<div className="score-overview-copy">
				<p className="dashboard-kicker">Overall assessment</p>
				<h2>Your resume score</h2>
				<ScoreBadge score={score} />
				<p>{summary || "Your AI-powered resume assessment is ready."}</p>
			</div>
			<ScoreCircle score={score} />
		</section>
	);
}

export default ScoreOverview;

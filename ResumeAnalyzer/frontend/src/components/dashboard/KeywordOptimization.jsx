import MissingKeywords from "./MissingKeywords";
import RecommendedKeywords from "./RecommendedKeywords";

function KeywordGroup({ label, items = [], tone }) {
  return (
    <div className="keyword-group">
      <div>
        <span>{label}</span>
        <strong>{items.length}</strong>
      </div>
      <div className="keyword-list">
        {items.length ? (
          items.map((keyword) => (
            <span className={`keyword-chip ${tone}`} key={keyword}>
              {keyword}
            </span>
          ))
        ) : (
          <small>None found</small>
        )}
      </div>
    </div>
  );
}

function KeywordOptimization({ keywords = {} }) {
  return (
    <section className="dashboard-card keyword-card">
      <div className="dashboard-card-heading">
        <div>
          <p className="dashboard-kicker">Matching signals</p>
          <h2>Keyword optimization</h2>
        </div>
      </div>
      <div className="keyword-groups">
        <KeywordGroup label="Matched" items={keywords.matched || []} tone="matched" />
        <MissingKeywords items={keywords.missing || []} />
        <RecommendedKeywords items={keywords.recommended || []} />
      </div>
    </section>
  );
}

export default KeywordOptimization;

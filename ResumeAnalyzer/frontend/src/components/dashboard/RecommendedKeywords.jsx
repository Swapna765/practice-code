function RecommendedKeywords({ items = [] }) {
  return (
    <div className="keyword-group">
      <div>
        <span>Recommended</span>
        <strong>{items.length}</strong>
      </div>
      <div className="keyword-list">
        {items.length ? (
          items.map((item) => (
            <span className="keyword-chip recommended" key={item}>
              {item}
            </span>
          ))
        ) : (
          <small>None found</small>
        )}
      </div>
    </div>
  );
}

export default RecommendedKeywords;

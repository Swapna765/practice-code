function MissingKeywords({ items = [] }) {
  return (
    <div className="keyword-group">
      <div>
        <span>Missing</span>
        <strong>{items.length}</strong>
      </div>
      <div className="keyword-list">
        {items.length ? (
          items.map((item) => (
            <span className="keyword-chip missing" key={item}>
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

export default MissingKeywords;

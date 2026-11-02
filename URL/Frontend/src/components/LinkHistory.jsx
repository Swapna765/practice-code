function LinkHistory({ links, loading, copiedLink, onCopy }) {
  return (
    <section className="history-panel" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <p className="section-kicker">YOUR ACCOUNT</p>
          <h2 id="history-title">Link history</h2>
        </div>
        <span className="history-count">{links.length} {links.length === 1 ? 'link' : 'links'}</span>
      </div>

      {loading ? (
        <p className="history-empty">Loading your links…</p>
      ) : links.length === 0 ? (
        <p className="history-empty">Links you create while signed in will appear here.</p>
      ) : (
        <div className="history-list">
          {links.map((link) => (
            <article className="history-row" key={link._id}>
              <div className="history-url">
                <span className="history-label">LONG URL</span>
                <a href={link.full_url} target="_blank" rel="noreferrer" title={link.full_url}>
                  {link.full_url}
                </a>
              </div>
              <div className="history-url history-short-url">
                <span className="history-label">SHORT URL</span>
                <a href={link.shortUrl} target="_blank" rel="noreferrer">
                  {link.shortUrl}
                </a>
              </div>
              <button
                className="history-copy"
                type="button"
                onClick={() => onCopy(link.shortUrl)}
                aria-label={`Copy short link ${link.short_url}`}
              >
                {copiedLink === link.shortUrl ? 'Copied' : 'Copy'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default LinkHistory

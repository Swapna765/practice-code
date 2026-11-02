function ShortLinkResult({ link, copied, onCopy }) {
  if (!link) return null

  return (
    <div className="result-card" role="status">
      <span className="result-check" aria-hidden="true">✓</span>
      <div className="result-copy">
        <span className="result-label">YOUR SHORT LINK IS READY</span>
        <a href={link} target="_blank" rel="noreferrer">{link}</a>
      </div>
      <button className="copy-button" onClick={() => onCopy(link)}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}

export default ShortLinkResult

function ShortenerForm({
  url,
  slug,
  creating,
  isSignedIn,
  onUrlChange,
  onSlugChange,
  onOpenSignIn,
  onSubmit,
}) {
  return (
    <section className="workspace" aria-label="Create a short link">
      <div className="section-heading">
        <div>
          <p className="section-kicker">GET STARTED</p>
          <h2>Shorten a link</h2>
        </div>
        <span className="free-badge">FREE · NO SIGN-UP NEEDED</span>
      </div>

      <form className="shorten-form" onSubmit={onSubmit}>
        <label className="field-label" htmlFor="long-url">PASTE YOUR LONG URL</label>
        <div className="url-input-wrap">
          <span className="input-icon" aria-hidden="true">↗</span>
          <input
            id="long-url"
            type="url"
            placeholder="https://example.com/your/very/long/link"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            required
          />
        </div>

        <div className="form-bottom">
          <label className="slug-field" htmlFor="custom-slug">
            <span className="field-label">
              CUSTOM ENDING <span className="optional">(OPTIONAL)</span>
            </span>
            <span className="slug-input-wrap">
              <span className="slug-prefix">snip /</span>
              <input
                id="custom-slug"
                type="text"
                placeholder="your-name"
                value={slug}
                onChange={(event) => onSlugChange(event.target.value)}
                disabled={!isSignedIn}
                minLength={3}
                maxLength={30}
                pattern="[A-Za-z0-9-]{3,30}"
                title="Use 3–30 letters, numbers, or hyphens."
              />
            </span>
          </label>
          <button className="primary-button" type="submit" disabled={creating}>
            {creating ? 'Making your link…' : <>Shorten link <span aria-hidden="true">↗</span></>}
          </button>
        </div>
        <p className="form-hint">
          {isSignedIn
            ? 'Custom endings use 3–30 letters, numbers, or hyphens.'
            : <>
              <button className="custom-slug-sign-in" type="button" onClick={onOpenSignIn}>
                Sign in
              </button>
              {' '}to choose a custom ending and see your link history.
            </>}
        </p>
      </form>
    </section>
  )
}

export default ShortenerForm

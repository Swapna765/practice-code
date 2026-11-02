function AuthPanel({ mode, form, loading, onModeChange, onFieldChange, onSubmit }) {
  const isRegistering = mode === 'register'

  return (
    <div className="account-card">
      <div className="account-intro">
        <span className="account-icon" aria-hidden="true">✳</span>
        <p className="section-kicker">MAKE IT YOURS</p>
        <h2>{isRegistering ? 'Your own little link hub.' : 'Keep your links close.'}</h2>
        <p>
          {isRegistering
            ? 'Create a free account to choose custom link endings and see your link history in one place.'
            : 'Sign in to choose custom link endings and see your link history in one place.'}
        </p>
        <div className="feature-points">
          <span><b>✓</b> Choose a memorable ending</span>
          <span><b>✓</b> See your long and short links</span>
          <span><b>✓</b> Shorten links without an account</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={onSubmit} autoComplete="off">
        <div>
          <p className="section-kicker">{isRegistering ? 'GET STARTED' : 'WELCOME BACK'}</p>
          <h3 id="auth-dialog-title">{isRegistering ? 'Create your account' : 'Sign in'}</h3>
        </div>

        {isRegistering && (
          <label className="auth-field">
            <span>Your name</span>
            <input
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={onFieldChange}
              required
              minLength={2}
            />
          </label>
        )}

        <label className="auth-field">
          <span>Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={onFieldChange}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={onFieldChange}
            required
            minLength={isRegistering ? 8 : undefined}
          />
          {isRegistering && <small>At least 8 characters.</small>}
        </label>

        <button className="primary-button auth-submit" type="submit" disabled={loading}>
          {loading ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}
        </button>
        <p className="auth-switch">
          {isRegistering ? 'Already have an account?' : 'New around here?'}{' '}
          <button type="button" onClick={onModeChange}>
            {isRegistering ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default AuthPanel

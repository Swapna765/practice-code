function Header({ user, loading, onOpenAuth, onSignOut }) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="Snip">
        <span className="brand-mark" aria-hidden="true">s</span>
        <span>snip<span className="brand-dot">.</span></span>
      </div>
      <div className="topbar-right">
        <span className="topbar-note">Links, made memorable.</span>
        {!loading && (
          user
            ? <button className="text-button" onClick={onSignOut}>Sign out</button>
            : <div className="auth-actions">
              <button className="text-button" onClick={() => onOpenAuth('login')}>Sign in</button>
              <button className="text-button auth-create-button" onClick={() => onOpenAuth('register')}>
                Create account
              </button>
            </div>
        )}
      </div>
    </header>
  )
}

export default Header

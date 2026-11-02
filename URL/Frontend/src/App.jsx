import { useEffect, useState } from 'react'
import AuthPanel from './components/AuthPanel.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import LinkHistory from './components/LinkHistory.jsx'
import ShortenerForm from './components/ShortenerForm.jsx'
import ShortLinkResult from './components/ShortLinkResult.jsx'
import {
  authenticate,
  createShortLink,
  getCurrentUser,
  getUrlHistory,
  signOut,
} from './services/api.js'
import './App.css'

const emptyAuthForm = { name: '', email: '', password: '' }

function App() {
  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [result, setResult] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [authForm, setAuthForm] = useState(emptyAuthForm)
  const [authLoading, setAuthLoading] = useState(false)
  const [copiedLink, setCopiedLink] = useState('')

  useEffect(() => {
    let active = true

    async function loadAccount() {
      try {
        const { user: currentUser } = await getCurrentUser()
        if (!active) return
        setUser(currentUser)
        setHistoryLoading(true)
        try {
          const { urls } = await getUrlHistory()
          if (active) setHistory(urls)
        } catch (error) {
          if (active) setMessage(error.message)
        } finally {
          if (active) setHistoryLoading(false)
        }
      } catch {
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAccount()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!authOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setAuthOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [authOpen])

  async function refreshHistory() {
    setHistoryLoading(true)
    try {
      const { urls } = await getUrlHistory()
      setHistory(urls)
    } finally {
      setHistoryLoading(false)
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    setMessage('')
    setResult('')
    setCopiedLink('')
    setCreating(true)

    try {
      const { shortUrl } = await createShortLink(url, slug.trim())
      setResult(shortUrl)
      setUrl('')
      setSlug('')
      if (user) await refreshHistory()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleAuthenticate(event) {
    event.preventDefault()
    setMessage('')
    setAuthLoading(true)

    try {
      const { user: signedInUser } = await authenticate(authMode, authForm)
      setUser(signedInUser)
      setAuthForm(emptyAuthForm)
      setAuthOpen(false)
      await refreshHistory()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleSignOut() {
    setMessage('')
    try {
      await signOut()
      setUser(null)
      setHistory([])
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handleCopyLink(link) {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(link)
      window.setTimeout(() => setCopiedLink(''), 1800)
    } catch {
      setMessage('Could not access the clipboard. Copy the link directly instead.')
    }
  }

  function handleAuthFieldChange(event) {
    const { name, value } = event.target
    setAuthForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function toggleAuthMode() {
    setAuthMode((currentMode) => currentMode === 'login' ? 'register' : 'login')
    setMessage('')
  }

  function openAuth(mode) {
    setAuthMode(mode)
    setMessage('')
    setAuthOpen(true)
  }

  return (
    <main className="page-shell">
      <Header
        user={user}
        loading={loading}
        onOpenAuth={openAuth}
        onSignOut={handleSignOut}
      />
      <Hero />

      <ShortenerForm
        url={url}
        slug={slug}
        creating={creating}
        isSignedIn={Boolean(user)}
        onUrlChange={setUrl}
        onSlugChange={setSlug}
        onOpenSignIn={() => openAuth('login')}
        onSubmit={handleCreate}
      />
      {message && !authOpen && <p className="message error-message" role="alert">{message}</p>}
      <ShortLinkResult
        link={result}
        copied={copiedLink === result}
        onCopy={handleCopyLink}
      />

      {user && (
        <LinkHistory
          links={history}
          loading={historyLoading}
          copiedLink={copiedLink}
          onCopy={handleCopyLink}
        />
      )}

      <Footer />

      {authOpen && !user && (
        <div
          className="auth-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAuthOpen(false)
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
          >
            <button
              className="auth-modal-close"
              type="button"
              aria-label="Close sign in"
              onClick={() => setAuthOpen(false)}
            >
              ×
            </button>
            {message && <p className="message error-message auth-modal-message" role="alert">{message}</p>}
            <AuthPanel
              mode={authMode}
              form={authForm}
              loading={authLoading}
              onModeChange={toggleAuthMode}
              onFieldChange={handleAuthFieldChange}
              onSubmit={handleAuthenticate}
            />
          </section>
        </div>
      )}
    </main>
  )
}

export default App

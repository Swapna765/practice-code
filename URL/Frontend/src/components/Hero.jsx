function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR LINK, LESS LONG</div>
        <h1>Make every link<br />a little <span>snappier.</span></h1>
        <p className="hero-description">
          Turn long, messy URLs into short links that are easy to share and remember.
        </p>
      </div>

      <aside className="hero-note">
        <span className="note-icon" aria-hidden="true">↗</span>
        <p>One small link.<br /><strong>A whole lot simpler.</strong></p>
      </aside>
    </section>
  )
}

export default Hero

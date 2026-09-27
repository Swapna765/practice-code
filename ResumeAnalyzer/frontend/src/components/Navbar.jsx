import { NavLink, Link } from "react-router-dom";
import { FileSearch, Menu, X } from "lucide-react";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <FileSearch size={22} />
          </div>

          <span>CV<span className="logo-highlight">Spark</span></span>
        </Link>

        {/* Navigation */}
        <div className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `navbar-link ${isActive ? "is-active" : ""}`}>
            Home
          </NavLink>

          <NavLink to="/analyze" onClick={closeMenu} className={({ isActive }) => `navbar-link ${isActive ? "is-active" : ""}`}>
            Analyze Resume
          </NavLink>

          <NavLink to="/history" onClick={closeMenu} className={({ isActive }) => `navbar-link ${isActive ? "is-active" : ""}`}>
            History
          </NavLink>
        </div>

        {/* Analyze Button */}
        <Link to="/analyze" onClick={closeMenu} className="navbar-button">
          Analyze Now
        </Link>

        <button className="navbar-menu" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
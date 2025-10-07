import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("THEME_MODE") || "light"
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    setIsAuthenticated(token && token.length > 10); // Sécurité renforcée
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("THEME_MODE", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  // ⬆️ Autres imports...
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/search?q=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");

        if (!isJson) {
          const rawText = await response.text();
          console.warn("🚨 Réponse inattendue reçue :");
          console.warn("🔹 Type de contenu :", contentType);
          console.warn("🔹 Contenu brut :", rawText);
          throw new Error("Réponse non JSON reçue du serveur.");
        }

        const results = await response.json();
        const hasUsers =
          results.groupedUsers && Object.keys(results.groupedUsers).length > 0;
        const hasResources =
          results.groupedResources &&
          Object.keys(results.groupedResources).length > 0;

        if (!hasUsers && !hasResources) {
          onSearch(null);
          setFeedback("Aucun résultat trouvé.");
        } else {
          onSearch(results);
          setFeedback("");
        }
      } catch (err) {
        console.error("Erreur lors de la recherche :", err);
        setFeedback("❌ Erreur lors de la recherche.");
        onSearch(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFeedback("");
      onSearch(null);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-brand">
        <Link to="/">
          <img src="/freedev.jpg" alt="FreeDev Logo" className="logo" />
          <span className="site-name">FreeDev</span>
        </Link>
      </div>

      <button className="navbar-toggle" onClick={toggleNavbar}>
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? "is-open" : ""}`}>
        <Link to="/freedev" onClick={closeNavbar}>
          FreeDev
        </Link>
        <Link to="/freeresources" onClick={closeNavbar}>
          Resources
        </Link>
        <Link to="/aboutus" onClick={closeNavbar}>
          About Us
        </Link>

        {isAuthenticated ? (
          <div className="user-actions">
            <Link to="/dashboard" onClick={closeNavbar}>
              Dashboard
            </Link>
            <div className="user-dropdown">
              <img src="/avatar.jpg" alt="User" className="avatar" />
              <div className="dropdown-menu">
                <Link to="/profile" onClick={closeNavbar}>
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeNavbar();
                  }}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" onClick={closeNavbar}>
            Login
          </Link>
        )}

        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="search-group">
          <label htmlFor="site-search" className="visually-hidden">
            Rechercher
          </label>
          <input
            id="site-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Rechercher un profil ou une ressource"
            className="search-input"
          />
        </div>

        {isLoading && <div className="loader-spinner"></div>}

        {feedback && (
          <p
            className={`search-feedback ${
              feedback.includes("❌") ? "error" : "info"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

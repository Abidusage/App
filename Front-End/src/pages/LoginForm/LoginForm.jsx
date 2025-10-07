import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "../LoginForm/LoginForm.css";
import LoadingIndicator from "../../components/LoadingIndicator";

function LoginForm({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // 🔐 Redirection automatique si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await api.post(
        route,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.detail || "Connexion échouée"
        : "Erreur réseau";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="description">
        <p className="parag">
          Welcome back, Dear 👋! Our platform is built to help developers like
          you showcase your talent, discover new opportunities, and make a
          meaningful impact. Log in to access your dashboard and start building.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && (
          <p className={`error-message fade-in ${error ? "show" : ""}`}>
            ❌ {error}
          </p>
        )}
        {success && (
          <p className="success-message fade-in">
            ✅ Login successful. Redirecting...
          </p>
        )}
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Login"}
        </button>
        <div className="form-links">
          <a href="/register">Don’t have an account?</a>
          <span> | </span>
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

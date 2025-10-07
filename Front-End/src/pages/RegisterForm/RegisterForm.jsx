import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../RegisterForm/RegisterForm.css";
import LoadingIndicator from "../../components/LoadingIndicator";

function RegisterForm({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordrepeat, setPasswordrepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // 👤 Redirection si utilisateur déjà enregistré
  useEffect(() => {
    if (localStorage.getItem("user_registered")) {
      navigate("/login");
    }
  }, [navigate]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setSuccess(false);

    try {
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }
      if (password !== passwordrepeat) {
        throw new Error("Passwords do not match.");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      const response = await api.post(
        route,
        { username, password, email },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("user_registered", true);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data || { detail: error.message || "Registration failed." }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="description">
        <h1>Welcome 🎉</h1>
        <p>
          Join a community built to elevate your skills and connect you to
          meaningful opportunities. From intuitive tools to powerful resources,
          we’ve crafted a seamless experience to support your journey.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
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
          {error.username && <p className="error-message fade-in">{error.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {error.email && <p className="error-message fade-in">{error.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            required
          />
          {error.password && <p className="error-message fade-in">{error.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="passwordrepeat">Confirm Password</label>
          <input
            id="passwordrepeat"
            className="form-input"
            type="password"
            value={passwordrepeat}
            onChange={(e) => setPasswordrepeat(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>
        {error.detail && <p className="error-message fade-in">{error.detail}</p>}
        {success && (
          <p className="success-message fade-in">✅ Registration successful! Redirecting...</p>
        )}
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Register"}
        </button>
        <div className="form-links">
          <a href="/login">Already have an account? Login here</a>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;

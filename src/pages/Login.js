import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css"; // same file used in Register page

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/user/login", form);
      const { token, user } = res.data;

      login(token, user);
      setSuccess(`🎉 Welcome back, ${user.username || "User"}!`);
      setTimeout(() => navigate("/todo"), 1500);
    } catch (err) {
      if (err.response) {
        const msg =
          err.response.data?.message ||
          err.response.data?.error ||
          "Invalid email or password.";
        setError(`${msg}`);
      } else if (err.request) {
        setError("Unable to reach the server. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Warda's Task Manager</h2>
      <h3>Login</h3>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <p className="auth-footer">
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;

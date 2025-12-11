// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import useAuth from "../components/hooks/UseAuth";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "joiner",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Check if email already exists
      const check = await api.get(`/users?email=${formData.email}`);

      if (check.data.length > 0) {
        setError("Email is already registered.");
        setLoading(false);
        return;
      }

      const user = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      const res = await api.post("/users", user);

      // Save user in AuthContext
      setCurrentUser(res.data);

      // Redirect to home
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />

        <label htmlFor="role">Register As</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="joiner">Event Joiner</option>
          <option value="hoster">Event Hoster</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </main>
  );
}

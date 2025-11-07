import { useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../components/context/UsersProvider";
import { useNavigate, Link } from "react-router";
import "./Login.css"

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.get(
        `users?email=${formData.email}&password=${formData.password}`
      );

      if (response.data.length > 0) {
        const user = response.data[0];
        setCurrentUser(user);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <main className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;

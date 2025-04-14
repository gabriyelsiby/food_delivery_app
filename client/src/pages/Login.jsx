import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../config/axios";
import Navbar from "../components/Navbar"; // Added Navbar import
import Footer from "../components/Footer"; // Added Footer import

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/user/login", form);
      const { token, data } = res.data;

      // Save the token to localStorage
      localStorage.setItem("token", token || "true");

      // Redirect based on user role
      if (data?.role === "admin") {
        navigate("/admin/Dashboard");  // <-- match the route in App.jsx
      } else if (data?.role === "restaurant") {
        navigate("/restaurant/dashboard");
      } else if (data?.role === "delivery") {
        navigate("/delivery/dashboard");
      } else {
        navigate("/");  // Normal user home
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar /> {/* Added Navbar */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 shadow rounded">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Foodie 🍔</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-white py-2 rounded hover:from-yellow-500 hover:to-red-600 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer /> {/* Added Footer */}
    </>
  );
};

export default Login;

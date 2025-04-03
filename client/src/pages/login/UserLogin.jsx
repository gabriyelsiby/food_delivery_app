import { useState, useContext } from "react";
import { userLogin } from "../../api/userApi";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await userLogin(formData);
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data)); // ✅ Persist login state
      navigate("/home"); // ✅ Redirect to home where Navbar is loaded
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">User Login</h2>
      <form onSubmit={handleSubmit} className="w-80 p-4 border rounded shadow">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/signup/user" className="text-blue-500 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default UserLogin;

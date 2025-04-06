import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Call the correct API endpoint
      const res = await axiosInstance.post("/user/signup", formData);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">User Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        {["name", "email", "mobile", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded-md"
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default UserSignup;

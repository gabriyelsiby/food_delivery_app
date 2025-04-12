import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantAuth } from "../../context/RestaurantAuthContext";

const RestaurantLogin = () => {
  const { login } = useRestaurantAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/restaurant/dashboard");
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Restaurant Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="bg-orange-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default RestaurantLogin;

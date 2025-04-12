import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantAuth } from "../../context/RestaurantAuthContext";

const RestaurantSignup = () => {
  const { signup } = useRestaurantAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    cuisine: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate("/restaurant/dashboard");
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Restaurant Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="name" placeholder="Restaurant Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="text" name="cuisine" placeholder="Cuisine" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <button className="bg-orange-500 text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default RestaurantSignup;

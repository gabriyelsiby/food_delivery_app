import { useState } from "react";
import axios from "../../config/axiosInstance";
import { toast } from "react-toastify";

const RestaurantCreateFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post("/food/create-food", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(res.data.message);
      setFormData({ name: "", description: "", price: "", category: "", image: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create food");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create New Food</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full input" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full input" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full input" required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full input" required />
        <input type="file" name="image" onChange={handleChange} accept="image/*" className="w-full" required />
        <button type="submit" className="btn btn-primary w-full">Create</button>
      </form>
    </div>
  );
};

export default RestaurantCreateFood;

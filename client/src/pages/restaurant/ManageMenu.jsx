// C:\food_deliveryapp - test\client\src\pages\restaurant\ManageMenu.jsx

import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

const ManageMenu = () => {
  const [foods, setFoods] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  // Fetch all food items on page load
  const fetchFoodItems = async () => {
    try {
      const res = await axios.get("/food/food-list");
      setFoods(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load food items");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Delete food item
  const handleDelete = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/food/delete-food/${foodId}`);
      toast.success("Food item deleted successfully");
      fetchFoodItems();  // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete food item");
    }
  };

  // Load food item for editing
  const handleEdit = (food) => {
    setEditMode(true);
    setCurrentFood(food);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
    });
  };

  // Submit updated food
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/food/update-food/${currentFood._id}`, form);
      toast.success("Food item updated successfully");
      setEditMode(false);
      setCurrentFood(null);
      fetchFoodItems();  // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update food item");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Manage Menu</h2>

      {editMode && (
        <form onSubmit={handleUpdate} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-xl mb-2">Edit Food Item</h3>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="block w-full p-2 border mb-2"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="block w-full p-2 border mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="block w-full p-2 border mb-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="block w-full p-2 border mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Update
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setCurrentFood(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <div
            key={food._id}
            className="border p-4 rounded-lg shadow flex flex-col justify-between"
          >
            <div>
              <h4 className="font-bold text-lg">{food.name}</h4>
              <p>{food.description}</p>
              <p className="mt-1">₹{food.price}</p>
              <p className="text-sm text-gray-500">{food.category}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(food)}
                className="px-3 py-1 bg-yellow-400 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(food._id)}
                className="px-3 py-1 bg-red-500 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenu;

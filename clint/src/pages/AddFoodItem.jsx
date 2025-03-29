// src/pages/AddFoodItem.jsx
import React, { useState } from "react";
import axios from "axios";

const AddFoodItem = () => {
  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("description", foodData.description);
    formData.append("price", foodData.price);
    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost:5000/api/food/create-food", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMessage("Food item created successfully!");
        setFoodData({ name: "", description: "", price: "" });
        setImage(null);
      })
      .catch((error) => {
        console.error("Error creating food item:", error);
        setMessage("Failed to create food item.");
      });
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Food Item</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Food Name</label>
          <input
            type="text"
            name="name"
            value={foodData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={foodData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={foodData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Food Image</label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Food Item
        </button>
      </form>
    </div>
  );
};

export default AddFoodItem;

// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import CategoryList from "../components/CategoryList";
import FoodCard from "../components/FoodCard";
import axiosInstance from "../config/axiosInstance";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axiosInstance.get("/food/food-list", {
          params: selectedCategory ? { category: selectedCategory } : {},
        });
        setFoods(res.data.data);
      } catch (err) {
        setFoods([]);
      }
    };
    fetchFoods();
  }, [selectedCategory]);

  const handleAddToCart = (food) => {
    // 👉 Add cart logic here (use Zustand or Context API)
    console.log("Add to Cart:", food.name);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Browse by Category</h1>
      <CategoryList onSelectCategory={setSelectedCategory} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {!foods.length && (
        <div className="text-center text-gray-500 mt-10">No food items found.</div>
      )}
    </div>
  );
};

export default Home;

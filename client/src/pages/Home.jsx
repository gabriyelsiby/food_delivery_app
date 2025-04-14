import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/ui/CategoryList";
import FoodCard from "../components/ui/FoodCard";
import axios from "../config/axios";
import { toast } from "react-toastify";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/food/food-list", {
          params: selectedCategory ? { category: selectedCategory } : {},
        });
        setFoods(res.data.data);
      } catch (err) {
        console.error("Error fetching foods:", err.message);
        setFoods([]);
      }
    };
    fetchFoods();
  }, [selectedCategory]);

  const handleViewDetails = (food) => {
    navigate(`/food/${food._id}`, { state: { food } });
  };

  const handleAddToCart = async (food) => {
    try {
      await axios.post("/cart/add", {
        foodId: food._id,
        quantity: 1,
      });
      toast.success(`${food.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err.message);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Browse by Category</h1>
      <CategoryList onSelectCategory={setSelectedCategory} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods.map((food) => (
          <FoodCard
            key={food._id}
            food={food}
            onAddToCart={() => handleAddToCart(food)}
            onViewDetails={() => handleViewDetails(food)}
          />
        ))}
      </div>

      {!foods.length && (
        <div className="text-center text-gray-500 mt-10">No food items found.</div>
      )}
    </div>
  );
};

export default Home;

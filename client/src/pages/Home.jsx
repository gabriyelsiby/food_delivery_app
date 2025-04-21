import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/ui/CategoryList";
import FoodCard from "../components/ui/FoodCard";
import axios from "../config/axios";
import { toast } from "react-toastify";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await axios.get("/food/food-list", {
          params: selectedCategory ? { category: selectedCategory } : {},
        });
        setFoods(res.data.data);
      } catch (err) {
        console.error("Error fetching foods:", err.message);
        setFoods([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchFoods();
  }, [selectedCategory]);

  const handleViewDetails = (food) => {
    navigate(`/food/${food._id}`, { state: { food } });
  };

  const handleAddToCart = async (food) => {
    if (!isLoggedIn) {
      toast.error("Please login");
      return;
    }
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

      {loading ? ( // Show spinner while loading
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
      )}

      {!loading && !foods.length && (
        <div className="text-center text-gray-500 mt-10">No food items found.</div>
      )}
    </div>
  );
};

export default Home;

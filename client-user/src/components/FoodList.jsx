// components/FoodList.jsx
import React, { useEffect, useState } from "react";
import axios from "../config/axiosInstance";
import useCartStore from "../store/cartStore";

const FoodList = ({ category }) => {
  const [foods, setFoods] = useState([]);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/food/food-list");
        const filtered = res.data.data.filter(
          (food) => food.category === category
        );
        setFoods(filtered);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoods();
  }, [category]);

  return (
    <div>
      <h3 className="text-xl font-semibold my-4">Foods in {category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food._id} className="border p-4 rounded-xl shadow">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="text-lg font-bold mt-2">{food.name}</h4>
            <p className="text-sm">{food.description}</p>
            <p className="text-sm text-gray-500">Rating: ⭐ {food.rating}</p>
            <p className="text-sm text-gray-600">
              Restaurant: {food.restaurant.name}
            </p>
            <button
              className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              onClick={() => addToCart(food)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;

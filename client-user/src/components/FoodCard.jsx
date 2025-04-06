// src/components/FoodCard.jsx
import React from "react";
import { useCartStore } from "../store/cartStore";

const FoodCard = ({ food }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img
        src={food.image}
        alt={food.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/fallback-food.jpg"; // fallback image in public folder
        }}
        className="w-full h-48 object-cover rounded-t-xl"
      />
      <h2 className="text-lg font-semibold mt-2">{food.name}</h2>
      <p className="text-sm text-gray-600">{food.description}</p>
      <p className="mt-1 font-bold text-green-600">₹{food.price}</p>
      <button
        onClick={() => addToCart(food)}
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default FoodCard;

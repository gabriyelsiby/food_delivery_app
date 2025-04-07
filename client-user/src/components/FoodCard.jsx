// src/components/FoodCard.jsx
import React from "react";

const FoodCard = ({ food, onAddToCart }) => {
  return (
    <div className="w-full sm:w-64 bg-white rounded-xl shadow-md p-4">
      <img
        src={`http://localhost:5000/${food.imageUrl}`}
        alt={food.name}
        className="h-40 w-full object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold mt-2">{food.name}</h2>
      <p className="text-gray-600">{food.description}</p>
      <p className="text-sm text-gray-500 mt-1">From: {food.restaurant?.name || "Restaurant"}</p>
      <p className="text-lg font-bold mt-1">₹{food.price}</p>
      <button
        onClick={() => onAddToCart(food)}
        className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default FoodCard;

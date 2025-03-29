// filepath: c:\Users\gabriyel\OneDrive\Desktop\food-delivery-app\src\components\FoodCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FoodCard = ({ food, onAddToCart }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <img src={food.imageUrl} alt={food.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{food.name}</h2>
        <p className="text-gray-600">{food.description}</p>
        <p className="text-green-600 font-bold mt-2">${food.price.toFixed(2)}</p>
        <Link to={`/food/${food._id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          View Details
        </Link>
        <button
          onClick={() => onAddToCart(food)}
          className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
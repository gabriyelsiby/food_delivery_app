// src/pages/FoodDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FoodReviews from "../components/FoodReviews";

const FoodDetails = () => {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/food/food-details/${foodId}`)
      .then((response) => {
        setFood(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food details:", error);
        setLoading(false);
      });
  }, [foodId]);

  if (loading) return <p>Loading...</p>;
  if (!food) return <p>Food item not found.</p>;

  return (
    <div className="p-4">
      <img src={food.imageUrl} alt={food.name} className="w-full h-64 object-cover rounded" />
      <h1 className="mt-4 text-2xl font-bold">{food.name}</h1>
      <p className="mt-2 text-gray-600">{food.description}</p>
      <p className="mt-2 text-green-600 font-semibold">${food.price.toFixed(2)}</p>
      {/* Render the FoodReviews component */}
      <FoodReviews foodId={foodId} />
    </div>
  );
};

export default FoodDetails;

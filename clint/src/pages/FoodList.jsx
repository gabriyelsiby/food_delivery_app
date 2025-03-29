// src/pages/FoodList.jsx
import React, { useEffect, useState } from 'react';
import { getAllFoodItems } from '../api/api'; // Adjust based on your API file
import FoodCard from '../components/FoodCard';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getAllFoodItems()
      .then(response => {
        const data = response.data; // Access the 'data' field
        setFoods(data); // Set 'data' to foods state
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (food) => {
    setCart([...cart, food]);
    console.log('Cart:', cart);
  };

  if (loading) return <p>Loading food items...</p>;

  return (
    <div className="food-list">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      <div className="food-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map(food => (
          <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default FoodList;

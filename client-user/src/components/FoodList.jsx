import React from 'react';
import FoodCard from './FoodCard';

const FoodList = ({ foodItems }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {foodItems.length === 0 ? (
        <div className="col-span-full bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No food items found in this category.</p>
        </div>
      ) : (
        foodItems.map((food) => (
          <div key={food._id}>
            <FoodCard food={food} />
          </div>
        ))
      )}
    </div>
  );
};

export default FoodList;
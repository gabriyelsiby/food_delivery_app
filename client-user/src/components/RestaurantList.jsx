// src/components/RestaurantList.jsx
import React from "react";

const RestaurantList = ({ restaurants, onSelect }) => {
  if (!restaurants.length) return <p>No restaurants found for this category.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {restaurants.map((res) => (
        <div
          key={res._id}
          onClick={() => onSelect(res)}
          className="cursor-pointer border p-3 rounded-xl shadow hover:bg-gray-100 transition"
        >
          <h3 className="text-lg font-semibold">{res.name}</h3>
          <p className="text-sm text-gray-500">{res.email}</p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;

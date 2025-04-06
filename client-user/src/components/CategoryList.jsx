// components/CategoryList.jsx
import React, { useEffect, useState } from "react";
import axios from "../config/axiosInstance";

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Food Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => onCategorySelect(cat)}
            className="bg-orange-100 hover:bg-orange-200 p-4 rounded-xl shadow-md"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

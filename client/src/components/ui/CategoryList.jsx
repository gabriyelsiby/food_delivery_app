// src/components/CategoryList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";

const CategoryList = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/food/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-400">
      {categories.map((cat) => (
        <div
          key={cat._id}
          onClick={() => onSelectCategory(cat.name)}
          className="cursor-pointer bg-gray-100 hover:bg-gray-300 px-4 py-2 rounded-lg shadow whitespace-nowrap"
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;

// pages/Home.jsx
import React, { useState } from "react";
import CategoryList from "../components/CategoryList";
import FoodList from "../components/FoodList";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="p-4">
      <CategoryList onCategorySelect={setSelectedCategory} />
      {selectedCategory && <FoodList category={selectedCategory} />}
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { getAllFoodItems } from "../api/foodApi";

const Home = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Fetch food items and extract unique categories
  const fetchFoodItems = async () => {
    const items = await getAllFoodItems();
    setFoodItems(items);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    setCategories(uniqueCategories);
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? foodItems.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Food Categories</h2>
      
      {/* Display Categories */}
      <div className="flex gap-4 mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
              selectedCategory === category ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display Food Items of Selected Category */}
      <h3 className="text-2xl font-semibold mb-3">
        {selectedCategory ? `${selectedCategory} Items` : "Select a Category"}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((food) => (
            <div key={food._id} className="border p-4 rounded shadow">
              <img src={`http://localhost:5000/${food.imageUrl}`} alt={food.name} className="w-full h-40 object-cover rounded"/>
              <h4 className="text-xl font-semibold mt-2">{food.name}</h4>
              <p className="text-gray-600">{food.description}</p>
              <p className="font-bold">₹{food.price}</p>
            </div>
          ))
        ) : (
          <p>No items available for this category</p>
        )}
      </div>
    </div>
  );
};

export default Home;

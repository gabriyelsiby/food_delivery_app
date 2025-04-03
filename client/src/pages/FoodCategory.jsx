import { Link } from "react-router-dom";

const categories = [
  { name: "Pizza", image: "/images/pizza.jpg", path: "/restaurants?category=pizza" },
  { name: "Burger", image: "/images/burger.jpg", path: "/restaurants?category=burger" },
  { name: "Chinese", image: "/images/chinese.jpg", path: "/restaurants?category=chinese" },
  { name: "Desserts", image: "/images/desserts.jpg", path: "/restaurants?category=desserts" },
];

const FoodCategory = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="block bg-white rounded-lg shadow-lg p-4 text-center transform transition hover:scale-105"
        >
          <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-md mb-2" />
          <h3 className="text-lg font-semibold">{item.name}</h3>
        </Link>
      ))}
    </div>
  );
};

export default FoodCategory;

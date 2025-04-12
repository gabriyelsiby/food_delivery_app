// src/components/ui/FoodCard.jsx

const FoodCard = ({ food, onAddToCart }) => {
    return (
      <div className="bg-white rounded-2xl shadow p-4 space-y-3 hover:shadow-lg transition duration-300">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-40 object-cover rounded-xl"
        />
        <div className="text-lg font-semibold text-gray-800">{food.name}</div>
        <div className="text-sm text-gray-500">
          By {food.restaurant?.name || "Unknown"}
        </div>
        <div className="text-rose-600 font-bold text-md">₹{food.price}</div>
        <button
          onClick={onAddToCart}
          className="mt-2 w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700"
        >
          Add to Cart
        </button>
      </div>
    );
  };
  
  export default FoodCard;
  
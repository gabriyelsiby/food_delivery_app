import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { toast } from "react-toastify";

const RestaurantManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("/restaurant/foods", { withCredentials: true });
      setFoods(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      const res = await axios.delete(`/restaurant/foods/${id}`, { withCredentials: true });
      toast.success(res.data.message);
      setFoods(foods.filter((f) => f._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Your Foods</h2>
      {foods.length === 0 ? (
        <p>No food items created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div key={food._id} className="bg-white rounded-xl shadow p-4">
              <img src={`/${food.imageUrl}`} alt={food.name} className="w-full h-40 object-cover rounded" />
              <h3 className="text-lg font-bold mt-2">{food.name}</h3>
              <p className="text-sm text-gray-500">{food.category}</p>
              <p className="text-sm mt-1">{food.description}</p>
              <p className="text-sm font-semibold mt-1">₹{food.price}</p>
              <div className="flex justify-between mt-3">
                {/* Optional: Add edit later */}
                <button onClick={() => handleDelete(food._id)} className="text-red-500 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantManageFoods;

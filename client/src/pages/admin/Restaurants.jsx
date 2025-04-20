import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("/restaurant/");
      setRestaurants(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch restaurants"
      );
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`restaurant/admin/${id}/status`, { isOpen: !currentStatus });
      toast.success("Restaurant status updated");
      fetchRestaurants();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Registered Restaurants</h1>
      {loading ? (
        <p>Loading...</p>
      ) : restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="border rounded-2xl p-4 shadow">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.email}</p>
              <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>
              <p className="text-gray-600">Phone: {restaurant.phone}</p>
              <p className="text-gray-600">Location: {restaurant.location}</p>
              <p
                className={`mt-2 font-medium ${
                  restaurant.isOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </p>
              <button
                onClick={() => handleToggleStatus(restaurant._id, restaurant.isOpen)}
                className={`mt-3 px-4 py-2 rounded-xl text-white ${
                  restaurant.isOpen ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {restaurant.isOpen ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
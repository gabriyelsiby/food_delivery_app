import React, { useEffect, useState } from "react";
import { useRestaurantAuth } from "../../context/RestaurantAuthContext";
import axios from "../../config/axiosInstance";
import { toast } from "react-toastify";

const RestaurantProfile = () => {
  const { restaurant, restaurantLoading } = useRestaurantAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    cuisine: "",
    phone: "",
    isOpen: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        email: restaurant.email || "",
        location: restaurant.location || "",
        cuisine: restaurant.cuisine || "",
        phone: restaurant.phone || "",
        isOpen: restaurant.isOpen ?? true,
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/restaurant/profile", formData);
      toast.success(res.data.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (restaurantLoading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        Restaurant Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-600">Restaurant Name</label>
          <input
            type="text"
            name="name"
            disabled={!isEditing}
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            disabled
            value={formData.email}
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            disabled={!isEditing}
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-gray-600">Cuisine</label>
          <input
            type="text"
            name="cuisine"
            disabled={!isEditing}
            value={formData.cuisine}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600">Phone</label>
          <input
            type="text"
            name="phone"
            disabled={!isEditing}
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* isOpen */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600">Open Status</label>
          <input
            type="checkbox"
            name="isOpen"
            disabled={!isEditing}
            checked={formData.isOpen}
            onChange={handleChange}
          />
          <span className={formData.isOpen ? "text-green-600" : "text-red-500"}>
            {formData.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ ...formData, ...restaurant });
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RestaurantProfile;

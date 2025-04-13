import React, { useEffect, useState } from "react";
import axios from "../../config/axios";

const Profile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    cuisine: "",
    phone: "",
    isOpen: true,
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/restaurant/profile");
        setRestaurant(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          location: response.data.data.location,
          cuisine: response.data.data.cuisine,
          phone: response.data.data.phone,
          isOpen: response.data.data.isOpen,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/restaurant/update", formData);  // Corrected endpoint here
      setRestaurant(response.data.data); // Update the restaurant data after successful update
      setIsEditing(false); // Exit the edit mode
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="p-4">No profile data found.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Restaurant Profile</h1>

      {!isEditing ? (
        <div className="space-y-4 text-lg">
          <p><strong>Name:</strong> {restaurant.name}</p>
          <p><strong>Email:</strong> {restaurant.email}</p>
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>Phone:</strong> {restaurant.phone}</p>
          <p><strong>Status:</strong> {restaurant.isOpen ? "Open" : "Closed"}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="cuisine" className="block text-sm font-semibold">Cuisine</label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOpen"
              name="isOpen"
              checked={formData.isOpen}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isOpen" className="text-sm">Is Open</label>
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;

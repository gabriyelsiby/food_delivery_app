import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
  });

  const [address, setAddress] = useState({
    houseName: "",
    city: "",
    landmark: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile");
        setProfile(res.data.data);
        setFormData({
          name: res.data.data.name,
          email: res.data.data.email,
          mobile: res.data.data.mobile || "",
          profilePic: null,
        });
        if (res.data.data.address) {
          setAddress(res.data.data.address);
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("email", formData.email);
    updateData.append("mobile", formData.mobile);
    if (formData.profilePic) {
      updateData.append("profilePic", formData.profilePic);
    }
    try {
      const res = await axios.put("/user/update-profile", updateData);
      toast.success("Profile updated!");
      setProfile(res.data.data);
    } catch (err) {
      console.error("Update profile error:", err.message);
      toast.error("Failed to update profile");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/user/update-address", address);
      toast.success("Address updated!");
    } catch (err) {
      console.error("Update address error:", err.message);
      toast.error("Failed to update address");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {profile && (
        <div className="mb-6">
          <img
            src={profile.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <p className="text-lg">{profile.name}</p>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Update Profile</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleProfileChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleProfileChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleProfileChange}
          placeholder="Mobile"
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleProfileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Update Profile
        </button>
      </form>

      <form onSubmit={handleAddressSubmit} className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Update Address</h2>
        {["houseName", "city", "landmark", "pincode", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={address[field]}
            onChange={handleAddressChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Update Address
        </button>
      </form>
    </div>
  );
};

export default Profile;

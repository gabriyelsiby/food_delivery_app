// src/pages/user/Profile.jsx

import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
  });
  const [addressData, setAddressData] = useState({
    houseName: "",
    city: "",
    landmark: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/user/profile");
      setUser(res.data.data);
      setProfileData({
        name: res.data.data.name,
        email: res.data.data.email,
        mobile: res.data.data.mobile || "",
        profilePic: null,
      });
      if (res.data.data.address) {
        setAddressData(res.data.data.address);
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    setProfileData((prev) => ({ ...prev, profilePic: e.target.files[0] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("mobile", profileData.mobile);
      if (profileData.profilePic) {
        formData.append("profilePic", profileData.profilePic);
      }

      const res = await axios.put("/user/profile", formData);
      toast.success("Profile updated");
      setUser(res.data.data);
    } catch (error) {
      toast.error("Profile update failed");
      console.error(error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/user/update-address", addressData);
      toast.success("Address updated");
    } catch (error) {
      toast.error("Address update failed");
      console.error(error);
    }
  };

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow space-y-10">
      <h2 className="text-2xl font-bold text-rose-600 mb-2">Your Profile</h2>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="mobile"
            value={profileData.mobile}
            onChange={handleProfileChange}
            placeholder="Mobile"
            className="border p-2 rounded w-full"
          />
          <input
            type="file"
            onChange={handleProfilePicChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>

      {/* Address Form */}
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Address Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="houseName"
            value={addressData.houseName}
            onChange={handleAddressChange}
            placeholder="House Name"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="city"
            value={addressData.city}
            onChange={handleAddressChange}
            placeholder="City"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="landmark"
            value={addressData.landmark}
            onChange={handleAddressChange}
            placeholder="Landmark"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="pincode"
            value={addressData.pincode}
            onChange={handleAddressChange}
            placeholder="Pincode"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="phone"
            value={addressData.phone}
            onChange={handleAddressChange}
            placeholder="Phone"
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded">
          Update Address
        </button>
      </form>
    </div>
  );
};

export default Profile;

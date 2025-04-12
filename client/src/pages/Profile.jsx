import { useEffect, useState } from "react";
import axios from "../config/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);

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
      const user = res.data.data;
      setUser(user);
      setProfileData({
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        profilePic: null,
      });
      if (user.address) {
        setAddressData(user.address);
      }
      if (user.profilePic) {
        setPreview(user.profilePic);
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
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    }
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

      const res = await axios.put("/user/update-profile", formData);
      toast.success("Profile updated");
      fetchUserProfile(); // refresh data
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
    <div className="max-w-3xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-rose-600">My Profile</h1>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={profileData.mobile}
            onChange={handleProfileChange}
            placeholder="Mobile"
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="border p-2 rounded"
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Profile Picture Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
        >
          Update Profile
        </button>
      </form>

      {/* Address Form */}
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Address Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="houseName"
            value={addressData.houseName}
            onChange={handleAddressChange}
            placeholder="House Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="city"
            value={addressData.city}
            onChange={handleAddressChange}
            placeholder="City"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="landmark"
            value={addressData.landmark}
            onChange={handleAddressChange}
            placeholder="Landmark"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="pincode"
            value={addressData.pincode}
            onChange={handleAddressChange}
            placeholder="Pincode"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={addressData.phone}
            onChange={handleAddressChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
        >
          Update Address
        </button>
      </form>
    </div>
  );
};

export default Profile;

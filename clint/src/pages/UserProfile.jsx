// filepath: c:\Users\gabriyel\OneDrive\Desktop\food-delivery-app\src\pages\UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", email: "", mobile: "", address: {} });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch User Profile Data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/profile", { withCredentials: true })
      .then((res) => {
        setProfile(res.data.data);
        setUpdatedProfile({ name: res.data.data.name, email: res.data.data.email, mobile: res.data.data.mobile, address: res.data.data.address });
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // ✅ Handle Profile Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedProfile.name);
    formData.append("email", updatedProfile.email);
    formData.append("mobile", updatedProfile.mobile);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const response = await axios.put("http://localhost:5000/api/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage("Profile updated successfully!");
      setProfile(response.data.data);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update profile.");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    axios.post("http://localhost:5000/api/user/logout", {}, { withCredentials: true })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
      {message && <p className="text-green-500 text-center">{message}</p>}

      {editMode ? (
        <form onSubmit={handleUpdate}>
          <input type="text" placeholder="Name" value={updatedProfile.name} onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })} className="w-full p-2 mb-2 border rounded" required />
          <input type="email" placeholder="Email" value={updatedProfile.email} onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })} className="w-full p-2 mb-2 border rounded" required />
          <input type="text" placeholder="Mobile" value={updatedProfile.mobile} onChange={(e) => setUpdatedProfile({ ...updatedProfile, mobile: e.target.value })} className="w-full p-2 mb-2 border rounded" required />
          <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} className="w-full p-2 mb-2 border rounded" />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-2 rounded">Save Changes</button>
          <button type="button" onClick={() => setEditMode(false)} className="w-full bg-gray-500 text-white p-2 mt-2 rounded">Cancel</button>
        </form>
      ) : (
        <div className="text-center">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile}</p>
          <img src={profile.profilePic} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto mt-4" />

          <button onClick={() => setEditMode(true)} className="w-full bg-green-500 text-white p-2 mt-4 rounded">Edit Profile</button>
          <button onClick={handleLogout} className="w-full bg-red-500 text-white p-2 mt-4 rounded">Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
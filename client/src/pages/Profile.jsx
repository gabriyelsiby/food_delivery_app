import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle logout properly
  const handleLogout = () => {
    logout(); // Clears user state
    navigate("/login/user"); // Redirects to login page
  };

  if (!user) {
    return <p>Loading profile...</p>; // Handle loading state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="p-4 border rounded shadow w-80 text-center">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button 
          onClick={handleLogout} 
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

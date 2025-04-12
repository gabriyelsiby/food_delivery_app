import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/delivery/profile");
                setProfile(response.data.data);
            } catch (error) {
                toast.error("Failed to fetch profile");
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <div>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Mobile:</strong> {profile.mobile}</p>
                <p><strong>Vehicle Type:</strong> {profile.vehicleType}</p>
            </div>
        </div>
    );
};

export default Profile;

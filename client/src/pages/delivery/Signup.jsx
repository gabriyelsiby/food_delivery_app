import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/delivery/register", { name, email, password, mobile, vehicleType });
            toast.success(response.data.message);
            navigate("/delivery/login"); // Redirect to login page
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Delivery Partner Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                    <input
                        type="text"
                        id="mobile"
                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <input
                        type="text"
                        id="vehicleType"
                        className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/delivery/login", { email, password });
            toast.success(response.data.message);
            navigate("/delivery/dashboard"); // Redirect to the dashboard
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Delivery Partner Login</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Login</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/delivery/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
            <Footer />
        </>
    );
};

export default Login;

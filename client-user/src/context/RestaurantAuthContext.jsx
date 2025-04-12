import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axiosInstance";
import { toast } from "react-toastify";

const RestaurantAuthContext = createContext();

export const RestaurantAuthProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [isRestaurantLoggedIn, setIsRestaurantLoggedIn] = useState(false);

  // ✅ Fetch restaurant profile if token is valid
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/restaurant/profile");
      setRestaurant(res.data.data);
      setIsRestaurantLoggedIn(true);
    } catch (err) {
      setRestaurant(null);
      setIsRestaurantLoggedIn(false);
    } finally {
      setRestaurantLoading(false);
    }
  };

  // ✅ Run only once on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Login restaurant
  const login = async (values) => {
    try {
      await axios.post("/restaurant/login", values);
      toast.success("Login successful");
      await fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // ✅ Signup restaurant
  const signup = async (values) => {
    try {
      await axios.post("/restaurant/register", values);
      toast.success("Signup successful");
      await fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
      throw err;
    }
  };

  // ✅ Logout restaurant
  const logout = async () => {
    try {
      await axios.post("/restaurant/logout");
      toast.success("Logged out");
      setRestaurant(null);
      setIsRestaurantLoggedIn(false);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <RestaurantAuthContext.Provider
      value={{
        restaurant,
        restaurantLoading,
        isRestaurantLoggedIn,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </RestaurantAuthContext.Provider>
  );
};

export const useRestaurantAuth = () => useContext(RestaurantAuthContext);

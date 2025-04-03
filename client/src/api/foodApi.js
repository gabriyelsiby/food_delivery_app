import axios from "../config/axiosInstance";

// Fetch all food items
export const getAllFoodItems = async () => {
  try {
    const response = await axios.get("/food/food-list");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
};

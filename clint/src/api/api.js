// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change the URL to your backend server
  headers: {
    'Content-Type': 'application/json'
  }
});

// Example: Fetch all food items
export const getAllFoodItems = async () => {
  try {
    const response = await api.get('/food/food-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }
};

export default api;

// store/cartStore.js
import { create } from "zustand";
import axios from "../config/axiosInstance";

const useCartStore = create((set) => ({
  cart: [],
  addToCart: async (foodItem) => {
    try {
      await axios.post("/cart/add", {
        foodItemId: foodItem._id,
        quantity: 1,
      });
      set((state) => ({
        cart: [...state.cart, { ...foodItem, quantity: 1 }],
      }));
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  },
}));

export default useCartStore;

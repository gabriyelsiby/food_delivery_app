import { create } from "zustand";
import axios from "../config/axiosInstance"; // 👈 use your instance

export const useCartStore = create((set, get) => ({
  cart: {
    items: [],
    totalPrice: 0,
  },
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data.data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch cart",
        loading: false,
      });
    }
  },

  addToCart: async (foodId, quantity) => {
    try {
      await axios.post("/cart/add", { foodId, quantity });
      get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || "Add to cart failed",
      });
    }
  },

  updateCart: async (foodId, quantity) => {
    try {
      await axios.put("/cart/update", { foodId, quantity });
      get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || "Update failed",
      });
    }
  },

  removeFromCart: async (foodId) => {
    try {
      await axios.delete("/cart/remove", {
        data: { foodId },
      });
      get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || "Remove failed",
      });
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart/clear");
      get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || "Clear cart failed",
      });
    }
  },
}));

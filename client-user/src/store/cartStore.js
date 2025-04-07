import { create } from "zustand";
import axios from "../config/axiosInstance"; // 👈 use your instance

export const useCartStore = create((set, get) => ({
  cart: {
    items: [],
    totalPrice: 0, // Ensure totalPrice is initialized
  },
  loading: false,
  error: null,

  // Fetch cart and recalculate total price
  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      const updatedCart = res.data.data;
      
      // Recalculate total price after fetching the cart
      const totalPrice = updatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      set({
        cart: { ...updatedCart, totalPrice },
        loading: false,
        error: null,
      });
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

import { create } from "zustand";
import axios from "../config/axiosInstance";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: {
    items: [],
    totalPrice: 0,
  },
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get("/cart");
      const { items, totalPrice } = data.data;

      set({
        cart: { items, totalPrice },
        loading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch cart";
      toast.error(message);
      set({ loading: false, error: message });
    }
  },

  addToCart: async (foodId, quantity = 1) => {
    try {
      await axios.post("/cart/add", { foodId, quantity });
      await get().fetchCart();
      toast.success("Added to cart");
    } catch (error) {
      const message = error.response?.data?.message || "Add to cart failed";
      toast.error(message);
      set({ error: message });
    }
  },

  updateCart: async (foodId, quantity) => {
    try {
      await axios.put("/cart/update", { foodId, quantity });
      await get().fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      set({ error: message });
    }
  },

  removeFromCart: async (foodId) => {
    try {
      await axios.delete("/cart/remove", { data: { foodId } });
      await get().fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      const message = error.response?.data?.message || "Remove failed";
      toast.error(message);
      set({ error: message });
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart/clear");
      await get().fetchCart();
      toast.success("Cart cleared");
    } catch (error) {
      const message = error.response?.data?.message || "Clear cart failed";
      toast.error(message);
      set({ error: message });
    }
  },
}));

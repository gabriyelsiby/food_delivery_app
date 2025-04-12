// src/store/cartStore.js
import { create } from "zustand";
import axios from "../config/axios";

const useCartStore = create((set, get) => ({
  items: [],
  totalPrice: 0,

  fetchCart: async () => {
    try {
      const res = await axios.get("/cart"); // ✅ Matches GET /api/user/cart
      set({ items: res.data.data.items, totalPrice: res.data.data.totalPrice });
      localStorage.setItem("cart", JSON.stringify(res.data.data.items)); // Save to local storage
    } catch (err) {
      console.error("Fetch cart error", err);
    }
  },

  addToCart: async (foodId, quantity = 1) => {
    try {
      const res = await axios.post("/cart/add", { foodId, quantity }); // ✅ Matches POST /api/user/cart/add
      set({ items: res.data.data.items, totalPrice: res.data.data.totalPrice });
      localStorage.setItem("cart", JSON.stringify(res.data.data.items)); // Save to local storage
    } catch (err) {
      console.error("Add to cart error", err);
    }
  },

  updateQuantity: async (foodId, quantity) => {
    try {
      const res = await axios.put("/cart/update", { foodId, quantity }); // ✅ Matches PUT /api/user/cart/update
      set({ items: res.data.data.items, totalPrice: res.data.data.totalPrice });
      localStorage.setItem("cart", JSON.stringify(res.data.data.items)); // Save to local storage
    } catch (err) {
      console.error("Update cart error", err);
    }
  },

  removeFromCart: async (foodId) => {
    try {
      const res = await axios.delete("/cart/remove", { data: { foodId } }); // ✅ DELETE with body
      set({ items: res.data.data.items, totalPrice: res.data.data.totalPrice });
      localStorage.setItem("cart", JSON.stringify(res.data.data.items)); // Save to local storage
    } catch (err) {
      console.error("Remove cart error", err);
    }
  },

  clearCart: async () => {
    try {
      const res = await axios.delete("/cart/clear"); // ✅ Matches DELETE /api/user/cart/clear
      set({ items: res.data.data.items, totalPrice: res.data.data.totalPrice });
      localStorage.removeItem("cart"); // Clear local storage
    } catch (err) {
      console.error("Clear cart error", err);
    }
  },

  loadCartFromStorage: () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedTotalPrice = storedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    set({ items: storedCart, totalPrice: updatedTotalPrice });
  },
}));

export default useCartStore;

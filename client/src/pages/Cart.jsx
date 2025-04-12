import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    totalPrice,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) {
      return setError("Your cart is empty.");
    }

    // Extract restaurantId from the first item
    const restaurantId = items[0]?.restaurantId;

    // Log cart items and restaurantIds for debugging
    console.log("Cart Items:", items);
    console.log("Restaurant IDs in Cart:", items.map(item => item.restaurantId));

    // Check if all items have the same restaurantId
    const allSameRestaurant = items.every(
      (item) => item.restaurantId === restaurantId
    );

    if (!restaurantId || !allSameRestaurant) {
      console.error("Validation Failed: Items from multiple restaurants detected.");
      return setError("All items in the cart must belong to the same restaurant.");
    }

    // Clear any previous error and navigate to checkout
    setError("");
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">Your cart is empty</div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-rose-600">Your Cart</h2>

      {error && (
        <div className="text-red-500 text-center font-medium">{error}</div>
      )}

      {items.map((item, index) => (
        <div
          key={`${item.foodId}-${index}`} // Combine foodId with index to ensure uniqueness
          className="flex items-center justify-between border p-4 rounded"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                ₹{item.price} x {item.quantity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
              className="px-2"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
              className="px-2"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.foodId)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-xl">Total: ₹{totalPrice}</div>

      <div className="flex justify-end gap-4">
        <button
          onClick={clearCart}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Clear Cart
        </button>
        <button
          onClick={handleCheckout}
          className="bg-rose-600 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

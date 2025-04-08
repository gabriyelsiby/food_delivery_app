// src/pages/user/Cart.jsx
import { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    fetchCart,
    updateCart,
    removeFromCart,
    clearCart,
    loading,
    error,
  } = useCartStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const hasItems = cart?.items?.length > 0;
  const total = cart?.totalPrice || 0;
  const discount = cart?.discount || 0;
  const finalAmount = total - discount;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 My Cart</h2>

      {!hasItems ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.foodId}
                className="border p-4 rounded shadow-md flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.imageUrl?.startsWith("http") ? item.imageUrl : `https://food-delivery-app-server-sooty.vercel.app/${item.imageUrl}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                    <div className="flex gap-2 items-center mt-2">
                      <button
                        className="bg-orange-500 text-white rounded-full w-8 h-8"
                        onClick={() =>
                          updateCart(item.foodId, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        className="bg-green-600 text-white rounded-full w-8 h-8"
                        onClick={() =>
                          updateCart(item.foodId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => removeFromCart(item.foodId)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          {/* Total Section */}
          <div className="mt-6 bg-gray-100 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</h3>

            {discount > 0 && (
              <p className="text-green-600 font-medium">
                Discount Applied: ₹{discount.toFixed(2)}
              </p>
            )}

            <p className="font-bold text-lg mt-2">
              Final Amount: ₹{finalAmount.toFixed(2)}
            </p>

            <div className="flex gap-4 mt-4">
              <Button
                onClick={clearCart}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Clear Cart
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

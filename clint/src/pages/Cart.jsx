import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [foodItems, setFoodItems] = useState([]); // State for food items to add to cart

  // Fetch the cart when the component is mounted
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        if (!token) {
          setError('You need to log in first');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request headers
          }
        });

        // Check if the cart exists
        if (response.data.data) {
          setCart(response.data.data.items);
          setTotalPrice(response.data.data.totalPrice); // Assuming the total price is included in the response
        } else {
          setError('No cart data found');
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError(err.response?.data?.message || "Error fetching cart");
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food'); // Fetch all food items
        setFoodItems(response.data); // Set the food items in the state
      } catch (err) {
        console.error("Error fetching food items:", err);
        setError("Failed to load food items");
      }
    };

    fetchCart();
    fetchFoodItems(); // Fetch food items when the component loads
  }, []);

  // Handle add to cart
  const handleAddToCart = async (foodId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/cart/add', { foodId, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the cart after adding an item
      setCart(response.data.data.items);
      setTotalPrice(response.data.data.totalPrice); // Update the total price
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError("Failed to add item to cart");
    }
  };

  const handleRemoveItem = async (foodId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/cart/remove', { foodId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCart(response.data.data.items);
      setTotalPrice(response.data.data.totalPrice); // Update the total price after removal
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (foodId, quantity) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/cart/update', { foodId, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCart(response.data.data.items);
      setTotalPrice(response.data.data.totalPrice); // Update the total price after quantity change
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/cart/clear', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCart([]);
      setTotalPrice(0); // Reset the total price
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart");
    }
  };

  if (loading) return <p>Loading cart items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.foodId._id} className="cart-item flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl">{item.foodId.name}</h2>
                  <p>{item.foodId.description}</p>
                  <p>${item.foodId.price.toFixed(2)}</p>
                </div>
                <div className="quantity-controls flex items-center">
                  <button
                    onClick={() => handleUpdateQuantity(item.foodId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.foodId._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.foodId._id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="total-price mt-6 text-xl">
            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          </div>

          <div className="cart-actions mt-6">
            <button
              onClick={handleClearCart}
              className="px-6 py-2 bg-red-500 text-white rounded"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}

      <div className="food-items mt-6">
        <h2 className="text-2xl font-bold">Food Items</h2>
        {foodItems.map((food) => (
          <div key={food._id} className="food-item mb-4 flex justify-between items-center">
            <div>
              <h3>{food.name}</h3>
              <p>{food.description}</p>
              <p>${food.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleAddToCart(food._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;

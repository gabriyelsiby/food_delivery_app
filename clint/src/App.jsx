// filepath: c:\Users\gabriyel\OneDrive\Desktop\food-delivery-app\src\App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FoodList from "./pages/FoodList";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderHistory from "./pages/OrderHistory";
import PaymentPage from "./pages/PaymentPage";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import AddFoodItem from "./pages/AddFoodItem";
import UserProfile from "./pages/UserProfile";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <Header />
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<FoodList />} />
            <Route path="/food/:foodId" element={<FoodDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/payment/:orderId" element={<PaymentPage />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Restaurant routes */}
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurant/add-food" element={<AddFoodItem />} />
            {/* Delivery Partner routes */}
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
}

export default App;
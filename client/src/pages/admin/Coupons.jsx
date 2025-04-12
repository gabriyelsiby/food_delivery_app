import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 0,
    maxDiscount: 0,
    minOrderAmount: 0,
    expiryDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch available coupons
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/coupon/available`, {
        withCredentials: true, // Make sure credentials are sent
      });
      setCoupons(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Coupons Error:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in.");
        navigate("/login"); // Redirect to login page if unauthorized
      } else {
        toast.error("Failed to load coupons");
      }
      setLoading(false);
    }
  };

  // Create a new coupon
  const handleCreateCoupon = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupon/create`,
        newCoupon,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchCoupons(); // Refresh the list of coupons
      setNewCoupon({
        code: "",
        discount: 0,
        maxDiscount: 0,
        minOrderAmount: 0,
        expiryDate: "",
      });
    } catch (error) {
      console.error("Create Coupon Error:", error);
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  // Delete a coupon
  const handleDeleteCoupon = async (couponId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/coupon/delete/${couponId}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully");
      fetchCoupons(); // Refresh the list after deletion
    } catch (error) {
      console.error("Delete Coupon Error:", error);
      toast.error("Failed to delete coupon");
    }
  };

  // Toggle coupon status (Active/Inactive)
  const handleToggleStatus = async (couponId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/coupon/toggle-status/${couponId}`, // Fixed endpoint URL
        {},
        { withCredentials: true }
      );
      toast.success("Coupon status updated successfully");
      fetchCoupons(); // Refresh the list after status change
    } catch (error) {
      console.error("Toggle Coupon Status Error:", error);
      toast.error("Failed to update coupon status");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-rose-600 mb-4">Manage Coupons</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Create New Coupon</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCoupon();
          }}
          className="space-y-4"
        >
          <div className="flex space-x-4">
            <input
              type="text"
              name="code"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              placeholder="Coupon Code"
              required
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="discount"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              placeholder="Discount (%)"
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex space-x-4">
            <input
              type="number"
              name="maxDiscount"
              value={newCoupon.maxDiscount}
              onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
              placeholder="Max Discount"
              required
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="minOrderAmount"
              value={newCoupon.minOrderAmount}
              onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
              placeholder="Min Order Amount"
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="date"
              name="expiryDate"
              value={newCoupon.expiryDate}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700"
          >
            Create Coupon
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Coupons</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 text-left">Discount</th>
                <th className="border p-2 text-left">Max Discount</th>
                <th className="border p-2 text-left">Min Order</th>
                <th className="border p-2 text-left">Expiry Date</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="border p-2">{coupon.code}</td>
                  <td className="border p-2">{coupon.discount}%</td>
                  <td className="border p-2">₹{coupon.maxDiscount}</td>
                  <td className="border p-2">₹{coupon.minOrderAmount}</td>
                  <td className="border p-2">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded ${coupon.isActive ? "bg-green-600" : "bg-red-600"} text-white`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleToggleStatus(coupon._id)}
                      className="bg-amber-500 text-white px-4 py-2 rounded"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Coupons;

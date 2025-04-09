import { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { toast } from "react-toastify";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    maxDiscount: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/coupon/available");
      setCoupons(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("coupon/create", formData);
      toast.success("Coupon created");
      fetchCoupons();
      setFormData({
        code: "",
        discount: "",
        maxDiscount: "",
        minOrderAmount: "",
        expiryDate: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`/api/admin/coupon/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`/api/admin/coupon/toggle/${id}`);
      toast.success("Status updated");
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Coupons</h1>

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow mb-6"
      >
        <input
          type="text"
          placeholder="Code"
          className="border p-2 rounded"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          className="border p-2 rounded"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Max Discount ₹"
          className="border p-2 rounded"
          value={formData.maxDiscount}
          onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Min Order ₹"
          className="border p-2 rounded"
          value={formData.minOrderAmount}
          onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition">
          Create Coupon
        </button>
      </form>

      {/* Coupon List */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Max</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-t">
                <td className="p-3 font-medium">{coupon.code}</td>
                <td className="p-3">{coupon.discount}%</td>
                <td className="p-3">₹{coupon.maxDiscount}</td>
                <td className="p-3">₹{coupon.minOrderAmount}</td>
                <td className="p-3">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleToggle(coupon._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

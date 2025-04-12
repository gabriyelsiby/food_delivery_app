import React, { useEffect, useState } from "react";
import { Users, Store, Tag, ClipboardList } from "lucide-react";
import axios from "../../config/axiosInstance"; // Adjust the path if needed

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      label: "Total Restaurants",
      value: 0,
      icon: <Store className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: 0,
      icon: <Users className="w-6 h-6 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      label: "Active Coupons",
      value: 0,
      icon: <Tag className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-100",
    },
    {
      label: "Total Orders",
      value: 0,
      icon: <ClipboardList className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-100",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, restaurantsRes, couponsRes, ordersRes] = await Promise.all([
          axios.get("/user/all"),
          axios.get("/restaurant/"),
          axios.get("/coupon/available"),
          axios.get("/orders/admin/all"),
        ]);

        const users = Array.isArray(usersRes.data?.data) ? usersRes.data.data : usersRes.data;
        const restaurants = Array.isArray(restaurantsRes.data?.data) ? restaurantsRes.data.data : restaurantsRes.data;
        const coupons = Array.isArray(couponsRes.data?.data) ? couponsRes.data.data : couponsRes.data;
        const orders = Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : ordersRes.data;

        setStats((prevStats) =>
          prevStats.map((stat) => {
            switch (stat.label) {
              case "Total Users":
                return { ...stat, value: users.length };
              case "Total Restaurants":
                return { ...stat, value: restaurants.length };
              case "Active Coupons":
                return { ...stat, value: coupons.length };
              case "Total Orders":
                return { ...stat, value: orders.length };
              default:
                return stat;
            }
          })
        );
      } catch (error) {
        console.error("❌ Error fetching dashboard stats:", error?.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl shadow-sm ${stat.bg} flex items-center gap-4`}
          >
            <div className="p-2 rounded-xl bg-white shadow-inner">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

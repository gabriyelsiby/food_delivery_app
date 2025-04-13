import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';  // Ensure the import path is correct

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      label: "Total Restaurants",
      value: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H7a1 1 0 110-2h3V3a1 1 0 011-1z" /></svg>,
      bg: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path d="M18 6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v1H7V3a1 1 0 00-1-1H4a1 1 0 00-1 1v1H2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6z" /></svg>,
      bg: "bg-green-100",
    },
    {
      label: "Active Coupons",
      value: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-1 1v3H6a1 1 0 110 2h2v3a1 1 0 002 0V6h2a1 1 0 110-2h-2V3a1 1 0 00-1-1z" /></svg>,
      bg: "bg-orange-100",
    },
    {
      label: "Total Orders",
      value: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path d="M3 2a1 1 0 011 1v2h12V3a1 1 0 112 0v2a3 3 0 01-3 3H5a3 3 0 01-3-3V3a1 1 0 011-1z" /></svg>,
      bg: "bg-purple-100",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, restaurantsRes, couponsRes, ordersRes] = await Promise.all([
          axios.get('/user/all'),
          axios.get('/restaurant/'),
          axios.get('/coupon/available'),
          axios.get('/orders/admin/all'),
        ]);

        const users = Array.isArray(usersRes.data?.data) ? usersRes.data.data : usersRes.data;
        const restaurants = Array.isArray(restaurantsRes.data?.data) ? restaurantsRes.data.data : restaurantsRes.data;
        const coupons = Array.isArray(couponsRes.data?.data) ? couponsRes.data.data : couponsRes.data;
        const orders = Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : ordersRes.data;

        setStats((prevStats) =>
          prevStats.map((stat) => {
            switch (stat.label) {
              case 'Total Users':
                return { ...stat, value: users.length };
              case 'Total Restaurants':
                return { ...stat, value: restaurants.length };
              case 'Active Coupons':
                return { ...stat, value: coupons.length };
              case 'Total Orders':
                return { ...stat, value: orders.length };
              default:
                return stat;
            }
          })
        );
      } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error?.response?.data || error.message);
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

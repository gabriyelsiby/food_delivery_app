import React from "react";
import { Users, Store, Tag, ClipboardList } from "lucide-react";

const stats = [
  {
    label: "Total Restaurants",
    value: 24,
    icon: <Store className="w-6 h-6 text-blue-500" />,
    bg: "bg-blue-100"
  },
  {
    label: "Total Users",
    value: 128,
    icon: <Users className="w-6 h-6 text-green-500" />,
    bg: "bg-green-100"
  },
  {
    label: "Active Coupons",
    value: 6,
    icon: <Tag className="w-6 h-6 text-orange-500" />,
    bg: "bg-orange-100"
  },
  {
    label: "Total Orders",
    value: 312,
    icon: <ClipboardList className="w-6 h-6 text-purple-500" />,
    bg: "bg-purple-100"
  }
];

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

      {/* Add your additional admin widgets below here */}
    </div>
  );
};

export default AdminDashboard;

import { Link, useLocation } from "react-router-dom";

const DeliveryNavbar = ({ onLogout }) => {
  const location = useLocation();

  const links = [
    { path: "/delivery/dashboard", label: "Dashboard" },
    { path: "/delivery/assigned-orders", label: "Assigned Orders" },
    { path: "/delivery/profile", label: "Profile" }
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col justify-between p-4">
      <div>
        <h2 className="text-2xl font-bold mb-6">Delivery Panel</h2>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block p-2 rounded mb-2 ${
              location.pathname === link.path ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default DeliveryNavbar;

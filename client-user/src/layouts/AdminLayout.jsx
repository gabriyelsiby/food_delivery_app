import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-4">
        <Outlet /> {/* This will render nested routes like /admin/coupons */}
      </div>
    </div>
  );
};

export default AdminLayout;

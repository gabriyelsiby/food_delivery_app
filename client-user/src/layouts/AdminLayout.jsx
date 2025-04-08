import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

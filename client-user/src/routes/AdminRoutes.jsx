// src/routes/AdminRoutes.jsx
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Restaurants from "../pages/admin/Restaurants";
import Coupons from "../pages/admin/Coupons";
import Orders from "../pages/admin/Orders";

import ProtectedRoute from "./ProtectedRoute";

const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="restaurants" element={<Restaurants />} />
    <Route path="coupons" element={<Coupons />} />
    <Route path="orders" element={<Orders />} />
  </Route>
);

export default AdminRoutes;

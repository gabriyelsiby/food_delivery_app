import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import RestaurantRoutes from "./routes/RestaurantRoutes";

import { AuthProvider } from "./context/AuthContext";
import { RestaurantAuthProvider } from "./context/RestaurantAuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantAuthProvider>
          <Routes>
            {UserRoutes}
            {AdminRoutes}
            {RestaurantRoutes}
          </Routes>

          {/* Toasts */}
          <Toaster position="top-center" reverseOrder={false} />
          <ToastContainer position="top-center" autoClose={3000} />
        </RestaurantAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

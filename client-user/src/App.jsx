import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRoutes from "../src/routes/UserRoutes";
import AdminRoutes from "../src/routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {UserRoutes}
          {AdminRoutes}
        </Routes>

        {/* Toasts */}
        <Toaster position="top-center" reverseOrder={false} />
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

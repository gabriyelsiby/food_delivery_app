import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRoutes from "../src/routes/UserRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{UserRoutes}</Routes>

        {/* Hot toast for modern toast UI */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Toastify for legacy or specific cases */}
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserRoutes from "../src/routes/UserRoutes";
import { AuthProvider } from "./context/AuthContext"; // make sure path is correct

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{UserRoutes}</Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import Navbar from "../components/Navbar";
import Footer from "./../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;

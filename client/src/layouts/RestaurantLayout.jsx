// RestaurantLayout.jsx
import { Outlet } from "react-router-dom";
import RestaurantNavbar from "../components/RestaurantNavbar";

const RestaurantLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <RestaurantNavbar />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantLayout;
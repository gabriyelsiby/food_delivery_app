import { Outlet } from "react-router-dom";
import RestaurantNavbar from "../components/restaurant/RestaurantNavbar";

const RestaurantLayout = () => {
  return (
    <>
      <RestaurantNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default RestaurantLayout;

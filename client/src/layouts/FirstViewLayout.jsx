import { Outlet } from "react-router-dom";
import FirstViewNavbar from "../components/FirstViewNavbar";
import Footer from "../components/Footer";

const FirstViewLayout = () => {
  return (
    <div>
      <FirstViewNavbar />
      <main className="min-h-screen flex items-center justify-center">
        <Outlet /> {/* ✅ This will render pages inside */}
      </main>
      <Footer />
    </div>
  );
};

export default FirstViewLayout;

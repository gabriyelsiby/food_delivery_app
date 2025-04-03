import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;

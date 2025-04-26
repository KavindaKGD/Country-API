import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CountryList from "./pages/CountryList";
import CountryDetail from "./pages/CountryDetail";
import Favorites from "./pages/Favorites";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <CountryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/country/:code"
          element={
            <ProtectedRoute>
              <CountryDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

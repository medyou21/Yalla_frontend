import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState, useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import TripList from "./components/Trips/TripList";
import TripDetails from "./components/Trips/TripDetails";
import TripReservation from "./components/Trips/TripReservation";
import TripForm from "./components/Trips/TripForm";
import TripSearch from "./components/Trips/TripSearch";
import RealtimeChat from "./components/Messages/RealtimeChat";
import Profile from "./components/Profile/Profile";
import MyReservations from "./components/Trips/MyReservations";
import TripReservationsDriver from "./components/Trips/TripReservationsDriver";
import Footer from "./components/Footer/Footer";

import { SocketProvider } from "./context/SocketProvider";
import { getUser } from "./utils/auth";

import MentionsLegales from "./components/pages/Legal/MentionsLegales";
import Privacy from "./components/pages/Legal/Privacy";
import Terms from "./components/pages/Legal/Terms";
import Cookies from "./components/pages/Legal/Cookies";

import CookieBanner from "./components/Cookies/CookieBanner";

/* ================= PROTECTED ROUTES ================= */

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ user, role, children }) => {
  return user && user.roles?.includes(role)
    ? children
    : <Navigate to="/login" replace />;
};

/* ================= APP ================= */

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const userFromToken = getUser();
    setUser(userFromToken);
    setLoadingUser(false);
  }, []);

  if (loadingUser) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Chargement...
      </p>
    );
  }

  return (
    <SocketProvider user={user}>
      <Router>
        <Navbar user={user} setUser={setUser} />

        <Routes>

          {/* ROOT */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* PUBLIC */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute user={user}>
                <TripList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute user={user}>
                <TripDetails user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip/:id/reserve"
            element={
              <ProtectedRoute user={user}>
                <TripReservation user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messagerie"
            element={
              <ProtectedRoute user={user}>
                <RealtimeChat user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publish"
            element={
              <ProtectedRoute user={user}>
                <TripForm user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute user={user}>
                <TripSearch user={user} />
              </ProtectedRoute>
            }
          />

          {/* PASSENGER */}
          <Route
            path="/my-reservations"
            element={
              <RoleRoute user={user} role="passenger">
                <MyReservations user={user} />
              </RoleRoute>
            }
          />

          {/* DRIVER */}
          <Route
            path="/trip/driver/reservations-driver"
            element={
              <RoleRoute user={user} role="driver">
                <TripReservationsDriver user={user} />
              </RoleRoute>
            }
          />

          {/* 🔥 PAGES LÉGALES */}
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
          <CookieBanner />
        {/* FOOTER */}
        <Footer />

      </Router>
    </SocketProvider>
  );
}

export default App;
// src/App.js
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

import { SocketProvider } from "./context/SocketProvider";
import { getUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔥 Chargement user depuis JWT
  useEffect(() => {
    const userFromToken = getUser();
    setUser(userFromToken);
    setLoadingUser(false);
  }, []);

  if (loadingUser) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
  }

  // 🔥 Helper roles
  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <SocketProvider user={user}>
      <Router>
        <Navbar user={user} setUser={setUser} />

        <Routes>

          {/* ================= ROOT ================= */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* ================= PROTECTED ================= */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/trips"
            element={user ? <TripList user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/trip/:id"
            element={user ? <TripDetails user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/trip/:id/reserve"
            element={user ? <TripReservation user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/messagerie"
            element={user ? <RealtimeChat user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/publish"
            element={user ? <TripForm user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/search"
            element={user ? <TripSearch user={user} /> : <Navigate to="/login" />}
          />

          {/* ================= PASSENGER ================= */}
          <Route
            path="/my-reservations"
            element={
              user && hasRole("passenger") ? (
                <MyReservations user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ================= DRIVER ================= */}
          <Route
            path="/trip/driver/reservations-driver"
            element={
              user && hasRole("driver") ? (
                <TripReservationsDriver user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
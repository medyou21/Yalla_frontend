import { Link as RouterLink, useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";
import { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";

// MUI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ user, setUser, resetNotifications }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [newReservations, setNewReservations] = useState(0);

  const socketRef = useSocket();

  const isDriver = user?.roles?.includes("driver");
  const isPassenger = user?.roles?.includes("passenger");

  // ================= SOCKET =================
  useEffect(() => {
    const socket = socketRef?.current;

    if (!socket || typeof socket.on !== "function" || !isDriver) return;

    const handleNewReservation = () => {
      setNewReservations((prev) => prev + 1);
    };

    socket.on("newReservation", handleNewReservation);

    return () => {
      socket.off("newReservation", handleNewReservation);
    };
  }, [isDriver, socketRef?.current]); // 🔥 important

  // ================= MENU =================
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDriverClick = () => {
    setNewReservations(0);
    resetNotifications?.();
    handleMenuClose();
  };

  // ================= LOGOUT =================
  const logout = () => {
    removeToken();
    localStorage.removeItem("user");

    if (socketRef?.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setUser(null);
    navigate("/login");
  };

  // ================= DESKTOP =================
  const renderDesktopMenu = () => {
    if (!user) {
      return (
        <Button component={RouterLink} to="/login" variant="outlined">
          S'inscrire / Se connecter
        </Button>
      );
    }

    return (
      <>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Typography sx={{ color: "#2e9e53" }}>
            {user?.name}
          </Typography>
        </Box>

        <Button component={RouterLink} to="/search">Rechercher</Button>
        <Button component={RouterLink} to="/publish">Publier</Button>
        <Button component={RouterLink} to="/messagerie">Messagerie</Button>
        <Button component={RouterLink} to="/profile">Profil</Button>

        {isPassenger && (
          <Button component={RouterLink} to="/my-reservations">
            Mes réservations
          </Button>
        )}

        {isDriver && (
          <Button
            component={RouterLink}
            to="/trip/driver/reservations-driver"
            onClick={handleDriverClick}
          >
            <Badge badgeContent={newReservations} color="error">
              Réservations
            </Badge>
          </Button>
        )}

        <Button color="error" onClick={logout}>
          Déconnexion
        </Button>
      </>
    );
  };

  // ================= MOBILE =================
  const renderMobileMenu = () => {
    if (!user) {
      return (
        <MenuItem
          component={RouterLink}
          to="/login"
          onClick={handleMenuClose}
        >
          Login
        </MenuItem>
      );
    }

    return (
      <>
        <MenuItem disabled>
          Bonjour, {user?.name}
        </MenuItem>

        <MenuItem component={RouterLink} to="/search" onClick={handleMenuClose}>
          Rechercher
        </MenuItem>

        <MenuItem component={RouterLink} to="/publish" onClick={handleMenuClose}>
          Publier
        </MenuItem>

        <MenuItem component={RouterLink} to="/messagerie" onClick={handleMenuClose}>
          Messagerie
        </MenuItem>

        <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
          Profil
        </MenuItem>

        {isPassenger && (
          <MenuItem
            component={RouterLink}
            to="/my-reservations"
            onClick={handleMenuClose}
          >
            Mes réservations
          </MenuItem>
        )}

        {isDriver && (
          <MenuItem
            component={RouterLink}
            to="/trip/driver/reservations-driver"
            onClick={handleDriverClick}
          >
            <Badge badgeContent={newReservations} color="error">
              Réservations
            </Badge>
          </MenuItem>
        )}

        <MenuItem onClick={logout} sx={{ color: "red" }}>
          Déconnexion
        </MenuItem>
      </>
    );
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LOGO */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
        >
          🚗 Yalla<span style={{ color: "#2e9e53" }}>Ride</span>
        </Typography>

        {/* DESKTOP */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center"
          }}
        >
          {renderDesktopMenu()}
        </Box>

        {/* MOBILE */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {renderMobileMenu()}
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
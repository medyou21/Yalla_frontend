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
  Avatar,
  Divider
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

// CSS (utilisé seulement pour animation / petits styles)
import "../../styles/navbar.css";

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

    if (!socket || !isDriver) return;

    const handleNewReservation = () => {
      setNewReservations((prev) => prev + 1);
    };

    socket.on("newReservation", handleNewReservation);

    return () => {
      socket.off("newReservation", handleNewReservation);
    };
  }, [isDriver, socketRef?.current]);

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

  // ================= STYLE MUI =================
  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
    "&:hover": {
      color: "#2e9e53",
    },
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#333" }}>
      <Toolbar className="navbar">

        {/* LOGO */}
        <Typography
          component={RouterLink}
          to="/"
          className="logo"
          sx={{ textDecoration: "none" }}
        >
          🚗 Yalla
          <span>Ride</span>
        </Typography>

        {/* DESKTOP MENU */}
        <Box className="navbar-right" sx={{ display: { xs: "none", md: "flex" } }}>

          {!user ? (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              className="login-btn"
            >
              S'inscrire / Se connecter
            </Button>
          ) : (
            <>
              {/* USER INFO */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Typography className="username">
                  {user?.name}
                </Typography>
              </Box>

              <Button component={RouterLink} to="/search" sx={linkStyle}>
                Rechercher
              </Button>

              <Button component={RouterLink} to="/publish" sx={linkStyle}>
                Publier
              </Button>

              <Button component={RouterLink} to="/messagerie" sx={linkStyle}>
                Messagerie
              </Button>

              <Button component={RouterLink} to="/profile" sx={linkStyle}>
                Profil
              </Button>

              {isPassenger && (
                <Button component={RouterLink} to="/my-reservations" sx={linkStyle}>
                  Mes réservations
                </Button>
              )}

              {isDriver && (
                <Button
                  component={RouterLink}
                  to="/trip/driver/reservations-driver"
                  onClick={handleDriverClick}
                  sx={linkStyle}
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
          )}
        </Box>

        {/* MOBILE MENU */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {!user ? (
              <MenuItem
                component={RouterLink}
                to="/login"
                onClick={handleMenuClose}
              >
                Login
              </MenuItem>
            ) : (
              <>
                <MenuItem disabled>Bonjour, {user?.name}</MenuItem>

                <Divider />

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
                  <MenuItem component={RouterLink} to="/my-reservations" onClick={handleMenuClose}>
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

                <Divider />

                <MenuItem onClick={logout} sx={{ color: "red" }}>
                  Déconnexion
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
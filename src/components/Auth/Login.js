import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// MUI
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = ({ setUser }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ⚠️ CORRECT endpoint selon ton backend
      const res = await API.post("/users/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ backend => { token, user }
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Réponse serveur invalide");
      }

      // 🔐 Stockage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 MAJ state global
      setUser(user);

      // ✅ message succès
      setSnackbar({
        open: true,
        message: "Connexion réussie ✅",
        severity: "success"
      });

      // 👉 redirection
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Email ou mot de passe incorrect";

      setError(msg);

      setSnackbar({
        open: true,
        message: msg,
        severity: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: "#2e9e53" }}
          >
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            
            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* PASSWORD */}
            <TextField
              fullWidth
              label="Mot de passe"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* BUTTON */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "#2e9e53"
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Se connecter"
              )}
            </Button>
          </Box>

          {/* REGISTER LINK */}
          <Typography mt={3} textAlign="center">
            Pas encore de compte ?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: "#2e9e53", fontWeight: "bold" }}
            >
              S'inscrire
            </Link>
          </Typography>
        </Paper>
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
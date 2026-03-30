import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["passenger"],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ROLES =================
  const handleRoleChange = (role, checked) => {
    setForm((prev) => {
      let roles = [...prev.roles];

      if (checked) {
        if (!roles.includes(role)) roles.push(role);
      } else {
        if (roles.length === 1) {
          showMessage("⚠️ Au moins un rôle requis", "warning");
          return prev;
        }
        roles = roles.filter((r) => r !== role);
      }

      return { ...prev, roles };
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name.trim()) return "Nom obligatoire";
    if (!form.email.trim()) return "Email obligatoire";
    if (form.password.length < 6)
      return "Mot de passe min 6 caractères";
    if (!form.roles.length) return "Choisir au moins un rôle";
    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const err = validate();
  if (err) {
    setError(err);
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Inscription
   const res = await API.post("/users/register", form);

const { token, user } = res.data;

if (!token || !user) {
  throw new Error("Erreur inscription");
}

// 🔐 Stockage
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));



showMessage("✅ Inscription réussie");

setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    const msg =
      err.response?.data?.error || "Erreur inscription";

    setError(msg);
    showMessage(msg, "error");
  } finally {
    setLoading(false);
  }
};
  return (
    <Box sx={{
      maxWidth: 500,
      mx: "auto",
      mt: 4,
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "background.paper",
    }}>
      <Typography variant="h5" mb={3} textAlign="center">
        Inscription
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>

          <TextField
            name="name"
            label="Nom"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="password"
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* ROLES */}
          <Box>
            <Typography variant="subtitle1">Rôles</Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.roles.includes("driver")}
                  onChange={(e) =>
                    handleRoleChange("driver", e.target.checked)
                  }
                  sx={{
                    color: "#2e9e53",
                    "&.Mui-checked": { color: "#2e9e53" },
                  }}
                />
              }
              label="Conducteur"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.roles.includes("passenger")}
                  onChange={(e) =>
                    handleRoleChange("passenger", e.target.checked)
                  }
                  sx={{
                    color: "#2e9e53",
                    "&.Mui-checked": { color: "#2e9e53" },
                  }}
                />
              }
              label="Passager"
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#2e9e53",
              "&:hover": { backgroundColor: "#248244" },
              py: 1.5,
            }}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
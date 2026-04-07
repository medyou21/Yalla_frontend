import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getUser, removeToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";

import "../../styles/profile.css";

const Profile = () => {
  const currentUser = getUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roles: [],
  });

  const [initialRoles, setInitialRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔹 FETCH PROFILE
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/users/${currentUser._id}`);

        const roles = Array.isArray(res.data.roles)
          ? res.data.roles
          : ["passenger"];

        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          roles,
        });

        setInitialRoles(roles);
      } catch {
        setError("Erreur chargement profil");
      }
    };

    if (currentUser?._id) fetch();
  }, []);

  const handleRoleChange = (role, checked) => {
    setForm((prev) => {
      let roles = [...prev.roles];

      if (checked) {
        roles.push(role);
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

  const rolesChanged = () => {
    return (
      JSON.stringify([...form.roles].sort()) !==
      JSON.stringify([...initialRoles].sort())
    );
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/users/${currentUser._id}`, form);

      if (rolesChanged()) {
        showMessage("🔄 Rôle modifié, reconnexion requise", "warning");

        setTimeout(() => {
          removeToken();
          navigate("/login");
        }, 1500);

        return;
      }

      showMessage("✅ Profil mis à jour");
    } catch {
      setError("Erreur mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="profileContainer">

      <Typography variant="h5" className="profileTitle">
        Mon profil
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={updateProfile}>
        <Stack spacing={2}>

          <TextField
            label="Nom"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            fullWidth
            required
          />

          <TextField
            label="Email"
            value={form.email}
            disabled
            fullWidth
          />

          <TextField
            label="Téléphone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            fullWidth
            required
          />

          {/* ROLES */}
          <Box className="rolesBox">
            <Typography className="rolesTitle">
              Rôles
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.roles.includes("driver")}
                  onChange={(e) =>
                    handleRoleChange("driver", e.target.checked)
                  }
                  className="checkboxCustom"
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
                  className="checkboxCustom"
                />
              }
              label="Passager"
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="saveBtn"
          >
            {loading ? "Mise à jour..." : "Sauvegarder"}
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

export default Profile;
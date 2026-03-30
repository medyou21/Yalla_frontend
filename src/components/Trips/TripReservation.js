import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getUser } from "../../utils/auth";
import { TripContext } from "../../context/TripContext";

// MUI
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Card,
  CardContent,
  Snackbar,
  Alert
} from "@mui/material";

const TripReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const { trips } = useContext(TripContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [form, setForm] = useState({
    seats: 1,
    name: currentUser?.name || "",
    phone: "",
  });

  // 🔹 Charger trajet
  useEffect(() => {
    const tripFromContext = trips.find((t) => t._id === id);

    if (tripFromContext) {
      setTrip(tripFromContext);
      setLoading(false);
    } else {
      fetchTrip();
    }
  }, [id, trips]);

  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      showMessage("Erreur chargement trajet", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Helpers
  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isPhoneValid = (phone) => {
    return /^[0-9 ]{8,15}$/.test(phone);
  };

  const totalPrice = trip ? form.seats * trip.price : 0;

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      return showMessage("Vous devez être connecté", "error");
    }

    if (!isPhoneValid(form.phone)) {
      return showMessage("Numéro invalide", "error");
    }

    try {
      setBooking(true);

      await API.post("/reservations", {
        tripId: trip._id,
        seatsBooked: Number(form.seats),
        passengerId: currentUser.id,
        phone: form.phone,
        name: form.name,
      });

      showMessage("Réservation confirmée 🚗", "success");

      setTimeout(() => navigate("/my"), 1500);

    } catch (err) {
      showMessage(err.response?.data?.error || "Erreur réservation", "error");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Typography textAlign="center">Chargement...</Typography>;
  if (!trip) return <Typography textAlign="center">Trajet introuvable</Typography>;

  const driver = trip.driverId || {};

  const dateFormatted = new Date(trip.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const isFull = trip.seatsAvailable === 0;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      
      <Typography variant="h4" mb={3} textAlign="center">
        Réserver votre place
      </Typography>

      {/* 🔹 CARD */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography color="text.secondary">
            Réservation pour :
          </Typography>

          <Typography variant="h6" fontWeight={600} mt={1}>
            {trip.departureCity} → {trip.arrivalCity}
          </Typography>

          <Typography mt={1}>
            Avec <strong>{driver.name || "Conducteur"}</strong>
          </Typography>

          <Typography>
            📅 {dateFormatted} • ⏰ {trip.time}
          </Typography>

          <Typography color="success.main" fontWeight={600} mt={1}>
            💰 {trip.price} TND / place
          </Typography>

          {/* 💡 TOTAL */}
          <Typography mt={1} fontWeight={700}>
            Total : {totalPrice} TND
          </Typography>
        </CardContent>
      </Card>

      {/* 🔹 FORM */}
      {isFull ? (
        <Typography color="error" textAlign="center" fontWeight={600}>
          🚫 Trajet complet
        </Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>

            <TextField
              select
              label="Nombre de places"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              fullWidth
            >
              {[1, 2, 3, 4].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nom complet"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Téléphone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ex: 22123456"
              error={form.phone && !isPhoneValid(form.phone)}
              helperText={
                form.phone && !isPhoneValid(form.phone)
                  ? "Numéro invalide"
                  : ""
              }
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={booking}
              sx={{
                backgroundColor: "#2e9e53",
                "&:hover": { backgroundColor: "#248244" },
                py: 1.5
              }}
            >
              {booking ? "Confirmation..." : "Confirmer la réservation"}
            </Button>

          </Stack>
        </Box>
      )}

      {/* 🔹 SNACKBAR */}
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

export default TripReservation;
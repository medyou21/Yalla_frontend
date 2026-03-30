import React, { useState } from "react";
import API from "../../api/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert
} from "@mui/material";

const TripForm = () => {
  const [trip, setTrip] = useState({
    departureCity: "",
    arrivalCity: "",
    date: "",
    time: "",
    price: "",
    seatsAvailable: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!trip.departureCity || !trip.arrivalCity) {
      return "Les villes sont obligatoires";
    }
    if (!trip.date || !trip.time) {
      return "Date et heure obligatoires";
    }
    if (!trip.price || trip.price <= 0) {
      return "Prix invalide";
    }
    if (!trip.seatsAvailable || trip.seatsAvailable <= 0) {
      return "Nombre de places invalide";
    }
    return null;
  };

  const publishTrip = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "/trips",
        {
          ...trip,
          price: Number(trip.price),
          seatsAvailable: Number(trip.seatsAvailable),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 IMPORTANT
          },
        }
      );

      alert("✅ Trajet publié avec succès !");

      setTrip({
        departureCity: "",
        arrivalCity: "",
        date: "",
        time: "",
        price: "",
        seatsAvailable: "",
        description: ""
      });

    } catch (err) {
      console.error("Erreur:", err.response?.data);

      if (err.response?.status === 401) {
        setError("❌ Non autorisé (connecte-toi)");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Données invalides");
      } else {
        setError("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 550,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper"
      }}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        Publier un trajet
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={publishTrip}>
        <Stack spacing={2}>

          <TextField
            name="departureCity"
            label="Ville départ"
            value={trip.departureCity}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="arrivalCity"
            label="Ville arrivée"
            value={trip.arrivalCity}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="date"
            label="Date"
            type="date"
            value={trip.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            name="time"
            label="Heure"
            type="time"
            value={trip.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            name="price"
            label="Prix (€)"
            type="number"
            value={trip.price}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="seatsAvailable"
            label="Places disponibles"
            type="number"
            value={trip.seatsAvailable}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="description"
            label="Description du trajet"
            value={trip.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#2e9e53",
              "&:hover": { backgroundColor: "#248244" },
              py: 1.5
            }}
          >
            {loading ? "Publication..." : "Publier"}
          </Button>

        </Stack>
      </form>
    </Box>
  );
};

export default TripForm;
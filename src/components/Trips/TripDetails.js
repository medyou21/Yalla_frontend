import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/api";
import AddReview from "../Reviews/AddReview";
import DriverReviews from "../Reviews/DriverReviews";
import RealtimeChat from "../Messages/RealtimeChat";
import { getUser } from "../../utils/auth";
import { TripContext } from "../../context/TripContext";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  Rating,
} from "@mui/material";

const TripDetails = () => {
  const { id } = useParams();
  const currentUser = getUser();
  const { trips } = useContext(TripContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // 🔹 FETCH TRIP
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripFromContext = trips.find((t) => t._id === id);

        if (tripFromContext) {
          setTrip(tripFromContext);
        } else {
          const res = await API.get(`/trips/${id}`);
          setTrip(res.data);
        }
      } catch (err) {
        console.error("Erreur fetchTrip :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, trips]);

  // 🔹 FETCH RATING (SAFE ✅)
  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (!trip?.driverId?._id) return;

        const res = await API.get(`/reviews/rating/${trip.driverId._id}`);

        setAvgRating(res.data.rating);
        setTotalReviews(res.data.total);

      } catch (err) {
        console.error("Erreur rating :", err.response?.data);
      }
    };

    fetchRating();
  }, [trip]);

  // 🔴 RETURN après hooks uniquement
  if (loading) return <Typography>Chargement du trajet...</Typography>;
  if (!trip) return <Typography>Trajet introuvable</Typography>;

  const driver = trip.driverId || {};
  const driverId = driver._id || null;

  const isPassenger = currentUser?.roles?.includes("passenger");
  const isDriver = currentUser?._id === driverId;

  const dateFormatted = new Date(trip.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const receiverId = isDriver ? trip.passengerId : driverId;

  const receiverName = isDriver
    ? trip.passengerName || "Passager"
    : driver.name || "Conducteur";

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          {trip.departureCity} → {trip.arrivalCity}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          📅 {dateFormatted} • ⏰ {trip.time || "Non précisée"}
        </Typography>

        <Typography variant="h6" fontWeight={700} color="success.main">
          {trip.price || 0} TND
        </Typography>
      </Box>

      {/* DRIVER */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Avatar
          src={driver.photo || "/logo192.png"}
          sx={{ width: 72, height: 72 }}
        />

        <Box>
          <Typography variant="h6">
            {driver.name || "Conducteur"}
          </Typography>

          {/* ⭐ RATING */}
          {totalReviews > 0 ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight={600}>
                {avgRating}
              </Typography>

              <Rating
                value={Number(avgRating)}
                precision={0.5}
                readOnly
                size="small"
              />

              <Typography variant="body2" color="text.secondary">
                ({totalReviews} avis)
              </Typography>
            </Stack>
          ) : (
            <Typography color="text.secondary">
              Aucun avis
            </Typography>
          )}

          <Typography color="text.secondary">
            🚗 {driver.car || "Voiture"}
          </Typography>
        </Box>
      </Box>

      {/* INFOS */}
      <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <strong>Départ</strong>
            <span>{trip.departureCity}</span>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <strong>Arrivée</strong>
            <span>{trip.arrivalCity}</span>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <strong>Places disponibles</strong>
            <span>{trip.seatsAvailable || 0}</span>
          </Stack>

          {trip.description && (
            <Stack direction="row" justifyContent="space-between">
              <strong>Description</strong>
              <span>{trip.description}</span>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* CTA */}
      <Box textAlign="center">
        {!currentUser ? (
          <Typography>Connectez-vous pour réserver</Typography>
        ) : trip.seatsAvailable === 0 ? (
          <Typography color="error" fontWeight={600}>
            🚫 Trajet complet
          </Typography>
        ) : isPassenger ? (
          <Button
            component={Link}
            to={`/trip/${trip._id}/reserve`}
            variant="contained"
          >
            Réserver maintenant
          </Button>
        ) : (
          <Typography color="text.secondary">
            Vous n'avez pas le rôle passager
          </Typography>
        )}
      </Box>

      {/* AVIS */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isPassenger && driverId && (
          <AddReview
            tripId={trip._id}
            driverId={driverId}
            user={currentUser}
          />
        )}

        {driverId && <DriverReviews driverId={driverId} />}
      </Box>

      {/* CHAT */}
      {currentUser && receiverId && (
        <RealtimeChat
          user={currentUser}
          tripId={trip._id}
          receiverId={receiverId}
          receiverName={receiverName}
        />
      )}
    </Box>
  );
};

export default TripDetails;
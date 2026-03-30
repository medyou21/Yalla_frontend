// src/components/Trips/TripReservationsDriver.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getUser } from "../../utils/auth";
import { useSocket } from "../../hooks/useSocket";
import RealtimeChat from "../Messages/RealtimeChat";
import TripReviews from "./TripReviews";

// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const TripReservationsDriver = () => {
  const currentUser = getUser();
  const socket = useSocket();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChats, setOpenChats] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔹 Fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await API.get("/reservations/driver");
      setReservations(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage("Erreur chargement réservations", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Init
  useEffect(() => {
    if (!currentUser) return;
    fetchReservations();
  }, [currentUser]);

  // 🔹 SOCKET (comme MyReservations)
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      showMessage("Mise à jour reçue 🔄");
      fetchReservations();
    };

    const handleNew = () => {
      showMessage("Nouvelle réservation 📩");
      fetchReservations();
    };

    socket.on("newReservation", handleNew);
    socket.on("reservationStatusChanged", handleUpdate);
    socket.on("reservationCanceled", handleUpdate);

    return () => {
      socket.off("newReservation", handleNew);
      socket.off("reservationStatusChanged", handleUpdate);
      socket.off("reservationCanceled", handleUpdate);
    };
  }, [socket]);

  // 🔹 Changer statut
  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      showMessage(`Réservation ${status} ✅`);
      fetchReservations(); // 🔥 important
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage("Erreur changement statut", "error");
    }
  };

  const toggleChat = (reservationId) => {
    setOpenChats((prev) =>
      prev.includes(reservationId)
        ? prev.filter((id) => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "success";
    if (status === "pending") return "warning";
    return "error";
  };

  if (loading)
    return <Typography textAlign="center">Chargement...</Typography>;

  if (!reservations.length)
    return <Typography textAlign="center">Aucune réservation.</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h5" mb={2}>
        Réservations de mes trajets
      </Typography>

      <Grid container spacing={2}>
        {reservations.map((r) => {
          const trip = r.tripId || {};
          const passenger = r.passengerId || {};

          return (
            <Grid item xs={12} md={6} key={r._id}>
              <Card>
                <CardContent>
                  <Typography fontWeight={600}>
                    🛫 {trip.departureCity} → 🏁 {trip.arrivalCity}
                  </Typography>

                  <Typography variant="body2">
                    📅{" "}
                    {trip.date
                      ? new Date(trip.date).toLocaleDateString()
                      : "N/A"}{" "}
                    • ⏰ {trip.time || ""}
                  </Typography>

                  <Typography>💺 {r.seatsBooked} place(s)</Typography>

                  <Box mt={1}>
                    <Chip
                      label={r.status}
                      color={getStatusColor(r.status)}
                    />
                  </Box>

                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {r.status === "pending" && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() =>
                            handleStatus(r._id, "confirmed")
                          }
                        >
                          ✔ Confirmer
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() =>
                            handleStatus(r._id, "canceled")
                          }
                        >
                          ✖ Annuler
                        </Button>
                      </>
                    )}

                    <IconButton
                      color="primary"
                      onClick={() => toggleChat(r._id)}
                    >
                      <ChatIcon />
                    </IconButton>
                  </Box>

                  {/* Avis */}
                  {r.status === "confirmed" && (
                    <TripReviews
                      tripId={trip._id}
                      reviewedUserId={passenger._id}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* CHAT */}
      {openChats.map((reservationId, index) => {
        const r = reservations.find((res) => res._id === reservationId);
        if (!r) return null;

        const trip = r.tripId || {};
        const passenger = r.passengerId || {};

        if (!passenger._id || !currentUser) return null;

        return (
          <Paper
            key={reservationId}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20 + index * 340,
              width: 320,
              maxHeight: 400,
              zIndex: 1500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.main",
                color: "#fff",
                p: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography fontSize={14}>
                💬 Chat - {passenger.name || "Passager"}
              </Typography>

              <IconButton
                size="small"
                onClick={() =>
                  setOpenChats((prev) =>
                    prev.filter((id) => id !== reservationId)
                  )
                }
                sx={{ color: "#fff" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <RealtimeChat
                user={currentUser}
                tripId={trip._id}
                receiverId={passenger._id}
                receiverName={passenger.name || "Passager"}
              />
            </Box>
          </Paper>
        );
      })}

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
    </Box>
  );
};

export default TripReservationsDriver;
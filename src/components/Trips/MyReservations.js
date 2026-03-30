import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getUser } from "../../utils/auth";
import { useSocket } from "../../hooks/useSocket";
import RealtimeChat from "../Messages/RealtimeChat";
import TripMap from "./TripMap";
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
  Collapse
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

const MyReservations = () => {
  const currentUser = getUser();
  const socket = useSocket();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openChats, setOpenChats] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔹 SOCKET
  useEffect(() => {
    if (!socket) return;

    const handleStatus = () => {
      showMessage("Statut mis à jour 🔄");
      fetchReservations();
    };

    const handleCanceled = () => {
      showMessage("Réservation annulée ❌", "warning");
      fetchReservations();
    };

    socket.on("reservationStatusChanged", handleStatus);
    socket.on("reservationCanceled", handleCanceled);

    return () => {
      socket.off("reservationStatusChanged", handleStatus);
      socket.off("reservationCanceled", handleCanceled);
    };
  }, [socket]);

  const fetchReservations = async () => {
    try {
      const res = await API.get("/reservations/my");
      setReservations(res.data);
    } catch {
      showMessage("Erreur chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    try {
      await API.delete(`/reservations/${id}`);
      showMessage("Réservation annulée");
      fetchReservations();
    } catch {
      showMessage("Erreur annulation", "error");
    }
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "success";
    if (status === "pending") return "warning";
    return "error";
  };

  const toggleChat = (reservationId) => {
    setOpenChats((prev) =>
      prev.includes(reservationId)
        ? prev.filter((id) => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  if (loading) return <Typography textAlign="center">Chargement...</Typography>;
  if (!reservations.length) return <Typography textAlign="center">Aucune réservation.</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h5" mb={2}>
        Mes réservations
      </Typography>

      <Grid container spacing={2}>
        {reservations.map((r) => {
          const trip = r.tripId || {};

          const driver =
            typeof trip.driverId === "string"
              ? { _id: trip.driverId, name: "Conducteur" }
              : trip.driverId || { _id: null, name: "Conducteur" };

          return (
            <Grid item xs={12} md={6} key={r._id}>
              <Card>
                <CardContent>
                  <Typography fontWeight={600}>
                    {trip.departureCity} → {trip.arrivalCity}
                  </Typography>

                  <Typography variant="body2">
                    📅 {trip.date ? new Date(trip.date).toLocaleDateString() : "N/A"}
                  </Typography>

                  <Typography>💺 {r.seatsBooked} place(s)</Typography>

                  <Box mt={1}>
                    <Chip label={r.status} color={getStatusColor(r.status)} />
                  </Box>

                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {r.status !== "canceled" && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => cancelReservation(r._id)}
                      >
                        Annuler
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      Voir trajet
                    </Button>

                    <IconButton color="primary" onClick={() => toggleChat(r._id)}>
                      <ChatIcon />
                    </IconButton>
                  </Box>

                  {/* MAP */}
                  <Collapse in={selectedTrip?._id === trip._id}>
                    <Box mt={2}>
                      <TripMap
                        departure={trip.departureCity}
                        arrival={trip.arrivalCity}
                      />
                    </Box>
                  </Collapse>

                  {/* REVIEWS */}
                  {r.status === "confirmed" && driver._id && (
                    <TripReviews
                      tripId={trip._id}
                      reviewedUserId={driver._id}
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
        const driver =
          typeof trip.driverId === "string"
            ? { _id: trip.driverId, name: "Conducteur" }
            : trip.driverId || { _id: null, name: "Conducteur" };

        if (!driver._id || !currentUser) return null;

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
                💬 Chat - {driver.name}
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
                receiverId={driver._id}
                receiverName={driver.name}
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

export default MyReservations;
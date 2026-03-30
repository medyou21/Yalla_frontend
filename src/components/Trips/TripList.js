import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TripContext } from "../../context/TripContext";
import { getUser } from "../../utils/auth";

// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Chip
} from "@mui/material";
import { keyframes } from "@mui/system";

const TripList = () => {
  const { trips, loading } = useContext(TripContext);
  const user = getUser();

  // animation voiture
  const drive = keyframes`
    0% { left: -10px; }
    100% { left: 100%; }
  `;

  if (loading) return <Typography>Chargement des trajets...</Typography>;

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Trajets disponibles
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {trips.map((trip) => {
          const driver = trip.driverId || {};
          const dateFormatted = new Date(trip.date).toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });

          return (
            <Grid item xs={12} sm={6} md={4} key={trip._id}>
              <Card sx={{ display: "flex", flexDirection: "column", p: 2, height: "100%" }}>
                
                {/* DRIVER */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar src={driver.photo || "/logo192.png"} />
                  <Box>
                    <Typography fontWeight={600}>{driver.name || "Conducteur"}</Typography>
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip label={`⭐ ${driver.rating || 4.8}`} size="small" color="warning" />
                      <Chip label={`🚗 ${driver.car || "Peugeot 208"}`} size="small" />
                    </Stack>
                  </Box>
                </Box>

                {/* ROUTE */}
                <Box sx={{ flex: 1, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography>🛫 {trip.departureCity}</Typography>
                    <Box sx={{ flex: 1, height: 6, backgroundColor: "#ddd", borderRadius: 3, position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: -5,
                          fontSize: 16,
                          animation: `${drive} 5s linear infinite`,
                        }}
                      >
                        🚗
                      </Box>
                    </Box>
                    <Typography>🏁 {trip.arrivalCity}</Typography>
                  </Box>
                  <Typography fontSize={13} color="text.secondary">
                    📅 {dateFormatted} • ⏰ {trip.time} • 💺 {trip.seatsAvailable} place(s)
                  </Typography>
                  {trip.description && (
                    <Typography fontSize={13} color="text.secondary" mt={1}>
                      {trip.description}
                    </Typography>
                  )}
                </Box>

                {/* PRIX & BOUTON */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight={600} color="success.main">
                    {trip.price} TND
                  </Typography>
                  {trip.seatsAvailable === 0 ? (
                    <Typography color="error" fontWeight={600}>🚫 Complet</Typography>
                  ) : (
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/trip/${trip._id}`}
                      sx={{ backgroundColor: "#2e9e53", "&:hover": { backgroundColor: "#248244" } }}
                    >
                      Voir détails
                    </Button>
                  )}
                </Box>

              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TripList;
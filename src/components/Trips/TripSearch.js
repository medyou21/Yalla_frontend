import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TripContext } from "../../context/TripContext";
import SearchBar from "../SearchBar/SearchBar";
import TripMap from "./TripMap";

// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Button,
  Stack,
  Chip,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import { keyframes } from "@mui/system";

const TripSearch = () => {
  const [searchParams] = useSearchParams();
  const { trips, loading } = useContext(TripContext);

  const [filters, setFilters] = useState({
    departure: "",
    arrival: "",
    date: "",
    passengers: 1
  });
  const [sort, setSort] = useState("price");

  useEffect(() => {
    const departure = searchParams.get("departure") || "";
    const arrival = searchParams.get("arrival") || "";
    const date = searchParams.get("date") || "";
    setFilters((prev) => ({ ...prev, departure, arrival, date }));
  }, [searchParams]);

  const filteredTrips = trips.filter((trip) => {
    const depMatch = filters.departure
      ? trip.departureCity.toLowerCase().includes(filters.departure.toLowerCase())
      : true;
    const arrMatch = filters.arrival
      ? trip.arrivalCity.toLowerCase().includes(filters.arrival.toLowerCase())
      : true;
    const dateMatch = filters.date ? trip.date === filters.date : true;
    return depMatch && arrMatch && dateMatch;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "time") return a.time.localeCompare(b.time);
    return 0;
  });

  // Animation voiture
  const drive = keyframes`
    0% { left: -10px; }
    100% { left: 100%; }
  `;

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Rechercher un trajet
      </Typography>

      <SearchBar filters={filters} setFilters={setFilters} />

      {/* TRI */}
      <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Typography>Trier par :</Typography>
        <FormControl size="small">
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="price">Prix</MenuItem>
            <MenuItem value="time">Heure de départ</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* LISTE TRAJETS */}
      {loading && <Typography textAlign="center">Chargement...</Typography>}
      {!loading && sortedTrips.length === 0 && <Typography textAlign="center">Aucun trajet trouvé</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {sortedTrips.map((trip) => {
          const driver = trip.driverId || {};

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
                    📅 {trip.date} • ⏰ {trip.time} • 💺 {trip.passengers || 1} place(s)
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

      {/* MAP */}
      {filters.departure && filters.arrival && sortedTrips.length > 0 && (
        <Box sx={{ mt: 4, borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
          <TripMap departure={filters.departure} arrival={filters.arrival} />
        </Box>
      )}
    </Box>
  );
};

export default TripSearch;
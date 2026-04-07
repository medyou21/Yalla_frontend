import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TripContext } from "../../context/TripContext";
import SearchBar from "../SearchBar/SearchBar";
import TripMap from "./TripMap";
import "../../styles/tripsearch.css";

// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

const TripSearch = () => {
  const [searchParams] = useSearchParams();
  const { trips, loading } = useContext(TripContext);

  const [filters, setFilters] = useState({
    departure: "",
    arrival: "",
    date: "",
    passengers: 1,
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

  return (
    <Box className="tripsearch-page">
      <Typography variant="h4" mb={3} textAlign="center">
        Rechercher un trajet
      </Typography>

      <SearchBar filters={filters} setFilters={setFilters} />

      {/* TRI */}
      <Box className="trip-sort">
        <Typography component="span">Trier par :</Typography>

        <FormControl size="small" sx={{ ml: 2 }}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="price">Prix</MenuItem>
            <MenuItem value="time">Heure</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* LOADING */}
      {loading && <Typography align="center">Chargement...</Typography>}

      {!loading && sortedTrips.length === 0 && (
        <Typography align="center">Aucun trajet trouvé</Typography>
      )}

      {/* LIST */}
      <Grid container spacing={2}>
        {sortedTrips.map((trip) => {
          const driver = trip.driverId || {};
          const isFull = trip.seatsAvailable === 0;

          return (
            <Grid item xs={12} key={trip._id}>
              <Card
                component={isFull ? "div" : Link}
                to={!isFull ? `/trip/${trip._id}` : undefined}
                className={`trip-card clickable-card ${isFull ? "disabled-card" : ""}`}
              >
                {/* DRIVER */}
                <Box className="driver">
                  <Avatar src={driver.photo || "/logo192.png"} />
                  <Box>
                    <strong>{driver.name || "Conducteur"}</strong>
                    <div className="driver-rating">
                      ⭐ {driver.rating || 4.8}
                    </div>
                    <div className="driver-car">
                      🚗 {driver.car || "Peugeot 208"}
                    </div>
                  </Box>
                </Box>

                {/* ROUTE */}
                <Box className="route">
                  <div className="cities">
                    <span>{trip.departureCity}</span>
                    <div className="line"></div>
                    <span>{trip.arrivalCity}</span>
                  </div>

                  <div className="trip-info">
                    📅 {trip.date} <br />
                    ⏰ {trip.time} <br />
                    💺 {trip.passengers || 1}
                  </div>
                </Box>

                {/* PRICE */}
                <Box className="price">
                  <strong>{trip.price} TND</strong>

                  {isFull ? (
                    <span className="full-badge">🚫 Complet</span>
                  ) : (
                    <span className="btn-book">Voir détails</span>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* MAP */}
      {filters.departure && filters.arrival && sortedTrips.length > 0 && (
        <Box className="map-container">
          <TripMap
            departure={filters.departure}
            arrival={filters.arrival}
          />
        </Box>
      )}
    </Box>
  );
};

export default TripSearch;
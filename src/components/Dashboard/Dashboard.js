import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Components
import DashboardHero from "./DashboardHero";
import DashboardCard from "./DashboardCard";

// Icons
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import ChatIcon from "@mui/icons-material/Chat";
import StarIcon from "@mui/icons-material/Star";
import SavingsIcon from "@mui/icons-material/Savings";

import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isDriver = user?.roles?.includes("driver");
  const isPassenger = user?.roles?.includes("passenger");
  const isVisitor = !user;

  const [filters, setFilters] = useState({
    departure: "",
    arrival: "",
    date: "",
    passengers: 1,
  });

  return (
    <Box>

      {/* HERO */}
      <DashboardHero
        isDriver={isDriver}
        isPassenger={isPassenger}
        isVisitor={isVisitor}
        filters={filters}
        setFilters={setFilters}
      />

      {/* CONTENT */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">

          {/* DRIVER */}
          {isDriver && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<DirectionsCarIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Publier un trajet"
                  buttonText="Publier"
                  onClick={() => navigate("/publish")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<HistoryIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Mes trajets"
                  buttonText="Voir"
                  onClick={() => navigate("/my-trips")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<StarIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Mes avis"
                  buttonText="Voir"
                  onClick={() => navigate("/my-reviews")}
                />
              </Grid>
            </>
          )}

          {/* PASSENGER */}
          {isPassenger && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<SearchIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Rechercher un trajet"
                  buttonText="Chercher"
                  onClick={() => navigate("/search")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<HistoryIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Mes réservations"
                  buttonText="Voir"
                  onClick={() => navigate("/my-reservations")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  icon={<ChatIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
                  title="Messages"
                  buttonText="Ouvrir"
                  onClick={() => navigate("/messages")}
                />
              </Grid>
            </>
          )}

          {/* VISITOR */}
          {isVisitor && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="Créer un compte"
                  buttonText="S'inscrire"
                  onClick={() => navigate("/register")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="Se connecter"
                  buttonText="Connexion"
                  onClick={() => navigate("/login")}
                />
              </Grid>
            </>
          )}

          {/* COMMON */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              icon={<SavingsIcon sx={{ fontSize: 45, color: "#2e9e53" }} />}
              title="Économisez"
              description="Voyage moins cher et écologique"
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
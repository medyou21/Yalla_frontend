import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

// Icons
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SearchIcon from "@mui/icons-material/Search";
import SavingsIcon from "@mui/icons-material/Savings";
import HistoryIcon from "@mui/icons-material/History";
import ChatIcon from "@mui/icons-material/Chat";
import StarIcon from "@mui/icons-material/Star";

// Animation
import { motion } from "framer-motion";

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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  return (
    <Box>

      {/* HERO */}
      <Box
        sx={{
          minHeight: 350,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/hero.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          {isVisitor && "Bienvenue 👋"}
          {isPassenger && "Trouvez votre trajet 🚀"}
          {isDriver && "Gérez vos trajets 🚗"}
        </Typography>

        <Typography variant="h6" sx={{ mb: 3 }}>
          {isVisitor && "Connectez-vous pour commencer"}
          {isPassenger && "Voyagez facilement partout"}
          {isDriver && "Publiez et gérez vos trajets"}
        </Typography>

        {/* SEARCH visible pour tous */}
        <Box
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: 800,
            p: 2,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.2)",
          }}
        >
          <SearchBar filters={filters} setFilters={setFilters} />
        </Box>
      </Box>

      {/* FEATURES */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">

          {/* 🚗 CONDUCTEUR */}
          {isDriver && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <DirectionsCarIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Publier un trajet
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/publish")}>
                      Publier
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <HistoryIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Mes trajets
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/my-trips")}>
                      Voir
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <StarIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Mes avis
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/my-reviews")}>
                      Voir
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            </>
          )}

          {/* 🧍 PASSAGER */}
          {isPassenger && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <SearchIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Rechercher un trajet
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/search")}>
                      Chercher
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <HistoryIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Mes réservations
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/my-reservations")}>
                      Voir
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
                  <Card sx={{ textAlign: "center", p: 3 }}>
                    <ChatIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                    <Typography variant="h6" mt={2}>
                      Messages
                    </Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate("/messages")}>
                      Ouvrir
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            </>
          )}

          {/* 👤 VISITEUR */}
          {isVisitor && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6">Créer un compte</Typography>
                  <Button sx={{ mt: 2 }} onClick={() => navigate("/register")}>
                    S'inscrire
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6">Se connecter</Typography>
                  <Button sx={{ mt: 2 }} onClick={() => navigate("/login")}>
                    Connexion
                  </Button>
                </Card>
              </Grid>
            </>
          )}

          {/* COMMUN */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible">
              <Card sx={{ textAlign: "center", p: 3 }}>
                <SavingsIcon sx={{ fontSize: 45, color: "#2e9e53" }} />
                <Typography variant="h6" mt={2}>
                  Économisez
                </Typography>
                <Typography color="text.secondary">
                  Voyage moins cher et écologique
                </Typography>
              </Card>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
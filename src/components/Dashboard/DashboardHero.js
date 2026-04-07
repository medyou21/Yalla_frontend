import React from "react";
import { Box, Typography } from "@mui/material";
import SearchBar from "../SearchBar/SearchBar";

import "./dashboard.css";

const DashboardHero = ({ isDriver, isPassenger, isVisitor, filters, setFilters }) => {
  return (
    <Box className="heroCustom">

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

      <Box className="searchContainer">
        <SearchBar filters={filters} setFilters={setFilters} />
      </Box>

    </Box>
  );
};

export default DashboardHero;
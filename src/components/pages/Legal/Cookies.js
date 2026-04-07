import React from "react";
import { Box, Typography } from "@mui/material";
import "../../../styles/legal.css";

const Cookies = () => {
  return (
    <Box className="legalContainer">

      <Typography variant="h5" className="legalTitle">
        Politique des cookies
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        1. Qu’est-ce qu’un cookie ?
      </Typography>
      <Typography className="legalText">
        Un cookie est un petit fichier stocké sur votre appareil lors de la navigation.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        2. Utilisation des cookies
      </Typography>
      <Typography className="legalText">
        Nous utilisons des cookies pour :
        <br />- améliorer la navigation
        <br />- analyser le trafic
        <br />- sécuriser le site
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        3. Gestion des cookies
      </Typography>
      <Typography className="legalText">
        Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        4. Consentement
      </Typography>
      <Typography className="legalText">
        En continuant à utiliser le site, vous acceptez l’utilisation des cookies.
      </Typography>

    </Box>
  );
};

export default Cookies;
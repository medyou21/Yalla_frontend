import React from "react";
import { Box, Typography } from "@mui/material";
import "../../../styles/legal.css";

const Terms = () => {
  return (
    <Box className="legalContainer">

      <Typography variant="h5" className="legalTitle">
        Conditions générales d’utilisation (CGU)
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        1. Objet
      </Typography>
      <Typography className="legalText">
        Les présentes CGU définissent les conditions d’utilisation de la plateforme YallaRide.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        2. Inscription
      </Typography>
      <Typography className="legalText">
        L’utilisateur doit fournir des informations exactes lors de son inscription.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        3. Utilisation du service
      </Typography>
      <Typography className="legalText">
        Le service permet la mise en relation entre conducteurs et passagers pour le covoiturage.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        4. Responsabilité
      </Typography>
      <Typography className="legalText">
        Chaque utilisateur est responsable de son comportement et de ses actions sur la plateforme.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        5. Interdictions
      </Typography>
      <Typography className="legalText">
        Il est interdit :
        <br />- d’utiliser la plateforme à des fins illégales
        <br />- de publier du contenu offensant
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        6. Modification
      </Typography>
      <Typography className="legalText">
        YallaRide se réserve le droit de modifier les CGU à tout moment.
      </Typography>

    </Box>
  );
};

export default Terms;
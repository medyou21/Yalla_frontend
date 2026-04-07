import React from "react";
import { Box, Typography } from "@mui/material";
import "../../../styles/legal.css";

const MentionsLegales = () => {
  return (
    <Box className="legalContainer">
      
      <Typography variant="h5" className="legalTitle">
        Mentions légales
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        1. Éditeur du site
      </Typography>
      <Typography className="legalText">
        Le site YallaRide est édité par :
        <br />
        Nom de la société : YallaRide
        <br />
        Adresse : 10 rue Exemple, 75000 Paris, France
        <br />
        Email : contact@yallaride.com
        <br />
        Téléphone : +33 6 00 00 00 00
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        2. Directeur de la publication
      </Typography>
      <Typography className="legalText">
        Le directeur de la publication est : [Nom du responsable]
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        3. Hébergement
      </Typography>
      <Typography className="legalText">
        Nom : [Nom de l’hébergeur]
        <br />
        Adresse : [Adresse de l’hébergeur]
        <br />
        Site web : [URL]
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        4. Propriété intellectuelle
      </Typography>
      <Typography className="legalText">
        L’ensemble du contenu (textes, images, logo, etc.) est protégé par les lois en vigueur sur la propriété intellectuelle.
        Toute reproduction est interdite sans autorisation.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        5. Responsabilité
      </Typography>
      <Typography className="legalText">
        YallaRide ne peut être tenu responsable des dommages directs ou indirects liés à l’utilisation du site.
      </Typography>

    </Box>
  );
};

export default MentionsLegales;
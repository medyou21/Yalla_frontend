import React from "react";
import { Box, Typography } from "@mui/material";
import "../../../styles/legal.css";

const Privacy = () => {
  return (
    <Box className="legalContainer">

      <Typography variant="h5" className="legalTitle">
        Politique de confidentialité
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        1. Collecte des données
      </Typography>
      <Typography className="legalText">
        Nous collectons les données suivantes :
        <br />- Nom et prénom
        <br />- Adresse email
        <br />- Numéro de téléphone
        <br />- Données de navigation
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        2. Utilisation des données
      </Typography>
      <Typography className="legalText">
        Les données sont utilisées pour :
        <br />- Fournir nos services
        <br />- Améliorer l’expérience utilisateur
        <br />- Assurer la sécurité
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        3. Partage des données
      </Typography>
      <Typography className="legalText">
        Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec des prestataires techniques nécessaires au fonctionnement du service.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        4. Conservation
      </Typography>
      <Typography className="legalText">
        Les données sont conservées pendant la durée nécessaire à la finalité du service.
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        5. Vos droits (RGPD)
      </Typography>
      <Typography className="legalText">
        Conformément au RGPD, vous disposez des droits suivants :
        <br />- Accès à vos données
        <br />- Rectification
        <br />- Suppression
        <br />- Opposition
      </Typography>

      <Typography variant="h6" className="legalSubtitle">
        6. Contact
      </Typography>
      <Typography className="legalText">
        Pour toute demande : contact@yallaride.com
      </Typography>

    </Box>
  );
};

export default Privacy;
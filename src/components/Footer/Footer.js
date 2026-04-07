import React from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <Box className="footer">
      
      {/* TOP */}
      <Box className="footer-top">
        
        {/* LOGO */}
        <Box className="footer-col">
          <Typography variant="h6" className="footer-logo">
            YallaRide
          </Typography>
          <Typography className="footer-desc">
            Plateforme de covoiturage simple, rapide et économique.
          </Typography>
        </Box>

        {/* NAV */}
        <Box className="footer-col">
          <Typography className="footer-title">Navigation</Typography>
          <Stack spacing={1}>
            <Link to="/">Accueil</Link>
            <Link to="/search">Rechercher</Link>
            <Link to="/profile">Profil</Link>
          </Stack>
        </Box>

        {/* LEGAL 🔥 */}
        <Box className="footer-col">
          <Typography className="footer-title">Légal</Typography>
          <Stack spacing={1}>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/privacy">Politique de confidentialité</Link>
            <Link to="/terms">Conditions générales</Link>
            <Link to="/cookies">Cookies</Link>
          </Stack>
        </Box>

        {/* CONTACT */}
        <Box className="footer-col">
          <Typography className="footer-title">Contact</Typography>
          <Typography>Email : contact@yallaride.com</Typography>
          <Typography>Tél : +33 6 00 00 00 00</Typography>
        </Box>

        {/* SOCIAL */}
        <Box className="footer-col">
          <Typography className="footer-title">Suivez-nous</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton className="social-btn"><Facebook /></IconButton>
            <IconButton className="social-btn"><Instagram /></IconButton>
            <IconButton className="social-btn"><Twitter /></IconButton>
            <IconButton className="social-btn"><LinkedIn /></IconButton>
          </Stack>
        </Box>

      </Box>

      {/* BOTTOM */}
      <Box className="footer-bottom">
        <Typography>
          © {new Date().getFullYear()} YallaRide — Tous droits réservés
        </Typography>

        {/* 🔥 liens rapides */}
        <Box className="footer-legal-links">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/privacy">Confidentialité</Link>
          <Link to="/terms">CGU</Link>
        </Box>
      </Box>

    </Box>
  );
};

export default Footer;
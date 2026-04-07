import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./cookie.css";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesAccepted");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  const refuseCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box className="cookie-banner">
      <Typography className="cookie-text">
        Nous utilisons des cookies pour améliorer votre expérience.
      </Typography>

      <Box className="cookie-actions">
        <Button
          variant="contained"
          className="accept-btn"
          onClick={acceptCookies}
        >
          Accepter
        </Button>

        <Button
          variant="outlined"
          className="refuse-btn"
          onClick={refuseCookies}
        >
          Refuser
        </Button>
      </Box>
    </Box>
  );
};

export default CookieBanner;
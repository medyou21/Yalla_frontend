import React, { useState } from "react";
import API from "../../api/api";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

const AddReview = ({ tripId, driverId, user }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async () => {
    if (loading) return;

    if (!user?._id) {
      setError("Utilisateur non connecté");
      return;
    }

    if (!rating) {
      setError("Veuillez donner une note");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const res = await API.post("/reviews", {
        reviewerId: user._id,
        reviewedUserId: driverId,
        tripId,
        rating: Number(rating),
        comment,
      });

      console.log("✅ Avis créé :", res.data);

      setSuccess(true);
      setRating(5);
      setComment("");

    } catch (err) {
      console.log("❌ ERREUR :", err.response?.data);

      setError(err.response?.data?.message || "Erreur lors de l’envoi");

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={3}
      borderRadius={2}
      boxShadow={2}
      maxWidth={400}
      mx="auto"
      mt={2}
    >
      <Typography variant="h6" mb={2}>
        Laisser un avis
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Avis envoyé avec succès 🎉
        </Alert>
      )}

      {/* ⭐ Rating */}
      <Box mb={2}>
        <Typography variant="body2" mb={1}>
          Note
        </Typography>

        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue || 0)}
        />
      </Box>

      {/* 💬 Commentaire */}
      <TextField
        label="Commentaire"
        multiline
        rows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* 🔘 Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={submitReview}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </Box>
  );
};

export default AddReview;
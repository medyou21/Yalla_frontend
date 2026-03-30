import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getUser } from "../../utils/auth";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Divider,
} from "@mui/material";

const TripReviews = ({ tripId }) => {
  const currentUser = getUser();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🔹 Charger les avis
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/reviews/trip/${tripId}`);
      setReviews(res.data);

    } catch (err) {
      console.error("Erreur fetch:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchReviews();
    }
  }, [tripId]);

  // 🔹 Ajouter un avis
  const handleSubmit = async () => {
    if (submitting) return;

    if (!currentUser?._id) {
      return alert("Utilisateur non connecté");
    }

    if (!rating) {
      return alert("Veuillez donner une note");
    }

    try {
      setSubmitting(true);

      await API.post("/reviews", {
        reviewerId: currentUser._id,
        reviewedUserId: currentUser._id, // ⚠️ à adapter selon ton besoin
        tripId,
        rating: Number(rating),
        comment,
      });

      setRating(0);
      setComment("");

      fetchReviews();

    } catch (err) {
      console.error("Erreur submit:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erreur lors de l'envoi");

    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography>Chargement des avis...</Typography>;

  return (
    <Box mt={2}>
      <Typography fontWeight={600} mb={1}>
        Avis
      </Typography>

      {reviews.length === 0 && (
        <Typography>Aucun avis pour l’instant.</Typography>
      )}

      {reviews.map((r) => (
        <Box key={r._id} mb={1}>
          <Typography fontWeight={500}>
            {r.reviewerId?.name || "Utilisateur"}
          </Typography>

          <Rating value={r.rating} readOnly size="small" />

          <Typography variant="body2">
            {r.comment}
          </Typography>

          <Divider sx={{ my: 1 }} />
        </Box>
      ))}

      {/* Formulaire */}
      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue || 0)}
        />

        <TextField
          label="Commentaire"
          multiline
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Envoi..." : "Ajouter un avis"}
        </Button>
      </Box>
    </Box>
  );
};

export default TripReviews;
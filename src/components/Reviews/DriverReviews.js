import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
  Box,
  Typography,
  Rating,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";

const DriverReviews = ({ driverId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/reviews/driver/${driverId}`);
      setReviews(res.data);

    } catch (err) {
      console.log("Erreur chargement avis :", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverId) {
      fetchReviews();
    }
  }, [driverId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Typography variant="h6" mb={2}>
        Avis passagers
      </Typography>

      {reviews.length === 0 && (
        <Typography>Aucun avis pour l’instant.</Typography>
      )}

      {reviews.map((r) => (
        <Card key={r._id} sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography fontWeight={600}>
              {r.reviewerId?.name || "Utilisateur"}
            </Typography>

            <Rating
              value={r.rating}
              readOnly
              size="small"
              sx={{ my: 1 }}
            />

            <Typography variant="body2">
              {r.comment || "Pas de commentaire"}
            </Typography>

            <Divider sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DriverReviews;
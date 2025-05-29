
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

interface Review {
  _id: string;
  movie: string;
  user: string;
  rating: number;
  comment: string;
  imdbID: string;
}

interface ReviewListProps {
  imdbID: string;
  refreshTrigger: boolean;
}

const ReviewList = ({ imdbID, refreshTrigger }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/reviews`);
        const filtered = response.data.filter((review: Review) => review.imdbID === imdbID);
        setReviews(filtered);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [imdbID, refreshTrigger]);

  return (
    <Box>
      {reviews.length === 0 ? (
        <Typography color="white">No reviews yet.</Typography>
      ) : (
        reviews.map((review) => (
          <Box
            key={review._id}
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#2a2a2a",
              borderRadius: 2,
              color: "white",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <Typography variant="subtitle2">
              {review.user} - ⭐ {review.rating}
            </Typography>
            <Typography variant="body2">{review.comment}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewList;

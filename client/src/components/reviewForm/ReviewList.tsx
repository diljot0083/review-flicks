import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  movie: string;
  user: User;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/me`,
          { withCredentials: true }
        );
        // use res.data.user.id instead of res.data._id
        if (res.data.success && res.data.user) {
          setCurrentUserId(res.data.user.id);
        } else {
          setCurrentUserId(null);
        }
      } catch {
        setCurrentUserId(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/reviews`,
          { withCredentials: true }
        );
        const filtered = response.data.filter(
          (review: Review) => review.imdbID === imdbID
        );
        setReviews(filtered);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [imdbID, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/reviews/${id}`,
        { withCredentials: true }
      );
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <Box>
      {reviews.length === 0 ? (
        <Typography color="white">No reviews yet.</Typography>
      ) : (
        reviews.map((review) => (
          <Box
            key={review._id}
            sx={{
              mt: 1,
              p: 2,
              backgroundColor: "#2a2a2a",
              borderRadius: 2,
              color: "white",
              maxWidth: 600,
              mx: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle2">
                {review.user?.name} - ⭐ {review.rating}
              </Typography>
              <Typography variant="body2">{review.comment}</Typography>
            </Box>

            {review.user && review.user._id === currentUserId && (
              <IconButton onClick={() => handleDelete(review._id)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewList;

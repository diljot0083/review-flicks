import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/me`,
          { withCredentials: true }
        );
        if (res.data.success && res.data.user) {
          setCurrentUserId(res.data.user._id);
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

  // DELETE
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

  // EDIT
  const startEditing = (review: Review) => {
    setEditingId(review._id);
    setEditText(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/reviews/${id}`,
        { comment: editText },
        { withCredentials: true }
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? response.data : r))
      );
      cancelEditing();
    } catch (err) {
      console.error("Error editing review:", err);
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
            <Box sx={{ flex: 1 }}>
              {editingId === review._id ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: 1, mb: 1 }}
                  />
                  <Button
                    onClick={() => saveEdit(review._id)}
                    startIcon={<SaveIcon />}
                    variant="contained"
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    startIcon={<CloseIcon />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="subtitle2">
                    {review.user?.name} - ⭐ {review.rating}
                  </Typography>
                  <Typography variant="body2">{review.comment}</Typography>
                </>
              )}
            </Box>

            {review.user && review.user._id === currentUserId && (
              <Box>
                {editingId === review._id ? null : (
                  <IconButton
                    onClick={() => startEditing(review)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => handleDelete(review._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewList;

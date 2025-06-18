import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const Review = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
      setLoading(false);
    };
    fetchMovieDetails();
  }, [id]);

  if (!id) return <Typography>No movie ID provided.</Typography>;
  if (loading) return <CircularProgress />;
  if (!movie || movie.Response === "False") return <Typography>Movie not found.</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#121212",
        color: "white",
      }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
        alt={movie.Title}
        style={{ width: "250px", borderRadius: "10px" }}
      />

      <Typography variant="h4" mt={2}>{movie.Title}</Typography>
      <Typography variant="subtitle1" color="gray">{movie.Genre} | {movie.Year}</Typography>
      <Typography mt={2} sx={{ maxWidth: 800, margin: "0 auto" }}>{movie.Plot}</Typography>

      <Box mt={4} width="100%">
        <ReviewForm
          imdbID={id}
          movieTitle={movie.Title}
          onReviewSubmit={() => setRefreshReviews(prev => !prev)}
        />
      </Box>

      <Box mt={4} width="100%">
        <Typography variant="h5" fontWeight="bold">User Reviews</Typography>
        <ReviewList imdbID={id} refreshTrigger={refreshReviews} />

      </Box>
    </Box>
  );
};

export default Review;

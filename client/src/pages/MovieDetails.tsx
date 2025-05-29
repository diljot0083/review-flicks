import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}&plot=full`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!movie || movie.Response === "False") {
    return (
      <Box textAlign="center" color="white" mt={5}>
        <Typography variant="h5">Movie not found.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} p={4} color="white">
      {/* Movie Poster */}
      <Box flex="1">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
          alt={movie.Title}
          style={{ width: "100%", maxWidth: "350px", borderRadius: "10px" }}
        />
      </Box>

      {/* Movie Info */}
      <Box flex="2">
        <Typography variant="h4" fontWeight="bold">{movie.Title}</Typography>
        <Typography variant="h6" color="gray">
          {movie.Genre} | {movie.Year} | {movie.Runtime}
        </Typography>
        <Typography variant="body1" mt={2}>{movie.Plot}</Typography>
        <Typography variant="h6" mt={2}>
          <strong>IMDb Rating:</strong> {movie.imdbRating !== "N/A" ? movie.imdbRating : "No Rating Available"}
        </Typography>

        {/* Write a Review Button */}
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/review/${id}`)}
          >
            Write a Review
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MovieDetails;

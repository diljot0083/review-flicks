import { useState, useEffect } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Pagination, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const GENRES = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance"];

const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [defaultMovies, setDefaultMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const MOVIES_PER_PAGE = 8;

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  const fetchDefaultMovies = async () => {
    const popularTitles = ["Avengers", "Inception", "Joker", "Frozen", "John Wick", "It", "Conjuring"];
    setLoading(true);
    try {
      const allFetchedMovies: any[] = [];

      for (const title of popularTitles) {
        const res = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`);
        const data = await res.json();

        if (data.Search) {
          const detailedMovies = await Promise.all(
            data.Search.map(async (movie: any) => {
              const detailsRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
              const details = await detailsRes.json();
              return { ...movie, Genre: details.Genre, Plot: details.Plot };
            })
          );
          allFetchedMovies.push(...detailedMovies);
        }
      }

      setMovies(allFetchedMovies);
      setDefaultMovies(allFetchedMovies);
    } catch (err) {
      console.error("Error fetching default movies", err);
    }
    setLoading(false);
  };


  const fetchMovies = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Search) {

        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: any) => {
            const detailsRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
            const details = await detailsRes.json();
            return { ...movie, Genre: details.Genre, Plot: details.Plot };
          })
        );

        setMovies(detailedMovies);
        if (query === "Batman") {
          setDefaultMovies(detailedMovies);
        }
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setMovies(defaultMovies);
    } else {
      fetchMovies(query);
    }
  };

  const handleGenreChange = (event: any) => {
    setSelectedGenre(event.target.value);
  };

  const handleMovieClick = (imdbID: string) => {
    navigate(`/review/${imdbID}`);
  };


  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === "All") return true;
    if (!movie.Genre) return false;

    const genresArray = movie.Genre.split(",").map((g: string) => g.trim().toLowerCase());
    return genresArray.includes(selectedGenre.toLowerCase());
  });



  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  const displayedMovies = filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  return (
    <div>
      <HeroSection />

      {/* Search & Filters Row */}
      <Box display="flex" justifyContent="center" gap={2} my={3} flexWrap="wrap">
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "40%", backgroundColor: "white", borderRadius: 1 }}
        />

        {/* Genre Filter */}
        <FormControl sx={{ minWidth: 150, backgroundColor: "white", borderRadius: 1 }}>
          <Select value={selectedGenre} onChange={handleGenreChange}>
            {GENRES.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Movie Cards Grid */}
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} minHeight="300px">
        {loading ? (
          <CircularProgress color="secondary" />
        ) : displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
              imageUrl={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/250"}
              plot={movie.Plot}
              onClick={() => handleMovieClick(movie.imdbID)}
            />
          ))
        ) : (
          <p style={{ color: "white", fontSize: "18px" }}>No movies found.</p>
        )}
      </Box>

      {filteredMovies.length > MOVIES_PER_PAGE && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredMovies.length / MOVIES_PER_PAGE)}
            page={page}
            onChange={(_event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
};

export default Home;

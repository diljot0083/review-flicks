import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import MovieCard from "../components/MovieCard";
import { Dropdown, Pagination } from "../components/ui";

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
              return { ...movie, Genre: details.Genre, Plot: details.Plot, imdbRating: details.imdbRating };
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
            return { ...movie, Genre: details.Genre, Plot: details.Plot, imdbRating: details.imdbRating };
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
    setPage(1);

    if (query.trim() === "") {
      setMovies(defaultMovies);
    } else {
      fetchMovies(query);
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
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
    <div className="bg-ink">
      <HeroSection />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Search & Filters Row */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <div className="relative w-full max-w-md">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ivory/30" />
            <input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold/50 focus:bg-white/[0.07]"
            />
          </div>
          <Dropdown value={selectedGenre} options={GENRES} onChange={handleGenreChange} />
        </div>

        {/* Movie Grid */}
        <div className="flex min-h-[300px] flex-wrap justify-center gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-[404px] w-[250px] shrink-0 rounded-2xl" />
            ))
          ) : displayedMovies.length > 0 ? (
            displayedMovies.map((movie, i) => (
              <div
                key={movie.imdbID}
                className="animate-[fade-up_0.6s_ease_forwards] opacity-0"
                style={{ animationDelay: `${(i % MOVIES_PER_PAGE) * 60}ms` }}
              >
                <MovieCard
                  imdbID={movie.imdbID}
                  title={movie.Title}
                  imageUrl={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/250x340/171420/f2ede4?text=No+Poster"}
                  plot={movie.Plot}
                  rating={movie.imdbRating}
                  onClick={() => handleMovieClick(movie.imdbID)}
                />
              </div>
            ))
          ) : (
            <p className="mt-10 text-center text-ivory/40">
              No movies found. Try a different title or clear your search.
            </p>
          )}
        </div>

        {filteredMovies.length > MOVIES_PER_PAGE && (
          <div className="mt-10">
            <Pagination
              page={page}
              count={Math.ceil(filteredMovies.length / MOVIES_PER_PAGE)}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
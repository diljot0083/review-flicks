import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import MovieCard from "../components/MovieCard";
import { Dropdown, Pagination } from "../components/ui";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const GENRES = ["All", "Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance"];
const TMDB_GENRE_NAMES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

interface TmdbListMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

function mapTmdbMovie(m: TmdbListMovie) {
  return {
    imdbID: String(m.id),
    Title: m.title,
    Plot: m.overview,
    Poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : "N/A",
    imdbRating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
    Genre: (m.genre_ids || []).map((id) => TMDB_GENRE_NAMES[id]).filter(Boolean).join(", "),
  };
}

const DEFAULT_MOVIES_CACHE_KEY = "reviewflicks_now_playing";

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
    const cached = sessionStorage.getItem(DEFAULT_MOVIES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      setMovies(parsed);
      setDefaultMovies(parsed);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`);
      const data = await res.json();
      const mapped = (data.results || []).map(mapTmdbMovie);

      setMovies(mapped);
      setDefaultMovies(mapped);
      sessionStorage.setItem(DEFAULT_MOVIES_CACHE_KEY, JSON.stringify(mapped));
    } catch (err) {
      console.error("Error fetching now playing movies", err);
    }
    setLoading(false);
  };

  const fetchMovies = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setMovies(data.results && data.results.length > 0 ? data.results.map(mapTmdbMovie) : []);
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

  const handleMovieClick = (id: string) => {
    navigate(`/review/${id}`);
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
                  id={movie.imdbID}
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
            <Pagination page={page} count={Math.ceil(filteredMovies.length / MOVIES_PER_PAGE)} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
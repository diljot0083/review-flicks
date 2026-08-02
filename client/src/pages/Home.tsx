import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaRedo } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import MovieCard from "../components/MovieCard";
import { Dropdown, Pagination, Button } from "../components/ui";
import { fetchWithTimeout } from "../lib/fetchWithTimeout";

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

const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 28, Drama: 18, Comedy: 35, Thriller: 53,
  Horror: 27, "Sci-Fi": 878, Romance: 10749,
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
  const [loadError, setLoadError] = useState(false);

  const navigate = useNavigate();
  const MOVIES_PER_PAGE = 8;

  const previousGenre = useRef(selectedGenre);

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  useEffect(() => {
    if (previousGenre.current === selectedGenre) return;
    previousGenre.current = selectedGenre;

    if (searchQuery.trim() !== "") return;
    setPage(1);
    if (selectedGenre === "All") {
      setMovies(defaultMovies);
    } else {
      fetchByGenre(selectedGenre);
    }
  }, [selectedGenre]);

  const fetchDefaultMovies = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      let cachedMovies: any[] | null = null;
      try {
        const cached = sessionStorage.getItem(DEFAULT_MOVIES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedMovies = parsed;
          }
        }
      } catch {
        cachedMovies = null;
      }

      if (cachedMovies) {
        setMovies(cachedMovies);
        setDefaultMovies(cachedMovies);
        setLoading(false);
        return;
      }

      const res = await fetchWithTimeout(`${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`);
      const data = await res.json();

      if (!res.ok) {
        console.error("TMDB now_playing error:", data);
        setLoadError(true);
        setMovies([]);
        setDefaultMovies([]);
        setLoading(false);
        return;
      }

      const mapped = (data.results || []).map(mapTmdbMovie);

      setMovies(mapped);
      setDefaultMovies(mapped);

      try {
        sessionStorage.setItem(DEFAULT_MOVIES_CACHE_KEY, JSON.stringify(mapped));
      } catch {
        // intentionally empty
      }
    } catch (err) {
      console.error("Error fetching now playing movies", err);
      setLoadError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetchWithTimeout(
        `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error("TMDB search error");
      setMovies(data.results && data.results.length > 0 ? data.results.map(mapTmdbMovie) : []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoadError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByGenre = async (genre: string) => {
    const genreId = GENRE_NAME_TO_ID[genre];
    if (!genreId) return;

    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetchWithTimeout(
        `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
      );
      const data = await res.json();
      if (!res.ok) throw new Error("TMDB discover error");
      setMovies((data.results || []).map(mapTmdbMovie));
    } catch (err) {
      console.error("Error fetching movies by genre", err);
      setLoadError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const retryCurrentView = () => {
    if (searchQuery.trim() !== "") {
      fetchMovies(searchQuery);
    } else if (selectedGenre !== "All") {
      fetchByGenre(selectedGenre);
    } else {
      sessionStorage.removeItem(DEFAULT_MOVIES_CACHE_KEY);
      fetchDefaultMovies();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);

    if (query.trim() === "") {
      if (selectedGenre === "All") {
        setMovies(defaultMovies);
      } else {
        fetchByGenre(selectedGenre);
      }
    } else {
      fetchMovies(query);
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleMovieClick = (id: string) => {
    navigate(`/review/${id}`);
  };

  const filteredMovies = movies;

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
          ) : loadError ? (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-ivory/50">
                Couldn't reach the movie database - this is usually a network hiccup, not a bug.
              </p>
              <Button variant="secondary" size="sm" onClick={retryCurrentView}>
                <FaRedo className="text-xs" /> Try again
              </Button>
            </div>
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
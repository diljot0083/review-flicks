import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { Button, Spinner } from "../components/ui";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        setMovie(data && data.id ? data : null);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-ink">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 bg-ink text-center">
        <p className="font-display text-2xl text-ivory">Movie not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to browse
        </Button>
      </div>
    );
  }

  const genres: string[] = movie.genres ? movie.genres.map((g: { name: string }) => g.name) : [];
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <div className="min-h-screen bg-ink px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-ivory/50 transition-colors hover:text-gold"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="mx-auto shrink-0 md:mx-0">
            <img
              src={movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : "https://via.placeholder.com/300x445/171420/f2ede4?text=No+Poster"}
              alt={movie.title}
              className="w-full max-w-[300px] rounded-2xl border border-white/5 shadow-2xl shadow-black/50"
            />
          </div>

          <div className="flex-1">
            {genres.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span key={g} className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-3xl font-bold text-ivory sm:text-4xl">{movie.title}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ivory/45">
              <span>{year}</span>
              {movie.runtime ? (
                <>
                  <span className="text-ivory/20">•</span>
                  <span>{movie.runtime} min</span>
                </>
              ) : null}
            </div>

            {movie.vote_average > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2">
                <FaStar className="text-gold" />
                <span className="text-lg font-semibold text-ivory">{movie.vote_average.toFixed(1)}</span>
                <span className="text-xs text-ivory/40">/ 10 on TMDB</span>
              </div>
            )}

            <p className="mt-6 max-w-2xl leading-relaxed text-ivory/65">{movie.overview}</p>

            <div className="mt-8">
              <Button onClick={() => navigate(`/review/${id}`)}>Write a Review</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
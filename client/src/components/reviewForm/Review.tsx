import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Spinner } from "../ui";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

interface TmdbMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  genres: { id: number; name: string }[];
  external_ids?: { imdb_id: string | null };
}

const Review = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
        );
        const data = await res.json();
        setMovie(data && data.id ? data : null);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
      setLoading(false);
    };
    fetchMovieDetails();
  }, [id]);

  if (!id) return <p className="p-8 text-center text-ivory/60">No movie ID provided.</p>;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-ink">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!movie) {
    return <p className="p-8 text-center text-ivory/60">Movie not found.</p>;
  }

  const imdbId = movie.external_ids?.imdb_id || null;
  const genreText = movie.genres?.map((g) => g.name).join(", ");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <div className="min-h-screen bg-ink px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-ivory/50 transition-colors hover:text-gold"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : "https://via.placeholder.com/220x325/171420/f2ede4?text=No+Poster"}
            alt={movie.title}
            className="w-[180px] rounded-2xl border border-white/5 shadow-2xl shadow-black/50"
          />
          <h1 className="font-display mt-5 text-3xl font-bold text-ivory">{movie.title}</h1>
          <p className="mt-1 text-sm text-ivory/45">{genreText} • {year}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/60">{movie.overview}</p>
        </div>

        <div className="perforation my-10" />

        {imdbId ? (
          <>
            <section>
              <h2 className="font-display mb-4 text-xl font-semibold text-ivory">Share Your Thoughts</h2>
              <ReviewForm imdbID={imdbId} movieTitle={movie.title} onReviewSubmit={() => setRefreshReviews((prev) => !prev)} />
            </section>

            <section className="mt-12">
              <h2 className="font-display mb-4 text-xl font-semibold text-ivory">What Others Are Saying</h2>
              <ReviewList imdbID={imdbId} refreshTrigger={refreshReviews} />
            </section>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-ivory/35">
            Reviews aren't available for this title yet — TMDB hasn't linked it to an IMDb entry.
          </p>
        )}
      </div>
    </div>
  );
};

export default Review;
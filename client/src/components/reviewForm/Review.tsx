import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Spinner } from "../ui";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const Review = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (!id) return <p className="p-8 text-center text-ivory/60">No movie ID provided.</p>;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-ink">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!movie || movie.Response === "False") {
    return <p className="p-8 text-center text-ivory/60">Movie not found.</p>;
  }

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
            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/220x325/171420/f2ede4?text=No+Poster"}
            alt={movie.Title}
            className="w-[180px] rounded-2xl border border-white/5 shadow-2xl shadow-black/50"
          />
          <h1 className="font-display mt-5 text-3xl font-bold text-ivory">{movie.Title}</h1>
          <p className="mt-1 text-sm text-ivory/45">
            {movie.Genre} • {movie.Year}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/60">{movie.Plot}</p>
        </div>

        <div className="perforation my-10" />

        <section>
          <h2 className="font-display mb-4 text-xl font-semibold text-ivory">Share Your Thoughts</h2>
          <ReviewForm
            imdbID={id}
            movieTitle={movie.Title}
            onReviewSubmit={() => setRefreshReviews((prev) => !prev)}
          />
        </section>

        <section className="mt-12">
          <h2 className="font-display mb-4 text-xl font-semibold text-ivory">What Others Are Saying</h2>
          <ReviewList imdbID={id} refreshTrigger={refreshReviews} />
        </section>
      </div>
    </div>
  );
};

export default Review;
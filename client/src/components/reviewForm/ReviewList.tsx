import { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { StarRating, TextArea, Button } from "../ui";

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

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/me`, { withCredentials: true });
        if (res.data.success && res.data.user) setCurrentUserId(res.data.user._id);
        else setCurrentUserId(null);
      } catch {
        setCurrentUserId(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/reviews`, {
          withCredentials: true,
        });
        const filtered = response.data.filter((review: Review) => review.imdbID === imdbID);
        setReviews(filtered);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [imdbID, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/reviews/${id}`, { withCredentials: true });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setDeletingId(null);
    }
  };

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
      setReviews((prev) => prev.map((r) => (r._id === id ? response.data : r)));
      cancelEditing();
    } catch (err) {
      console.error("Error editing review:", err);
    }
  };

  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-ivory/35">
        No reviews yet — be the first to share what you thought.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="relative flex overflow-hidden rounded-2xl border border-white/5 bg-velvet"
        >
          {/* Ticket stub: rating + initial, torn from the comment by a perforated edge */}
          <div className="relative flex w-20 shrink-0 flex-col items-center justify-center gap-2 border-r border-dashed border-white/15 px-2 py-5 sm:w-24">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold font-display text-sm font-bold text-ink">
              {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <StarRating value={review.rating} readOnly size="sm" />
            {/* notch circles selling the "torn ticket" look */}
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-ink" />
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-ink" />
          </div>

          <div className="flex-1 p-5">
            {editingId === review._id ? (
              <>
                <TextArea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(review._id)}>
                    <FaCheck className="text-xs" /> Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={cancelEditing}>
                    <FaTimes className="text-xs" /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display font-semibold text-ivory">{review.user?.name}</p>

                  {review.user && review.user._id === currentUserId && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => startEditing(review)}
                        className="rounded-full p-2 text-ivory/40 transition-colors hover:bg-white/5 hover:text-gold"
                        aria-label="Edit review"
                      >
                        <FaPen className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={deletingId === review._id}
                        className="rounded-full p-2 text-ivory/40 transition-colors hover:bg-white/5 hover:text-rose disabled:opacity-40"
                        aria-label="Delete review"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/60">{review.comment}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
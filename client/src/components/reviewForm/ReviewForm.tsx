import { useState } from "react";
import axios from "axios";
import { StarRating, TextArea, Button } from "../ui";

interface ReviewFormProps {
  imdbID: string;
  movieTitle: string;
  onReviewSubmit: () => void;
}

const ReviewForm = ({ imdbID, movieTitle, onReviewSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/reviews`,
        { imdbID, movie: movieTitle, rating, comment },
        { withCredentials: true }
      );

      setRating(null);
      setComment("");
      onReviewSubmit();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-7">
      <div className="mb-4">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ivory/45">
          Your Rating
        </span>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <TextArea
        placeholder="What did you think?"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />

      <Button type="submit" disabled={!rating || comment.trim() === "" || loading} className="mt-4 w-full">
        {loading ? "Posting..." : "Post Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  plot?: string;
  rating?: string;
  onClick: () => void;
}

const MovieCard = ({ title, imageUrl, plot, rating, onClick }: MovieCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="group w-[250px] shrink-0 cursor-pointer rounded-2xl border border-white/5 bg-velvet transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:border-gold/20 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="relative h-[340px] overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet via-velvet/10 to-transparent" />
        {rating && rating !== "N/A" && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-gold/20 bg-ink/80 px-2.5 py-1 text-xs font-semibold text-gold backdrop-blur">
            <FaStar className="text-[10px]" /> {rating}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display truncate text-lg font-semibold text-ivory">{title}</h3>
        {plot && <p className="mt-1 text-xs leading-relaxed text-ivory/45 line-clamp-2">{plot}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
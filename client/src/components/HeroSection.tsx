import { FaFilm } from "react-icons/fa";

const GENRE_TICKER = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Fantasy",
  "Mystery",
];

const BULB_COUNT = 28;

function BulbRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex justify-between px-2">
      {Array.from({ length: BULB_COUNT }).map((_, i) => (
        <span
          key={i}
          className="h-[5px] w-[5px] shrink-0 rounded-full bg-gold bulb-glow animate-bulb will-change-[opacity,transform]"
          style={{ animationDelay: `${(reverse ? BULB_COUNT - i : i) * 0.08}s` }}
        />
      ))}
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="grain relative overflow-hidden bg-ink px-4 pb-10 pt-8 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-sway absolute -top-24 -left-16 h-[520px] w-[420px] will-change-transform"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 0%, transparent, rgba(212,162,78,0.30), transparent 45%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="animate-sway-reverse absolute -top-24 -right-16 h-[520px] w-[420px] will-change-transform"
          style={{
            background:
              "conic-gradient(from 160deg at 50% 0%, transparent, rgba(179,73,95,0.28), transparent 45%)",
            filter: "blur(50px)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0b0a0f_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <BulbRow />
        <div className="glass rounded-2xl border-t-0 px-6 py-14 sm:px-12">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
            <FaFilm className="text-[10px]" /> Now Screening
          </span>
          <h1 className="font-display mx-auto max-w-2xl text-4xl font-bold leading-[1.15] text-ivory sm:text-5xl md:text-6xl">
            See It. <span className="text-gradient-gold">Rate It.</span> Review It.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-ivory/55 sm:text-base">
            Search any title, drop your honest rating, and see what the rest of the audience thought.
          </p>
        </div>
        <BulbRow reverse />
      </div>

      <div className="perforation relative z-10 mt-8" />
      <div className="relative z-10 overflow-hidden py-4">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap text-xs font-medium uppercase tracking-[0.3em] text-ivory/30 will-change-transform">
          {[...GENRE_TICKER, ...GENRE_TICKER].map((genre, i) => (
            <span key={i} className="flex items-center gap-10">
              {genre} <span className="text-gold/50">✦</span>
            </span>
          ))}
        </div>
      </div>
      <div className="perforation relative z-10" />
    </section>
  );
};

export default HeroSection;
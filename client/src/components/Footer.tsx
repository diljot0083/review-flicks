import { FaFilm } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-ink-light px-4 py-8 text-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-ivory/70">
          <FaFilm className="text-gold" />
          <span className="font-display text-sm">Movie Review</span>
        </div>
        <p className="text-xs text-ivory/35">© {new Date().getFullYear()} ReviewFlicks - every film deserves an honest take.</p>
      </div>
    </footer>
  );
};

export default Footer;
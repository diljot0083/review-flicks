import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFilm, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

interface NavBarProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ setIsLoggedIn }: NavBarProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ picture?: string; _id: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.user) setUser(res.data.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        to="/about"
        onClick={onClick}
        className="relative text-sm text-ivory/70 transition-colors hover:text-ivory after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
      >
        About Us
      </Link>
      <Link
        to="/contact"
        onClick={onClick}
        className="relative text-sm text-ivory/70 transition-colors hover:text-ivory after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
      >
        Contact Us
      </Link>
    </>
  );

  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
        >
          <FaFilm className="text-lg text-gold" />
          <span className="font-display text-lg font-semibold text-ivory">Movie Review</span>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          <NavLinks />
          {user && (
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="block">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-white/15 object-cover"
                />
              </button>
              {menuOpen && (
                <div className="glass absolute right-0 mt-2 w-36 overflow-hidden rounded-xl py-1 shadow-2xl shadow-black/40">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-ivory/80 transition-colors hover:bg-white/5 hover:text-rose"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          className="text-ivory sm:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-4 border-t border-white/5 px-4 py-4 sm:hidden">
          <NavLinks onClick={() => setMobileOpen(false)} />
          {user && (
            <button
              onClick={handleLogout}
              className="text-left text-sm text-rose"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;
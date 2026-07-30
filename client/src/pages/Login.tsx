import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFilm, FaExclamationCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button, Input } from "../components/ui";

interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                setIsLoggedIn(true);
                navigate("/");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="animate-sway absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2"
                    style={{
                        background: "conic-gradient(from 180deg at 50% 0%, transparent, rgba(212,162,78,0.22), transparent 50%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0b0a0f_100%)]" />

            <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-gold text-ink">
                        <FaFilm className="text-lg" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-ivory">Welcome back</h2>
                    <p className="mt-1 text-sm text-ivory/45">Log in to continue reviewing</p>
                </div>

                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <p className="mt-5 text-center text-sm text-ivory/45">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-gold hover:underline">
                        Register here
                    </Link>
                </p>

                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ivory/25">
                    <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-ivory py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
                >
                    <FcGoogle className="text-lg" /> Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
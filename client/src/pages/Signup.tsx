import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFilm, FaExclamationCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button, Input } from "../components/ui";

interface SignupProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ setIsLoggedIn }) => {
    const [name, setName] = useState("");
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
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setIsLoggedIn(true);
                navigate("/");
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.assign(`${import.meta.env.VITE_SERVER_URL}/auth/google`);
    };

    return (
        <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="animate-sway-reverse absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2"
                    style={{
                        background: "conic-gradient(from 180deg at 50% 0%, transparent, rgba(179,73,95,0.22), transparent 50%)",
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
                    <h2 className="font-display text-2xl font-bold text-ivory">Create your account</h2>
                    <p className="mt-1 text-sm text-ivory/45">Join in and start rating what you watch</p>
                </div>

                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ivory/25">
                    <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-ivory py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
                >
                    <FcGoogle className="text-lg" /> Sign up with Google
                </button>

                <p className="mt-6 text-center text-sm text-ivory/45">
                    Already have an account?{" "}
                    <Link to="/login" className="text-gold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
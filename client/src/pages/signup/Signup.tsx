import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

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

        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include"
        });

        const data = await res.json();

        if (res.ok) {
            setIsLoggedIn(true);
            navigate("/");
        } else {
            setError(data.message || "Signup failed");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Account</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <div className="divider">or</div>

                <button onClick={handleGoogleLogin} className="google-btn">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                    />
                    Sign up with Google
                </button>

                <div className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;

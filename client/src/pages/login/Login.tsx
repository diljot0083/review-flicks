import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"

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

        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });

        const data = await res.json();
        if (res.ok) {
            setIsLoggedIn(true); 
            navigate("/");
        } else {
            setError(data.message || "Login failed");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="signup-link">
                    Don’t have an account? <Link to="/signup">Register here</Link>
                </p>

                <div className="divider">or</div>

                <button onClick={handleGoogleLogin} className="google-btn">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;

// src/pages/Register.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            // Firebase auto signs the user in after creation

            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/todos");
        } catch (err) {
            const authErr = err as AuthError;
            switch (authErr.code) {
                case "auth/email-already-in-use":
                    setError("An account with this email already exists.");
                    break;
                case "auth/invalid-email":
                    setError("Please enter a valid email address.");
                    break;
                case "auth/weak-password":
                    setError("Password must be at least 6 characters.");
                    break;
                default:
                    setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center">
            <div className="card">
                <h1>Create account</h1>
                <p className="subtitle">Start organising your life.</p>

                {error && <div className="msg-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="confirm">Confirm password</label>
                        <input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: "0.5rem" }}
                    >
                        {loading ? "Creating account…" : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?&nbsp;
                    <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

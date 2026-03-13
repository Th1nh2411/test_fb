// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate }        from "react-router-dom";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error,    setError]    = useState<string>("");
  const [loading,  setLoading]  = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todos");
    } catch (err) {
      const authErr = err as AuthError;
      switch (authErr.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
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
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to manage your todos.</p>

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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?&nbsp;
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

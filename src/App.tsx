// src/App.tsx
import { useState, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, type User }          from "firebase/auth";
import { auth } from "./firebase";

import Login    from "./pages/Login";
import Register from "./pages/Register";
import TodoPage from "./pages/TodoPage";

// ─────────────────────────────────────────────────────────────
// Auth state:
//   undefined → not yet resolved (show spinner)
//   null      → no user logged in
//   User      → authenticated Firebase user
// ─────────────────────────────────────────────────────────────
type AuthState = User | null | undefined;

interface RouteGuardProps {
  user: AuthState;
  children: ReactNode;
}

/** Redirects unauthenticated users to /login */
function ProtectedRoute({ user, children }: RouteGuardProps) {
  if (user === undefined) return <Spinner />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

/** Redirects already-authenticated users away from auth pages */
function PublicRoute({ user, children }: RouteGuardProps) {
  if (user === undefined) return <Spinner />;
  return user ? <Navigate to="/todos" replace /> : <>{children}</>;
}

function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthState>(undefined);

  useEffect(() => {
    // Subscribe to Firebase auth changes; unsubscribe on unmount
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/todos" : "/login"} replace />} />

        <Route
          path="/login"
          element={<PublicRoute user={user}><Login /></PublicRoute>}
        />
        <Route
          path="/register"
          element={<PublicRoute user={user}><Register /></PublicRoute>}
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute user={user}>
              {/* user is guaranteed to be User here, not null/undefined */}
              <TodoPage user={user as User} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/pages/TodoPage.tsx
import { useState, useEffect, useCallback } from "react";
import { signOut, type User } from "firebase/auth";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { type Todo, type Filter } from "../types";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

interface TodoPageProps {
    user: User;
}

// ── Helper: read / persist theme ────────────────────────────
function getInitialTheme(): "dark" | "light" {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export default function TodoPage({ user }: TodoPageProps) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<Filter>("all");
    const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

    // ── Apply theme to <html> element ───────────────────────────
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((t) => (t === "dark" ? "light" : "dark"));

    // ── Real-time Firestore listener ────────────────────────────
    useEffect(() => {
        const q = query(
            collection(db, "todos"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Todo[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Todo, "id">),
            }));
            setTodos(items);
            setLoading(false);
        });
        return unsubscribe;
    }, [user.uid]);

    // ── CRUD ────────────────────────────────────────────────────
    const addTodo = useCallback(
        async (title: string): Promise<void> => {
            await addDoc(collection(db, "todos"), {
                title,
                completed: false,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        },
        [user.uid]
    );

    const updateTitle = async (id: string, title: string): Promise<void> => {
        await updateDoc(doc(db, "todos", id), { title });
    };

    const toggleCompleted = async (
        id: string,
        current: boolean
    ): Promise<void> => {
        await updateDoc(doc(db, "todos", id), { completed: !current });
    };

    const deleteTodo = async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "todos", id));
    };

    // ── Filter ──────────────────────────────────────────────────
    const visible: Todo[] = todos.filter((t) => {
        if (filter === "active") return !t.completed;
        if (filter === "done") return t.completed;
        return true;
    });

    const doneCount = todos.filter((t) => t.completed).length;
    const activeCount = todos.filter((t) => !t.completed).length;
    const filters: Filter[] = ["all", "active", "done"];

    return (
        <div className="todo-page">
            {/* ── Header ── */}
            <div className="todo-header">
                <div>
                    <h1>My Todos</h1>
                    <p className="user-email">{user.email}</p>
                </div>
                <div className="header-actions">
                    {/* Dark / light toggle */}
                    <button
                        className="btn-theme"
                        onClick={toggleTheme}
                        title={
                            theme === "dark"
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => signOut(auth)}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* ── Add todo ── */}
            <TodoForm onAdd={addTodo} />

            {/* ── Filters ── */}
            <div className="filters">
                {filters.map((f) => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? "active" : ""}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* ── List ── */}
            {loading ? (
                <div className="spinner-wrap" style={{ height: "200px" }}>
                    <div className="spinner" />
                </div>
            ) : (
                <TodoList
                    todos={visible}
                    onToggle={toggleCompleted}
                    onUpdateTitle={updateTitle}
                    onDelete={deleteTodo}
                />
            )}

            {/* ── Stats ── */}
            {!loading && todos.length > 0 && (
                <div className="stats">
                    <span>
                        {activeCount} task{activeCount !== 1 ? "s" : ""}{" "}
                        remaining
                    </span>
                    <span>{doneCount} completed</span>
                </div>
            )}
        </div>
    );
}

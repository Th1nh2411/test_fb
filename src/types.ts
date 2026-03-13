// src/types.ts
// ─────────────────────────────────────────────────────────────
// Shared TypeScript interfaces used across the app
// ─────────────────────────────────────────────────────────────
import { Timestamp } from "firebase/firestore";

/** Shape of a todo document stored in Firestore */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp | null; // null briefly before serverTimestamp resolves
}

/** Payload when creating a new todo (id assigned by Firestore) */
export type NewTodo = Omit<Todo, "id">;

/** Filter options for the todo list */
export type Filter = "all" | "active" | "done";

// src/components/TodoItem.tsx
import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { type Todo } from "../types";

interface TodoItemProps {
  todo:           Todo;
  onToggle:       (id: string, current: boolean) => Promise<void>;
  onUpdateTitle:  (id: string, title: string)    => Promise<void>;
  onDelete:       (id: string)                   => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdateTitle,
  onDelete,
}: TodoItemProps) {
  const [editing,  setEditing]  = useState<boolean>(false);
  const [editVal,  setEditVal]  = useState<string>(todo.title);
  const [deleting, setDeleting] = useState<boolean>(false);

  // ── Save inline edit ────────────────────────────────────────
  const saveEdit = async (): Promise<void> => {
    const trimmed = editVal.trim();
    if (trimmed && trimmed !== todo.title) {
      await onUpdateTitle(todo.id, trimmed);
    } else {
      setEditVal(todo.title); // revert if empty or unchanged
    }
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter")  void saveEdit();
    if (e.key === "Escape") { setEditVal(todo.title); setEditing(false); }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditVal(e.target.value);
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (): Promise<void> => {
    setDeleting(true);
    await onDelete(todo.id);
    // component unmounts after deletion
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        className="todo-check"
        checked={todo.completed}
        onChange={() => void onToggle(todo.id, todo.completed)}
        aria-label="Toggle completed"
      />

      {/* Title / inline edit */}
      {editing ? (
        <input
          className="todo-edit-input"
          type="text"
          value={editVal}
          onChange={handleEditChange}
          onBlur={() => void saveEdit()}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={`todo-title ${todo.completed ? "done" : ""}`}
          onDoubleClick={() => { if (!todo.completed) setEditing(true); }}
          title={todo.completed ? "" : "Double-click to edit"}
        >
          {todo.title}
        </span>
      )}

      {/* Actions */}
      <div className="todo-actions">
        {!todo.completed && !editing && (
          <button
            className="btn-icon"
            onClick={() => setEditing(true)}
            title="Edit"
            aria-label="Edit todo"
          >
            ✎
          </button>
        )}
        <button
          className="btn-icon delete"
          onClick={() => void handleDelete()}
          disabled={deleting}
          title="Delete"
          aria-label="Delete todo"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

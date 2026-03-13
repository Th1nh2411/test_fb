// src/components/TodoForm.tsx
import { useState, type FormEvent } from "react";

interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title,   setTitle]   = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setLoading(true);
    await onAdd(trimmed);
    setTitle("");
    setLoading(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={loading}
        autoFocus
      />
      <button
        type="submit"
        className="btn-add"
        disabled={loading || !title.trim()}
        title="Add todo"
        aria-label="Add todo"
      >
        +
      </button>
    </form>
  );
}

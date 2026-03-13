// src/components/TodoList.tsx
import { type Todo } from "../types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos:          Todo[];
  onToggle:       (id: string, current: boolean) => Promise<void>;
  onUpdateTitle:  (id: string, title: string)    => Promise<void>;
  onDelete:       (id: string)                   => Promise<void>;
}

export default function TodoList({
  todos,
  onToggle,
  onUpdateTitle,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span>✓</span>
        Nothing here — add a todo above!
      </div>
    );
  }

  return (
    <ul className="todo-list" style={{ listStyle: "none" }}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onUpdateTitle={onUpdateTitle}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

import { useState, useOptimistic } from 'react';
import { todoAPI } from '../shared/api/todoAPI';
import type { Todo } from '../shared/types';

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn React 19 hooks', completed: true },
  { id: 2, text: 'Build awesome features', completed: false },
];

export default function OptimisticTodos() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  );

  const [newTodoText, setNewTodoText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };

    addOptimisticTodo(newTodo);
    setNewTodoText('');
    setError(null);

    try {
      const savedTodo = await todoAPI.add(newTodo.text);
      setTodos([...todos, savedTodo]);
    } catch (err) {
      setError('Failed to add todo. It will disappear shortly.');
    }
  };

  const handleDelete = async (id: number) => {
    const originalTodos = todos;
    setTodos(todos.filter((t) => t.id !== id));

    try {
      await todoAPI.delete(id);
    } catch (err) {
      setTodos(originalTodos);
      setError('Failed to delete todo');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Optimistic Todo List</h3>
        <p className="text-muted mb-0">
          New todos appear instantly (with a pending indicator) while saving to the server.
        </p>
      </div>
      <div className="card-body">
        <form onSubmit={handleAddTodo} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new todo..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        <ul className="list-group">
          {optimisticTodos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ opacity: todo.pending ? 0.6 : 1 }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}}
                  className="form-check-input me-2"
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
                {todo.pending && (
                  <span className="badge bg-warning ms-2">
                    <span className="spinner-border spinner-border-sm me-1" />
                    Saving...
                  </span>
                )}
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(todo.id)}
                disabled={todo.pending}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

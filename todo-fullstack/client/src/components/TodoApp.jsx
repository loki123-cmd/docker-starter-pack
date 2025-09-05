import { useEffect, useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/todos`)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputValue })
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-app">
      <div className="todo-container">
        <div className="todo-header">
          <h1>Todo App</h1>
          <p className="todo-stats">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        <div className="todo-input-section">
          <div>
            <form onSubmit={addTodo} className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new task..."
                className="todo-input"
              />
              <button type="submit" className="add-button">
                <Plus size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="todo-list">
          {loading ? (
            <div className="loading-state">
              <p>Loading...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="check-button"
                >
                  <Check size={16} />
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
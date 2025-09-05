import { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
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
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="todo-input"
            />
            <button onClick={addTodo} className="add-button">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
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
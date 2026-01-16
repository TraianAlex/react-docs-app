# Event Handling

React uses synthetic events (cross-browser wrapper around native events).

## Basic Click Event

```jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Inline Handler

```jsx
function InlineButton() {
  return (
    <button onClick={() => console.log('Clicked')}>
      Click me
    </button>
  );
}
```

## Event with Parameters

```jsx
function ItemList() {
  const handleDelete = (id) => {
    console.log('Deleting item:', id);
  };

  return (
    <div>
      <button onClick={() => handleDelete(1)}>Delete Item 1</button>
      <button onClick={() => handleDelete(2)}>Delete Item 2</button>
    </div>
  );
}
```

## Event Object

```jsx
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted');
  };

  const handleClick = (event) => {
    console.log('Button text:', event.target.textContent);
    console.log('Click coordinates:', event.clientX, event.clientY);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" onClick={handleClick}>Submit</button>
    </form>
  );
}
```

## Input Change Events

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
```

## Multiple Inputs

```jsx
function MultiInputForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <input name="username" value={formData.username} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="age" value={formData.age} onChange={handleChange} />
    </form>
  );
}
```

## Keyboard Events

```jsx
function KeyboardHandler() {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (event.key === 'Escape') {
      console.log('Escape pressed');
    }
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      console.log('Ctrl+S pressed');
    }
  };

  return (
    <input
      type="text"
      onKeyDown={handleKeyDown}
      placeholder="Press Enter or Escape"
    />
  );
}
```

## Mouse Events

```jsx
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered');
  };

  const handleMouseLeave = () => {
    console.log('Mouse left');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: '200px', border: '1px solid black' }}
    >
      Mouse position: {position.x}, {position.y}
    </div>
  );
}
```

## Focus Events

```jsx
function FocusInput() {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type="text"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ borderColor: focused ? 'blue' : 'gray' }}
      placeholder="Click to focus"
    />
  );
}
```

## Preventing Default Behavior

```jsx
function Link() {
  const handleClick = (event) => {
    event.preventDefault();
    console.log('Link clicked, but navigation prevented');
    // Custom navigation logic
  };

  return (
    <a href="https://example.com" onClick={handleClick}>
      Click me
    </a>
  );
}
```

## Stopping Propagation

```jsx
function NestedButtons() {
  const handleParentClick = () => {
    console.log('Parent clicked');
  };

  const handleChildClick = (event) => {
    event.stopPropagation(); // Don't trigger parent click
    console.log('Child clicked');
  };

  return (
    <div onClick={handleParentClick} style={{ padding: '20px', background: 'lightgray' }}>
      Parent
      <button onClick={handleChildClick}>Child (won't trigger parent)</button>
    </div>
  );
}
```

## Debounced Input

```jsx
function DebouncedSearch() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (debouncedValue) {
      console.log('Searching for:', debouncedValue);
      // Perform search
    }
  }, [debouncedValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

## File Upload

```jsx
function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // Upload formData
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected: {file.name}</p>}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

## Drag and Drop

```jsx
function DragDrop() {
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: dragging ? '2px dashed blue' : '2px dashed gray',
        padding: '40px',
        textAlign: 'center'
      }}
    >
      Drop files here
    </div>
  );
}
```

## Passing Callbacks to Children

```jsx
function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false }
  ]);

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use arrow functions for handlers** to avoid binding issues
2. **Name handlers with `handle` prefix** (handleClick, handleSubmit)
3. **Pass callbacks, not state setters** to child components
4. **Prevent default when needed** (forms, links)
5. **Stop propagation carefully** (usually not needed)
6. **Debounce expensive operations** (search, API calls)
7. **Extract complex handlers** into separate functions

## Common Patterns

### Event Handler Factory
```jsx
function ButtonList() {
  const createClickHandler = (id) => () => {
    console.log('Button', id, 'clicked');
  };

  return (
    <div>
      <button onClick={createClickHandler(1)}>Button 1</button>
      <button onClick={createClickHandler(2)}>Button 2</button>
    </div>
  );
}
```

## Avoid

- Creating new function on every render (use useCallback for optimization if needed)
- Calling event handlers directly in JSX: `onClick={handleClick()}` ❌
- Forgetting `event.preventDefault()` for forms
- Using inline arrow functions in lists (causes re-renders)

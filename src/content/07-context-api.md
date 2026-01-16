# Context API

Share data across components without prop drilling.

## Basic Context

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Create context
const ThemeContext = createContext();

// 2. Create provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 4. Use in components
function ThemedButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      style={{ background: theme === 'light' ? '#fff' : '#333' }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
}

// 5. Wrap app with provider
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

## Authentication Context

```jsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage
function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Shopping Cart Context

```jsx
const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Usage
function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

function CartIcon() {
  const { itemCount } = useCart();

  return (
    <div className="cart-icon">
      🛒 <span>{itemCount}</span>
    </div>
  );
}
```

## Multiple Contexts

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Layout>
            <Routes />
          </Layout>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Consuming multiple contexts
function Checkout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { items, total } = useCart();

  return (
    <div className={theme}>
      <h1>Checkout for {user.name}</h1>
      <p>Total: ${total}</p>
    </div>
  );
}
```

## Context with Reducer

```jsx
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const addTodo = (text) => dispatch({ type: 'ADD_TODO', payload: text });
  const toggleTodo = (id) => dispatch({ type: 'TOGGLE_TODO', payload: id });
  const deleteTodo = (id) => dispatch({ type: 'DELETE_TODO', payload: id });

  const value = { todos, addTodo, toggleTodo, deleteTodo };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
```

## Context with Local Storage

```jsx
function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      notifications: true,
      language: 'en',
      fontSize: 'medium'
    };
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = { settings, updateSetting };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
```

## Lazy Context (Only for Consumers)

```jsx
// Split provider and consumer to avoid unnecessary re-renders
const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoStateContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) throw new Error('useTodoState must be used within TodoProvider');
  return context;
}

function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) throw new Error('useTodoDispatch must be used within TodoProvider');
  return context;
}

// Component only re-renders when todos change, not when dispatch is called
function TodoList() {
  const todos = useTodoState();
  const dispatch = useTodoDispatch();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

## Protected Route Pattern

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Usage
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

## Notification Context

```jsx
const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = { notifications, addNotification, removeNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
}

function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

// Usage
function SaveButton() {
  const { addNotification } = useNotification();

  const handleSave = () => {
    // Save logic
    addNotification('Saved successfully!', 'success');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Best Practices

1. **Create custom hooks** for consuming context (useAuth, useTheme, etc.)
2. **Check for undefined context** in custom hooks
3. **Split state and dispatch** into separate contexts for performance
4. **Keep context values stable** with useMemo when needed
5. **Don't overuse context** - prop drilling for 1-2 levels is fine
6. **Group related state** in the same context
7. **Name contexts clearly** - AuthContext, ThemeContext, etc.

## Performance Optimization

```jsx
import { useMemo } from 'react';

function ExpensiveProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      setState,
      // Other stable functions
    }),
    [state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

## Avoid

- Using context for frequently changing values (causes all consumers to re-render)
- Creating too many contexts (increases complexity)
- Not memoizing context values (causes unnecessary re-renders)
- Putting everything in context (use local state when possible)
- Forgetting to provide default value or error checking in custom hooks

# State Management with useState

State allows components to remember values between renders and trigger re-renders when changed.

## Basic State

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Multiple State Variables

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={age} onChange={e => setAge(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </form>
  );
}
```

## State with Objects

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    email: 'john@example.com'
  });

  const updateName = (newName) => {
    setUser({ ...user, name: newName }); // Spread to preserve other fields
  };

  const updateEmail = (newEmail) => {
    setUser(prev => ({ ...prev, email: newEmail })); // Functional update
  };

  return (
    <div>
      <p>{user.name} - {user.email}</p>
      <button onClick={() => updateName('Jane')}>Change Name</button>
    </div>
  );
}
```

## State with Arrays

```jsx
function TodoList() {
  const [todos, setTodos] = useState(['Learn React', 'Build app']);

  const addTodo = (text) => {
    setTodos([...todos, text]); // Add to end
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index)); // Remove by index
  };

  const updateTodo = (index, newText) => {
    setTodos(todos.map((todo, i) => i === index ? newText : todo));
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {todo}
          <button onClick={() => removeTodo(index)}>Delete</button>
        </li>
      ))}
      <button onClick={() => addTodo('New task')}>Add</button>
    </ul>
  );
}
```

## Functional Updates

Use when new state depends on previous state.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // ✅ Correct - uses previous state
    setCount(prev => prev + 1);
  };

  const incrementThrice = () => {
    // ✅ Works correctly
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  const incrementWrong = () => {
    // ❌ Wrong - all use same stale value
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // Still only increments by 1
  };

  return <button onClick={increment}>Count: {count}</button>;
}
```

## Lazy Initialization

Use function for expensive initial state calculations.

```jsx
function ExpensiveComponent() {
  // ❌ Runs on every render
  const [data, setData] = useState(expensiveCalculation());

  // ✅ Only runs once on mount
  const [data, setData] = useState(() => expensiveCalculation());

  return <div>{data}</div>;
}
```

## Toggle Pattern

```jsx
function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn(prev => !prev);

  return (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```

## Complex State Example

```jsx
function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addItem = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart Total: ${total.toFixed(2)}</h2>
      {/* Render cart items */}
    </div>
  );
}
```

## Best Practices

1. **Keep state minimal** - derive values when possible
2. **Group related state** into objects
3. **Use functional updates** when state depends on previous value
4. **Don't mutate state directly** - always create new objects/arrays
5. **Initialize state properly** - use lazy initialization for expensive computations
6. **Lift state up** when multiple components need it

## Common Patterns

### Derived State
```jsx
function UserList({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Derive instead of storing
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      {filteredUsers.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

## Avoid

- Storing props in state (use props directly or derive)
- Mutating state directly (`user.name = 'Jane'` ❌)
- Using state for values that don't cause re-renders
- Keeping redundant/duplicate state

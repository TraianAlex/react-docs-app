# Best Practices & Patterns

Modern React patterns and conventions for clean, maintainable code.

## Component Organization

### File Structure
```
src/
  components/
    Button/
      Button.jsx
      Button.module.css
      Button.test.jsx
      index.js
    Header/
      Header.jsx
      Header.module.css
      index.js
  hooks/
    useAuth.js
    useFetch.js
  contexts/
    AuthContext.jsx
    ThemeContext.jsx
  utils/
    formatDate.js
    api.js
```

### Component Template
```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './MyComponent.module.css';

function MyComponent({ title, onAction }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleEvent = () => {
    // Event handler
  };

  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func
};

export default MyComponent;
```

## Naming Conventions

```jsx
// Components: PascalCase
function UserProfile() {}

// Hooks: camelCase starting with "use"
function useAuth() {}

// Event handlers: handle + Event
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = () => {};

// Boolean variables: is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldRender = true;

// Arrays: plural nouns
const users = [];
const items = [];

// Event handler props: on + Event
<Button onClick={handleClick} />
<Form onSubmit={handleSubmit} />
```

## Keep Components Small

```jsx
// ❌ Bad - too many responsibilities
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  // 100+ lines of logic and JSX
}

// ✅ Good - split into smaller components
function Dashboard() {
  return (
    <div>
      <UserSection />
      <PostSection />
      <CommentSection />
    </div>
  );
}

function UserSection() {
  const [users, setUsers] = useState([]);
  // User-specific logic
  return <div>{/* Users UI */}</div>;
}
```

## Extract Complex Logic

```jsx
// ❌ Bad - logic mixed with JSX
function ProductList({ products }) {
  return (
    <div>
      {products
        .filter(p => p.inStock && p.price < 100)
        .sort((a, b) => b.rating - a.rating)
        .map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
}

// ✅ Good - logic extracted
function ProductList({ products }) {
  const affordableInStock = products
    .filter(p => p.inStock && p.price < 100)
    .sort((a, b) => b.rating - a.rating);

  return (
    <div>
      {affordableInStock.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Avoid Prop Drilling

```jsx
// ❌ Bad - passing props through many levels
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  return <UserMenu user={user} />;
}

// ✅ Good - use Context
function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function UserMenu() {
  const { user } = useAuth();
  return <div>{user.name}</div>;
}
```

## Composition Over Props

```jsx
// ❌ Bad - too many props
function Card({ title, content, footer, showHeader, showFooter, theme }) {
  return (
    <div className={theme}>
      {showHeader && <header>{title}</header>}
      <main>{content}</main>
      {showFooter && <footer>{footer}</footer>}
    </div>
  );
}

// ✅ Good - use composition
function Card({ children, theme }) {
  return <div className={theme}>{children}</div>;
}

function CardHeader({ children }) {
  return <header>{children}</header>;
}

function CardBody({ children }) {
  return <main>{children}</main>;
}

function CardFooter({ children }) {
  return <footer>{children}</footer>;
}

// Usage
<Card theme="light">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Early Returns

```jsx
// ❌ Bad - nested conditions
function UserProfile({ user }) {
  return (
    <div>
      {user ? (
        user.isActive ? (
          <div>
            <h1>{user.name}</h1>
            <p>{user.bio}</p>
          </div>
        ) : (
          <div>User is inactive</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

// ✅ Good - early returns
function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (!user.isActive) {
    return <div>User is inactive</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

## Avoid Inline Functions in Renders

```jsx
// ❌ Bad - creates new function on every render
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={todo.id} onClick={() => console.log(index)}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// ✅ Good - stable function reference
function TodoList({ todos }) {
  const handleClick = (index) => {
    console.log(index);
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} onClick={handleClick} />
      ))}
    </ul>
  );
}
```

## Use Fragments

```jsx
// ❌ Bad - unnecessary div wrapper
function List() {
  return (
    <div>
      <li>Item 1</li>
      <li>Item 2</li>
    </div>
  );
}

// ✅ Good - use Fragment
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

## Derive State When Possible

```jsx
// ❌ Bad - storing derived state
function ProductList({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilteredProducts(products.filter(p => p.name.includes(term)));
  };

  return (/* ... */);
}

// ✅ Good - derive on render
function ProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (/* ... */);
}
```

## Object/Array Dependencies

```jsx
// ❌ Bad - creates new object every render
function UserProfile({ userId }) {
  const config = { userId, includeDetails: true };

  useEffect(() => {
    fetchUser(config);
  }, [config]); // Runs every render!

  return <div>...</div>;
}

// ✅ Good - stable dependencies
function UserProfile({ userId }) {
  useEffect(() => {
    fetchUser({ userId, includeDetails: true });
  }, [userId]); // Only runs when userId changes

  return <div>...</div>;
}
```

## Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

## Memoization

```jsx
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data, onAction }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  // Memoize callbacks to prevent child re-renders
  const handleAction = useCallback((item) => {
    onAction(item);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <ChildComponent key={item.id} item={item} onAction={handleAction} />
      ))}
    </div>
  );
}

// Only re-render if props change
export default React.memo(ExpensiveComponent);
```

## Loading States Pattern

```jsx
function DataComponent() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus('loading');

    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setStatus('success');
      })
      .catch(err => {
        setError(err);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error message={error.message} />;
  if (status === 'success') return <DataDisplay data={data} />;

  return null;
}
```

## Feature Flags

```jsx
const features = {
  newDashboard: true,
  betaFeatures: false
};

function FeatureFlag({ feature, children, fallback = null }) {
  return features[feature] ? children : fallback;
}

// Usage
<FeatureFlag feature="newDashboard" fallback={<OldDashboard />}>
  <NewDashboard />
</FeatureFlag>
```

## Environment Variables

```jsx
// Use process.env for configuration
const API_URL = process.env.REACT_APP_API_URL;
const DEBUG_MODE = process.env.NODE_ENV === 'development';

function App() {
  useEffect(() => {
    if (DEBUG_MODE) {
      console.log('Debug mode enabled');
    }
  }, []);

  return <div>API: {API_URL}</div>;
}
```

## Key Principles

1. **Components do one thing well**
2. **Props flow down, events flow up**
3. **Lift state up when shared**
4. **Keep state as local as possible**
5. **Prefer composition over configuration**
6. **Extract reusable logic into hooks**
7. **Handle loading and error states**
8. **Always use keys in lists**
9. **Avoid premature optimization**
10. **Test components in isolation**

## Performance Tips

1. Use `React.memo` for expensive pure components
2. Use `useMemo` for expensive calculations
3. Use `useCallback` for stable function references
4. Lazy load routes and large components
5. Code split with dynamic imports
6. Virtualize long lists (react-window, react-virtualized)
7. Debounce expensive operations
8. Avoid inline object/array creation in render
9. Use production builds for deployment
10. Profile with React DevTools

## Common Anti-Patterns to Avoid

- Index as key in dynamic lists
- Mutating state directly
- Too many useState calls (use useReducer)
- Using effects for computations (derive instead)
- Not cleaning up effects
- Copying props to state unnecessarily
- Creating components inside components
- Passing too many props (use context/composition)
- Not handling edge cases (empty arrays, null values)
- Over-abstracting too early

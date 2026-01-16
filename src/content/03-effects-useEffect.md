# Effects with useEffect

Effects let you synchronize with external systems (API calls, subscriptions, DOM manipulation).

## Basic Effect

Runs after every render.

```jsx
import { useEffect } from 'react';

function Logger() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component rendered, count:', count);
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Effect with Dependencies

Runs only when dependencies change.

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Only re-run when userId changes

  return <div>{user?.name}</div>;
}
```

## Effect on Mount Only

Empty dependency array runs once after mount.

```jsx
function Analytics() {
  useEffect(() => {
    console.log('Page loaded');
    trackPageView();
  }, []); // Runs once on mount

  return <div>Welcome</div>;
}
```

## Cleanup Function

Return cleanup to unsubscribe or cancel operations.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup runs before effect re-runs and on unmount
    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

## Fetching Data

```jsx
function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true; // Prevent state update if unmounted
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{articles.map(article => <div key={article.id}>{article.title}</div>)}</div>;
}
```

## With Async/Await

```jsx
function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return <div>{/* Render posts */}</div>;
}
```

## Event Listeners

```jsx
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>Window width: {width}px</div>;
}
```

## Local Storage Sync

```jsx
function PersistentCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Document Title

```jsx
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <div>{title}</div>;
}
```

## WebSocket Connection

```jsx
function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://chat.example.com/${roomId}`);

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    return () => ws.close();
  }, [roomId]);

  return <div>{/* Render messages */}</div>;
}
```

## Debounced Search

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetch(`/api/search?q=${query}`)
          .then(res => res.json())
          .then(setResults);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {results.map(result => <div key={result.id}>{result.name}</div>)}
    </div>
  );
}
```

## Multiple Effects

Split unrelated logic into separate effects.

```jsx
function Dashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Effect 1: Fetch user
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  // Effect 2: Fetch posts
  useEffect(() => {
    fetch(`/api/posts?user=${userId}`)
      .then(res => res.json())
      .then(setPosts);
  }, [userId]);

  // Effect 3: Analytics
  useEffect(() => {
    trackPageView('dashboard', userId);
  }, [userId]);

  return <div>{/* Render content */}</div>;
}
```

## Best Practices

1. **Always specify dependencies** - avoid leaving array empty unless intentional
2. **One effect per concern** - split unrelated logic
3. **Clean up side effects** - return cleanup function
4. **Avoid updating state in effects without dependencies** - causes infinite loops
5. **Use async functions inside effects** - not in the effect callback itself
6. **Handle race conditions** - use cancellation flags for async operations

## Common Patterns

### Conditional Effect
```jsx
function ConditionalEffect({ shouldRun, data }) {
  useEffect(() => {
    if (shouldRun) {
      processData(data);
    }
  }, [shouldRun, data]);

  return <div>Processing...</div>;
}
```

### Effect with Previous Value
```jsx
function ComponentWithPrevious({ value }) {
  const prevValue = useRef();

  useEffect(() => {
    if (prevValue.current !== value) {
      console.log('Value changed from', prevValue.current, 'to', value);
    }
    prevValue.current = value;
  }, [value]);

  return <div>{value}</div>;
}
```

## Avoid

- Effects without dependency arrays (unless intentional)
- Forgetting cleanup for subscriptions/timers
- Mutating objects in dependency array (causes unnecessary re-runs)
- Using effects for computations (use derived state instead)
- Infinite loops from missing dependencies or updating deps inside effect

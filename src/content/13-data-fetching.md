# Data Fetching Patterns

Modern approaches to fetching and managing data in React applications, from basic patterns to advanced techniques.

## Basic Fetch with useEffect

### Simple Data Fetching
```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Fetch with Abort Controller
```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function search() {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${query}`, {
          signal: abortController.signal
        });
        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    search();

    return () => {
      abortController.abort();
    };
  }, [query]);

  return (
    <div>
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Custom Fetch Hook

### Reusable useFetch Hook
```jsx
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function PostList() {
  const { data: posts, loading, error } = useFetch('/api/posts');

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Advanced Fetch Hook with Refetch
```jsx
function useAdvancedFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex(prev => prev + 1);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const json = await response.json();

        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [url, refetchIndex]);

  return { data, loading, error, refetch };
}

// Usage
function Comments({ postId }) {
  const { data: comments, loading, error, refetch } = useAdvancedFetch(
    `/api/posts/${postId}/comments`
  );

  return (
    <div>
      <button onClick={refetch}>Refresh Comments</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {comments?.map(comment => (
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  );
}
```

## Suspense for Data Fetching

### Using Suspense with Resource Pattern
```jsx
import { Suspense } from 'react';

// Simple cache to store promises
const cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url,
      fetch(url)
        .then(res => res.json())
        .then(data => {
          cache.set(url, { data, status: 'success' });
          return data;
        })
        .catch(error => {
          cache.set(url, { error, status: 'error' });
          throw error;
        })
    );
  }

  const cached = cache.get(url);

  if (cached instanceof Promise) {
    throw cached; // Suspense catches this
  }

  if (cached.status === 'error') {
    throw cached.error;
  }

  return cached.data;
}

function UserData({ userId }) {
  const user = fetchData(`/api/users/${userId}`);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserData userId={1} />
    </Suspense>
  );
}
```

### Progressive Data Loading
```jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<SkeletonStats />}>
        <Stats />
      </Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Suspense fallback={<SkeletonChart />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<SkeletonChart />}>
          <UsersChart />
        </Suspense>
      </div>

      <Suspense fallback={<SkeletonTable />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

## Parallel Data Fetching

### Fetching Multiple Resources
```jsx
function UserDashboard({ userId }) {
  const [data, setData] = useState({
    user: null,
    posts: null,
    followers: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const [user, posts, followers] = await Promise.all([
          fetch(`/api/users/${userId}`).then(r => r.json()),
          fetch(`/api/users/${userId}/posts`).then(r => r.json()),
          fetch(`/api/users/${userId}/followers`).then(r => r.json())
        ]);

        setData({ user, posts, followers });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [userId]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <UserInfo user={data.user} />
      <PostList posts={data.posts} />
      <FollowersList followers={data.followers} />
    </div>
  );
}
```

### Waterfall vs Parallel Fetching
```jsx
// ❌ Bad: Waterfall (sequential)
function UserPosts({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);

  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}/posts`)
        .then(r => r.json())
        .then(setPosts);
    }
  }, [user]);

  // Renders after 2 sequential requests
}

// ✅ Good: Parallel
function UserPosts({ userId }) {
  const [data, setData] = useState({ user: null, posts: null });

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then(r => r.json()),
      fetch(`/api/users/${userId}/posts`).then(r => r.json())
    ]).then(([user, posts]) => {
      setData({ user, posts });
    });
  }, [userId]);

  // Renders after 1 parallel request
}
```

## Polling and Real-Time Updates

### Polling Pattern
```jsx
function LiveData({ interval = 5000 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/live-data');
      const json = await response.json();
      setData(json);
    }

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return <div>Latest: {data?.value}</div>;
}
```

### Smart Polling with Visibility API
```jsx
function usePolling(fetchFn, interval = 5000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let intervalId;

    async function poll() {
      if (!document.hidden) {
        const result = await fetchFn();
        setData(result);
      }
    }

    poll(); // Initial fetch
    intervalId = setInterval(poll, interval);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        poll(); // Fetch immediately when tab becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchFn, interval]);

  return data;
}

// Usage
function NotificationBadge() {
  const notifications = usePolling(
    () => fetch('/api/notifications').then(r => r.json()),
    10000
  );

  return (
    <div>
      Notifications: {notifications?.count || 0}
    </div>
  );
}
```

## Infinite Scroll

### Pagination with Infinite Loading
```jsx
function InfinitePostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadMore() {
      if (loading || !hasMore) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/posts?page=${page}&limit=20`);
        const newPosts = await response.json();

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMore();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <div>Loading more...</div>}
      {!hasMore && <div>No more posts</div>}
    </div>
  );
}
```

### Intersection Observer for Infinite Scroll
```jsx
function useInfiniteScroll(callback) {
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return observerRef;
}

// Usage
function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const newPosts = await fetch(`/api/posts?page=${page}`).then(r => r.json());
    setPosts(prev => [...prev, ...newPosts]);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [page, loading]);

  const sentinelRef = useInfiniteScroll(loadMore);

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={sentinelRef}>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
```

## Caching Strategies

### Simple Memory Cache
```jsx
const cache = new Map();

function useCachedFetch(url, ttl = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const cached = cache.get(url);
      const now = Date.now();

      if (cached && now - cached.timestamp < ttl) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();

        cache.set(url, {
          data: json,
          timestamp: now
        });

        setData(json);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, ttl]);

  return { data, loading };
}
```

### localStorage Cache
```jsx
function usePersistentFetch(url, cacheKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to get from cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
        }

        // Fetch fresh data
        const response = await fetch(url);
        const json = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(json));
        setData(json);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, cacheKey]);

  return { data, loading };
}
```

## Error Handling and Retry

### Fetch with Retry Logic
```jsx
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

function RobustDataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithRetry('/api/data')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Error Boundary for Suspense
```jsx
import { Suspense } from 'react';

class DataErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Failed to load data</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <DataErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent />
      </Suspense>
    </DataErrorBoundary>
  );
}
```

## Best Practices

### Do
- Use AbortController to cancel requests on unmount
- Implement loading and error states
- Cache frequently accessed data
- Debounce search inputs
- Use Suspense for better loading UX
- Handle race conditions
- Clean up effects properly

### Avoid
- Fetching in render (use useEffect or Suspense)
- Not handling loading/error states
- Ignoring memory leaks (cleanup)
- Waterfall requests when parallel is possible
- Not caching expensive requests
- Forgetting to abort ongoing requests
- Over-fetching data

## Common Patterns Summary

1. **Basic Fetch**: Simple useEffect with fetch
2. **Custom Hook**: Reusable useFetch for any endpoint
3. **Suspense**: Declarative loading with React Suspense
4. **Parallel**: Promise.all for concurrent requests
5. **Polling**: setInterval for live data
6. **Infinite Scroll**: Load more on scroll/intersection
7. **Caching**: Memory/localStorage for performance
8. **Retry**: Exponential backoff for reliability

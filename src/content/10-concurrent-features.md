# Concurrent Features (React 18+)

React 18 introduced concurrent features that allow React to prepare multiple versions of the UI at the same time, improving perceived performance and user experience.

## useTransition

`useTransition` marks state updates as non-urgent, allowing React to keep the UI responsive during expensive operations.

### Basic Usage
```jsx
import { useState, useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value); // Urgent: update input immediately

    startTransition(() => {
      // Non-urgent: update results without blocking
      const filtered = expensiveSearch(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <p>Updating results...</p>}
      <ResultsList results={results} />
    </div>
  );
}
```

### Tab Switching Example
```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <div>
      <nav>
        <button onClick={() => handleTabChange('home')}>Home</button>
        <button onClick={() => handleTabChange('profile')}>Profile</button>
        <button onClick={() => handleTabChange('settings')}>Settings</button>
        {isPending && <span>Loading...</span>}
      </nav>
      <TabContent tab={activeTab} />
    </div>
  );
}
```

### Filtering Large Lists
```jsx
function ProductCatalog({ products }) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilterChange = (value) => {
    setFilter(value);

    startTransition(() => {
      // Heavy filtering operation
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        placeholder="Filter products..."
      />
      {isPending ? (
        <p>Filtering {products.length} products...</p>
      ) : (
        <p>{filteredProducts.length} products found</p>
      )}
      <ProductList products={filteredProducts} />
    </div>
  );
}
```

## useDeferredValue

`useDeferredValue` defers updating a value, keeping the UI responsive while showing slightly stale data during expensive renders.

### Basic Usage
```jsx
import { useState, useDeferredValue } from 'react';

function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // Filter using deferred value
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Showing results for: {deferredQuery}</p>
      <List items={filteredItems} />
    </div>
  );
}
```

### Showing Stale Content Indicator
```jsx
function DataGrid({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const isStale = searchTerm !== deferredSearchTerm;

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(deferredSearchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search all fields..."
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <table>
          <tbody>
            {filteredData.map(row => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Chart Updates
```jsx
function LiveChart({ data }) {
  const [timeRange, setTimeRange] = useState('24h');
  const deferredTimeRange = useDeferredValue(timeRange);

  // Expensive chart calculation
  const chartData = useMemo(() => {
    return calculateChartData(data, deferredTimeRange);
  }, [data, deferredTimeRange]);

  return (
    <div>
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
      >
        <option value="1h">Last Hour</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>
      <Chart data={chartData} />
    </div>
  );
}
```

## Suspense for Data Fetching

Suspense lets components wait for data before rendering, showing fallback UI automatically.

### Basic Suspense
```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId={1} />
    </Suspense>
  );
}
```

### Nested Suspense Boundaries
```jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <UserStats />
        <Suspense fallback={<p>Loading posts...</p>}>
          <RecentPosts />
        </Suspense>
        <Suspense fallback={<p>Loading activity...</p>}>
          <ActivityFeed />
        </Suspense>
      </Suspense>
    </div>
  );
}
```

### Error Boundaries with Suspense
```jsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<LoadingSpinner />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorMessage() {
  return <div>Something went wrong. Please try again.</div>;
}
```

### Progressive Loading
```jsx
function BlogPost({ postId }) {
  return (
    <article>
      <Suspense fallback={<h1>Loading title...</h1>}>
        <PostTitle postId={postId} />
      </Suspense>

      <Suspense fallback={<div>Loading content...</div>}>
        <PostContent postId={postId} />
      </Suspense>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments postId={postId} />
      </Suspense>
    </article>
  );
}
```

## useTransition vs useDeferredValue

### When to use useTransition
- You control the state update
- You want to show pending indicators
- Tab switching, navigation
- User-triggered actions

```jsx
const [isPending, startTransition] = useTransition();

const handleClick = () => {
  startTransition(() => {
    setState(newValue);
  });
};
```

### When to use useDeferredValue
- You receive a value from props/parent
- You want to defer a specific value
- Real-time search inputs
- Filtering/sorting operations

```jsx
const deferredValue = useDeferredValue(value);

const results = expensiveOperation(deferredValue);
```

## Combining Concurrent Features

```jsx
function AdvancedSearch({ items }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase())
    );
    return filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [items, deferredQuery, sortBy]);

  const handleSortChange = (newSort) => {
    startTransition(() => {
      setSortBy(newSort);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </select>
      {isPending && <p>Re-sorting...</p>}
      <Suspense fallback={<p>Loading results...</p>}>
        <ResultsList results={results} />
      </Suspense>
    </div>
  );
}
```

## Best Practices

### Do
- Use `useTransition` for state updates you control
- Use `useDeferredValue` for props/values from parents
- Wrap expensive components in Suspense boundaries
- Show meaningful loading states
- Place Suspense boundaries strategically

### Avoid
- Using transitions for all state updates
- Nesting too many Suspense boundaries
- Showing generic "Loading..." without context
- Using transitions for animations (use CSS instead)
- Combining with older loading patterns unnecessarily

## Performance Benefits

1. **Improved Perceived Performance**: UI stays responsive during updates
2. **Better User Experience**: Input fields remain snappy
3. **Reduced Jank**: Smoother transitions between states
4. **Progressive Loading**: Show content as it becomes available
5. **Automatic Code Splitting**: With Suspense and lazy loading

## Common Use Cases

- Search inputs with large datasets
- Tab switching in complex UIs
- Filtering and sorting operations
- Real-time data visualization
- Progressive content loading
- Image galleries with lazy loading
- Infinite scroll implementations
- Complex form validation

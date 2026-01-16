# Conditional Rendering & Lists

Dynamic UI rendering based on state and data.

## Conditional Rendering with &&

```jsx
function Greeting({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn && <h1>Welcome back, {username}!</h1>}
      {!isLoggedIn && <h1>Please sign in</h1>}
    </div>
  );
}
```

## Ternary Operator

```jsx
function LoginButton({ isLoggedIn }) {
  return (
    <button>
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
}
```

## If-Else with Early Return

```jsx
function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.banned) {
    return <div>This user is banned</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Multiple Conditions

```jsx
function StatusMessage({ status }) {
  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error occurred!</p>}
      {status === 'success' && <p>Success!</p>}
    </div>
  );
}
```

## Switch-Case Pattern

```jsx
function Notification({ type, message }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification ${type}`}>
      <span>{getIcon()}</span>
      <span>{message}</span>
    </div>
  );
}
```

## Conditional Props

```jsx
function Button({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={disabled ? 'btn-disabled' : 'btn-active'}
    >
      {children}
    </button>
  );
}
```

## Basic List Rendering

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## List with Index (Use Sparingly)

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {index + 1}. {todo}
        </li>
      ))}
    </ul>
  );
}

// ⚠️ Only use index as key if items never reorder/delete
```

## Complex List Items

```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
```

## Empty List Handling

```jsx
function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p>No comments yet. Be the first!</p>;
  }

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
```

## Filtered Lists

```jsx
function FilteredUserList({ users, searchTerm }) {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Sorted Lists

```jsx
function LeaderBoard({ players }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <ol>
      {sortedPlayers.map((player, index) => (
        <li key={player.id}>
          #{index + 1} {player.name} - {player.score} points
        </li>
      ))}
    </ol>
  );
}
```

## Grouped Lists

```jsx
function GroupedTasks({ tasks }) {
  const grouped = tasks.reduce((acc, task) => {
    const category = task.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([category, categoryTasks]) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {categoryTasks.map(task => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## Nested Lists

```jsx
function FolderTree({ folders }) {
  return (
    <ul>
      {folders.map(folder => (
        <li key={folder.id}>
          {folder.name}
          {folder.subfolders && folder.subfolders.length > 0 && (
            <FolderTree folders={folder.subfolders} />
          )}
        </li>
      ))}
    </ul>
  );
}
```

## Conditional List Items

```jsx
function TaskList({ tasks, showCompleted }) {
  return (
    <ul>
      {tasks.map(task => {
        if (!showCompleted && task.completed) {
          return null;
        }

        return (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </li>
        );
      })}
    </ul>
  );
}
```

## Pagination

```jsx
function PaginatedList({ items, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <ul>
        {currentItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Loading States

```jsx
function DataList({ data, loading, error }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Component Switching

```jsx
function Dashboard({ view }) {
  const renderView = () => {
    switch (view) {
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main>{renderView()}</main>
    </div>
  );
}
```

## Visibility Toggle

```jsx
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <button onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? '▼' : '▶'}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}
```

## Best Practices

1. **Always use unique keys** for list items (prefer ID over index)
2. **Keep conditions simple** in JSX
3. **Extract complex conditions** into variables or functions
4. **Handle empty states** explicitly
5. **Avoid nested ternaries** (hard to read)
6. **Return early** for simpler component logic
7. **Don't use array index as key** if items can reorder/delete

## Common Patterns

### Conditional Wrapper
```jsx
function ConditionalWrapper({ condition, wrapper, children }) {
  return condition ? wrapper(children) : children;
}

// Usage
<ConditionalWrapper
  condition={isLink}
  wrapper={children => <a href="/path">{children}</a>}
>
  <span>Content</span>
</ConditionalWrapper>
```

### Render Props
```jsx
function List({ items, renderItem, renderEmpty }) {
  if (items.length === 0) {
    return renderEmpty();
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={user => <span>{user.name}</span>}
  renderEmpty={() => <p>No users</p>}
/>
```

## Avoid

- Using array index as key (when items can change order)
- Overly complex nested ternaries
- Rendering null/undefined without checking (can cause errors)
- Creating new arrays on every render (use useMemo if expensive)
- Mutating original array (always create new array for sort/filter)

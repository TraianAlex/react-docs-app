# Components & Props

Components are the building blocks of React apps. Use functional components with hooks (modern approach).

## Basic Component

```jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

## Component with Props

Props pass data from parent to child (read-only).

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Greeting name="Alice" age={25} />
```

## Default Props

```jsx
function Button({ text = "Click me", variant = "primary" }) {
  return <button className={variant}>{text}</button>;
}

// Usage
<Button /> // Uses defaults
<Button text="Submit" variant="success" />
```

## Props with Children

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="User Profile">
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
</Card>
```

## Composing Components

```jsx
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatarUrl} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </div>
  );
}

// Usage
const user = {
  name: "Jane Smith",
  bio: "Software Developer",
  avatarUrl: "/images/jane.jpg"
};

<UserCard user={user} />
```

## Spreading Props

```jsx
function Input(props) {
  return <input className="custom-input" {...props} />;
}

// Usage - all props passed through
<Input type="email" placeholder="Enter email" required />
```

## Best Practices

1. **One component per file** (for larger components)
2. **Destructure props** in function parameters
3. **Use PropTypes** or TypeScript for type safety
4. **Keep components small** and focused on one thing
5. **Name components with PascalCase**
6. **Extract reusable components** early

## Common Patterns

### Container/Presentational Pattern
```jsx
// Presentational (UI only)
function UserList({ users, onUserClick }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserClick(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Container (logic)
function UserListContainer() {
  const [users, setUsers] = useState([]);

  const handleUserClick = (user) => {
    console.log('Clicked:', user);
  };

  return <UserList users={users} onUserClick={handleUserClick} />;
}
```

## Avoid

- Modifying props (they're immutable)
- Too many props (more than 5-6 suggests refactoring needed)
- Passing unnecessary props down multiple levels (use Context instead)

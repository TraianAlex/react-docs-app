# React 19 New Hooks

React 19 introduces powerful new hooks that simplify async operations, form handling, and optimistic UI updates.

## use() Hook

The `use()` hook reads the value of a Promise or Context, enabling you to fetch data directly in components.

### Reading Promises
```jsx
import { use } from 'react';

function UserProfile({ userPromise }) {
  const user = use(userPromise);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Usage with Suspense
function App() {
  const userPromise = fetchUser(1);

  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

### Conditional Data Fetching
```jsx
function BlogPost({ postId }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article>
      <PostContent postId={postId} />
      <button onClick={() => setShowComments(!showComments)}>
        Toggle Comments
      </button>
      {showComments && (
        <Suspense fallback={<p>Loading comments...</p>}>
          <Comments postId={postId} />
        </Suspense>
      )}
    </article>
  );
}

function Comments({ postId }) {
  const commentsPromise = fetchComments(postId);
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}
```

### Reading Context
```jsx
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = use(ThemeContext);

  return (
    <button className={`btn-${theme}`}>
      Click Me
    </button>
  );
}
```

### Error Handling with use()
```jsx
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function DataComponent({ dataPromise }) {
  const data = use(dataPromise);

  return <div>{data.title}</div>;
}

function App() {
  const dataPromise = fetchData();

  return (
    <ErrorBoundary fallback={<div>Error loading data</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent dataPromise={dataPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## useOptimistic

`useOptimistic` allows you to show optimistic state while an async action is in progress, providing instant feedback to users.

### Basic Optimistic UI
```tsx
import { useOptimistic, useState, useTransition, FormEvent } from 'react';
import { todoAPI } from '../shared/api/todoAPI';
import type { Todo } from '../shared/types';

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn React 19 hooks', completed: true },
  { id: 2, text: 'Build awesome features', completed: false },
];

function OptimisticTodoAdd() {
  const [isPending, startTransition] = useTransition();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }],
  );
  const [newTodoText, setNewTodoText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (!newTodoText.trim()) return;

      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText,
        completed: false,
      };

      addOptimisticTodo(newTodo);
      setNewTodoText('');
      setError(null);

      try {
        const savedTodo = await todoAPI.add(newTodo.text);
        setTodos([...todos, savedTodo]);
      } catch (err) {
        console.error('Failed to add todo', err);
        setError('Failed to add todo. It will disappear shortly.');
      }
    });
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Waiting...' : 'Add Todo'}
      </button>
      {error && <p>{error}</p>}
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.6 : 1 }}>
            {todo.text}
            {todo.pending && <span> (Saving...)</span>}
          </li>
        ))}
      </ul>
    </form>
  );
}
```

### Optimistic Likes
```tsx
import { useOptimistic, useState, useTransition } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

type PostWithPending = Post & { pending: boolean };

const initialPosts: PostWithPending[] = [
  { id: 1, title: 'Getting Started with React 19', body: 'Learn about the new features in React 19...', author: 'Alice', likes: 42, pending: false },
  { id: 2, title: 'Understanding Concurrent Features', body: 'Dive deep into useTransition and useDeferredValue...', author: 'Bob', likes: 38, pending: false },
  { id: 3, title: 'Optimistic UI Updates', body: 'Make your app feel faster with optimistic updates...', author: 'Charlie', likes: 56, pending: false },
];

function OptimisticLikes() {
  const [posts, setPosts] = useState<PostWithPending[]>(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [optimisticPosts, addOptimisticLike] = useOptimistic(
    posts,
    (currentPosts, postId: number) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: (post.likes ?? 0) + 1, pending: true } : post,
      ),
  );

  const handleLike = (postId: number) => {
    startTransition(async () => {
      const post = posts.find((p) => p.id === postId);
      if (!post || post.likes === undefined) return;

      addOptimisticLike(postId);

      try {
        const newLikes = await postAPI.likePost(postId, post.likes);
        setPosts((current) =>
          current.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)),
        );
      } catch (err) {
        console.error('Failed to like post', err);
        setPosts((current) =>
          current.map((p) =>
            p.id === postId ? { ...p, likes: post.likes } : p,
          ),
        );
      }
    });
  };

  return (
    <div>
      {optimisticPosts.map((post) => (
        <button key={post.id} onClick={() => handleLike(post.id)} disabled={isPending}>
          ❤️ {post.likes} {isPending && post.pending ? '(Saving...)' : null}
        </button>
      ))}
    </div>
  );
}
```

### Optimistic Delete
```tsx
import { useState, useOptimistic, useTransition } from 'react';
import { todoAPI } from '../shared/api/todoAPI';
import type { Todo } from '../shared/types';

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn React 19 hooks', completed: true },
  { id: 2, text: 'Build awesome features', completed: false },
];

function OptimisticDelete() {
  const [isPending, startTransition] = useTransition();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticTodosDelete, removeOptimisticTodo] = useOptimistic(
    todos,
    (state, id: number) => state.filter((t) => t.id !== id),
  );

  const handleDelete = (id: number) => {
    setIsDeleting(true);
    startTransition(async () => {
      const originalTodos = todos;
      removeOptimisticTodo(id);
      try {
        await todoAPI.delete(id);
        setTodos(todos.filter((t) => t.id !== id));
        setIsDeleting(false);
      } catch (err) {
        console.error('Failed to delete todo', err);
        setTodos(originalTodos);
        setIsDeleting(false);
      }
    });
  };

  return (
    <ul>
      {(isDeleting ? optimisticTodosDelete : todos).map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => handleDelete(todo.id)} disabled={isPending}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Optimistic Update
```tsx
import { useState, useOptimistic, useTransition } from 'react';
import { profileAPI } from '../shared/api/profileAPI';
import type { Profile } from '../shared/types';

const initialProfile: Profile = {
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'React developer',
};

function OptimisticProfile() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isPending, startTransition] = useTransition();
  const [optimisticProfile, updateOptimisticProfile] = useOptimistic(
    profile,
    (state, updates: Partial<Profile>) => ({ ...state, ...updates }),
  );

  const handleUpdate = (field: keyof Profile, value: string) => {
    startTransition(async () => {
      updateOptimisticProfile({ [field]: value });

      try {
        await profileAPI.update({ [field]: value });
        setProfile({ ...profile, [field]: value });
      } catch (err) {
        console.error('Failed to update profile', err);
      }
    });
  };

  return (
    <div>
      {isPending && <p>Saving changes...</p>}
      <input
        value={optimisticProfile.name}
        onChange={(e) => handleUpdate('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={optimisticProfile.email}
        onChange={(e) => handleUpdate('email', e.target.value)}
        placeholder="Email"
      />
      <textarea
        value={optimisticProfile.bio}
        onChange={(e) => handleUpdate('bio', e.target.value)}
        placeholder="Tell us about yourself"
      />
    </div>
  );
}
```

## useActionState

`useActionState` (formerly `useFormState`) manages form state with server actions, handling pending states and errors automatically.

### Basic Form with Action State
```jsx
import { useActionState } from 'react';

async function submitForm(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  try {
    await saveUser({ name, email });
    return { success: true, message: 'User saved!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function UserForm() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    success: null,
    message: ''
  });

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save User'}
      </button>
      {state.message && (
        <p style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

### Login Form
```jsx
async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const user = await login(email, password);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid credentials' };
  }
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    user: null,
    error: null
  });

  if (state.user) {
    return <div>Welcome, {state.user.name}!</div>;
  }

  return (
    <form action={formAction}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Multi-Step Form
```jsx
async function handleStep(prevState, formData) {
  const { step } = prevState;
  const data = Object.fromEntries(formData);

  if (step === 1) {
    return {
      step: 2,
      data: { ...prevState.data, ...data },
      error: null
    };
  }

  if (step === 2) {
    try {
      await submitRegistration({ ...prevState.data, ...data });
      return { step: 3, data: null, error: null };
    } catch (error) {
      return { ...prevState, error: error.message };
    }
  }

  return prevState;
}

function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(handleStep, {
    step: 1,
    data: {},
    error: null
  });

  if (state.step === 3) {
    return <div>Registration complete!</div>;
  }

  return (
    <form action={formAction}>
      {state.step === 1 && (
        <>
          <h2>Step 1: Personal Info</h2>
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
        </>
      )}
      {state.step === 2 && (
        <>
          <h2>Step 2: Additional Info</h2>
          <input name="phone" placeholder="Phone" />
          <textarea name="bio" placeholder="Bio" />
        </>
      )}
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Processing...' : state.step === 1 ? 'Next' : 'Submit'}
      </button>
    </form>
  );
}
```

### Form with Validation
```jsx
async function validateAndSubmit(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  const errors = {};

  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  try {
    await registerUser({ email, password });
    return { errors: {}, success: true };
  } catch (error) {
    return { errors: { submit: error.message }, success: false };
  }
}

function SignupForm() {
  const [state, formAction, isPending] = useActionState(validateAndSubmit, {
    errors: {},
    success: false
  });

  if (state.success) {
    return <div>Account created successfully!</div>;
  }

  return (
    <form action={formAction}>
      <div>
        <input name="email" type="email" placeholder="Email" required />
        {state.errors.email && <span className="error">{state.errors.email}</span>}
      </div>
      <div>
        <input name="password" type="password" placeholder="Password" required />
        {state.errors.password && <span className="error">{state.errors.password}</span>}
      </div>
      <div>
        <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
        {state.errors.confirmPassword && <span className="error">{state.errors.confirmPassword}</span>}
      </div>
      {state.errors.submit && <p className="error">{state.errors.submit}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

## Combining React 19 Hooks

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );

  async function addTodoAction(prevState, formData) {
    const text = formData.get('todo');
    const newTodo = { id: Date.now(), text, completed: false };

    addOptimisticTodo(newTodo);

    try {
      const saved = await saveTodo(newTodo);
      setTodos([...todos, saved]);
      return { error: null };
    } catch (error) {
      return { error: 'Failed to add todo' };
    }
  }

  const [state, formAction, isPending] = useActionState(addTodoAction, {
    error: null
  });

  return (
    <div>
      <form action={formAction}>
        <input name="todo" placeholder="New todo..." required />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Todo'}
        </button>
        {state.error && <p className="error">{state.error}</p>}
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

### use() Hook
- Always wrap components using `use()` in Suspense boundaries
- Use ErrorBoundary to handle promise rejections
- Avoid calling `use()` conditionally
- Can be called in loops and conditions (unlike other hooks)

### useOptimistic
- Show visual feedback for pending states (opacity, spinner)
- Always handle errors to revert optimistic updates
- Use for operations that are likely to succeed
- Don't use for critical operations that need confirmation

### useActionState
- Use with form actions for server interactions
- Handle loading states with `isPending`
- Validate data before submission
- Show clear error messages to users

## Migration from Older Patterns

### Before (Old Pattern)
```jsx
function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      await submitForm(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### After (React 19)
```jsx
function Form() {
  async function submitAction(prevState, formData) {
    try {
      await submitForm(formData);
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  const [state, formAction, isPending] = useActionState(submitAction, {
    error: null
  });

  return <form action={formAction}>...</form>;
}
```

## Common Use Cases

- **use()**: Data fetching, reading context
- **useOptimistic**: Like buttons, real-time updates, instant feedback
- **useActionState**: Form submissions, multi-step forms, authentication

# CRUD Operations

Complete guide to implementing Create, Read, Update, and Delete operations in React applications with practical patterns and examples.

## Basic CRUD with Local State

### Simple Todo CRUD
```jsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // CREATE
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };

    setTodos([...todos, todo]);
    setNewTodo('');
  };

  // READ - todos are already in state

  // UPDATE
  const handleUpdate = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // DELETE
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>

      {/* CREATE Form */}
      <form onSubmit={handleCreate}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
        />
        <button type="submit">Add</button>
      </form>

      {/* READ & UPDATE & DELETE */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(todo.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
                <button onClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.text);
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## CRUD with API Calls

### User Management System
```jsx
import { useState, useEffect } from 'react';

// Fake API service
const userAPI = {
  async getAll() {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  async getById(id) {
    const users = await this.getAll();
    return users.find(u => u.id === id);
  },

  async create(user) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await this.getAll();
    const newUser = { ...user, id: Date.now() };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return newUser;
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await this.getAll();
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
    localStorage.setItem('users', JSON.stringify(updated));
    return updated.find(u => u.id === id);
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await this.getAll();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
    return true;
  }
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  // READ - Load all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      setLoading(true);
      const newUser = await userAPI.create(formData);
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '', role: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setLoading(true);
      await userAPI.update(editingUser.id, formData);
      setUsers(users.map(u =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      setEditingUser(null);
      setFormData({ name: '', email: '', role: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      await userAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: '' });
  };

  if (loading && users.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Management</h1>

      {error && <div className="error">{error}</div>}

      {/* CREATE/UPDATE Form */}
      <form onSubmit={editingUser ? handleUpdate : handleCreate}>
        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {editingUser ? 'Update' : 'Create'}
        </button>
        {editingUser && (
          <button type="button" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      {/* READ - User List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => startEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## CRUD with Custom Hook

### Reusable CRUD Hook
```jsx
import { useState, useEffect } from 'react';

function useCRUD(apiService, initialData = []) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item) => {
    try {
      setLoading(true);
      const newItem = await apiService.create(item);
      setItems([...items, newItem]);
      setError(null);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updates) => {
    try {
      setLoading(true);
      const updated = await apiService.update(id, updates);
      setItems(items.map(item => item.id === id ? updated : item));
      setError(null);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      await apiService.delete(id);
      setItems(items.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: loadItems
  };
}

// Usage
function ProductList() {
  const {
    items: products,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem
  } = useCRUD(productAPI);

  return (
    <div>
      {/* Use products, createItem, updateItem, deleteItem */}
    </div>
  );
}
```

## CRUD with Optimistic Updates

### Social Media Post Manager
```jsx
import { useState, useOptimistic } from 'react';

function PostManager() {
  const [posts, setPosts] = useState([]);
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, { ...action.post, pending: true }];
        case 'update':
          return state.map(post =>
            post.id === action.id
              ? { ...post, ...action.updates, pending: true }
              : post
          );
        case 'delete':
          return state.filter(post => post.id !== action.id);
        default:
          return state;
      }
    }
  );

  const createPost = async (content) => {
    const newPost = { id: Date.now(), content, likes: 0 };
    addOptimisticPost({ type: 'add', post: newPost });

    try {
      const saved = await postAPI.create(newPost);
      setPosts([...posts, saved]);
    } catch (error) {
      console.error('Failed to create post');
    }
  };

  const updatePost = async (id, updates) => {
    addOptimisticPost({ type: 'update', id, updates });

    try {
      await postAPI.update(id, updates);
      setPosts(posts.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Failed to update post');
    }
  };

  const deletePost = async (id) => {
    addOptimisticPost({ type: 'delete', id });

    try {
      await postAPI.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post');
    }
  };

  const likePost = async (id) => {
    const post = posts.find(p => p.id === id);
    await updatePost(id, { likes: post.likes + 1 });
  };

  return (
    <div>
      <PostForm onSubmit={createPost} />
      <div>
        {optimisticPosts.map(post => (
          <Post
            key={post.id}
            post={post}
            onUpdate={updatePost}
            onDelete={deletePost}
            onLike={likePost}
          />
        ))}
      </div>
    </div>
  );
}
```

## CRUD with Form Actions (React 19)

### Contact Form with useActionState
```jsx
import { useActionState, useState } from 'react';

// Fake API
const contactAPI = {
  async create(contact) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const newContact = { ...contact, id: Date.now() };
    localStorage.setItem('contacts', JSON.stringify([...contacts, newContact]));
    return newContact;
  },

  async getAll() {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    return contacts;
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c);
    localStorage.setItem('contacts', JSON.stringify(updated));
    return updated.find(c => c.id === id);
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem('contacts', JSON.stringify(filtered));
  }
};

async function createContactAction(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');

  try {
    const contact = await contactAPI.create({ name, email, phone });
    return {
      success: true,
      message: 'Contact created successfully!',
      contact
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create contact',
      contact: null
    };
  }
}

function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [state, formAction, isPending] = useActionState(createContactAction, {
    success: null,
    message: '',
    contact: null
  });

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (state.success && state.contact) {
      setContacts([...contacts, state.contact]);
    }
  }, [state]);

  const loadContacts = async () => {
    const data = await contactAPI.getAll();
    setContacts(data);
  };

  const handleDelete = async (id) => {
    await contactAPI.delete(id);
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1>Contact Manager</h1>

      <form action={formAction}>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Add Contact'}
        </button>
      </form>

      {state.message && (
        <p style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}

      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <strong>{contact.name}</strong> - {contact.email}
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Pagination & Filtering

### Advanced Product Catalog
```jsx
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const loadProducts = async () => {
    setLoading(true);
    const data = await productAPI.getAll();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products
    .filter(p => !filters.category || p.category === filters.category)
    .filter(p => !filters.search ||
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <div>
        <input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => {
            setFilters({ ...filters, search: e.target.value });
            setPage(1);
          }}
        />
        <select
          value={filters.category}
          onChange={(e) => {
            setFilters({ ...filters, category: e.target.value });
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

## Best Practices

### Do
- Use unique IDs for all items (avoid array indices)
- Show loading states during operations
- Handle errors gracefully with user feedback
- Confirm destructive actions (delete)
- Use optimistic updates for better UX
- Validate data before submission
- Keep local and server state in sync

### Avoid
- Mutating state directly
- Forgetting to handle errors
- Not providing user feedback
- Using array index as key
- Blocking UI during operations
- Not confirming delete actions
- Incomplete error recovery

## Error Handling Pattern

```jsx
function ErrorBoundaryExample() {
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const handleOperation = async (operation) => {
    setError(null);
    setRetrying(false);

    try {
      await operation();
    } catch (err) {
      setError({
        message: err.message,
        retry: operation
      });
    }
  };

  const handleRetry = async () => {
    if (!error?.retry) return;
    setRetrying(true);
    await handleOperation(error.retry);
  };

  return (
    <div>
      {error && (
        <div className="error">
          <p>{error.message}</p>
          <button onClick={handleRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Common Use Cases

- Todo lists and task managers
- User management systems
- Product catalogs and inventories
- Blog and content management
- Contact and address books
- Shopping carts
- Social media feeds
- Comment systems

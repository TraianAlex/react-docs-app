import { useState, useEffect, FormEvent } from 'react';
import { userAPI } from '../shared/api/userAPI';
import type { User } from '../shared/types';
import UserForm from './UserForm';
import UserTable from './UserTable';
import CRUDOverview from './CRUDOverview';

export default function CRUDOperationsExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      setLoading(true);
      setError(null);
      const newUser = await userAPI.create(formData);
      setUsers([...users, newUser]);
      resetForm();
    } catch (err) {
      console.error('Failed to create user', err);
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setLoading(true);
      setError(null);
      await userAPI.update(editingUser.id, formData);
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      resetForm();
    } catch (err) {
      console.error('Failed to update user', err);
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      setError(null);
      await userAPI.delete(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'User', status: 'active' });
    setShowForm(false);
  };

  const toggleStatus = async (user: User) => {
    try {
      setLoading(true);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await userAPI.update(user.id, { status: newStatus });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    } catch (err) {
      console.error('Failed to update status', err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management System</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add New User'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      {showForm && (
        <UserForm
          formData={formData}
          editingUser={editingUser}
          loading={loading}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={resetForm}
          onChange={handleFormChange}
        />
      )}

      <UserTable
        users={users}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
        onRefresh={loadUsers}
      />

      <div className="mt-4">
        <CRUDOverview />
      </div>
    </div>
  );
}

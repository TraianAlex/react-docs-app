  import { FormEvent } from 'react';
import type { User } from '../shared/types';

interface Props {
  formData: {
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
  };
  editingUser: User | null;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars -- callback signature
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars -- callback signature
  onChange: (field: string, value: string) => void;
}

export default function UserForm({
  formData,
  editingUser,
  loading,
  onSubmit,
  onCancel,
  onChange,
}: Props) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4>{editingUser ? 'Edit User' : 'Create New User'}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="user-name" className="form-label">Name *</label>
              <input
                id="user-name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
                placeholder="Enter name"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="user-email" className="form-label">Email *</label>
              <input
                id="user-email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                required
                placeholder="Enter email"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="user-role" className="form-label">Role</label>
              <select
                id="user-role"
                className="form-select"
                value={formData.role}
                onChange={(e) => onChange('role', e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="user-status" className="form-label">Status</label>
              <select
                id="user-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => onChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editingUser ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{editingUser ? 'Update User' : 'Create User'}</>
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import type { User } from '../shared/types';

interface Props {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (user: User) => void;
  onRefresh: () => void;
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onRefresh,
}: Props) {
  if (loading && users.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center p-4">
            <div className="spinner-border" />
            <p className="mt-2">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center p-4 text-muted">
            <p>No users found. Create your first user!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Users ({users.length})</h4>
        <button className="btn btn-sm btn-outline-primary" onClick={onRefresh} disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : '🔄 Refresh'}
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <code>{user.id}</code>
                  </td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === 'Admin'
                          ? 'bg-danger'
                          : user.role === 'Manager'
                          ? 'bg-warning'
                          : 'bg-secondary'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        user.status === 'active' ? 'btn-success' : 'btn-secondary'
                      }`}
                      onClick={() => onToggleStatus(user)}
                      disabled={loading}
                    >
                      {user.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onEdit(user)}
                      disabled={loading}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(user.id)}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

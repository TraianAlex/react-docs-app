import { useState, useEffect } from 'react';
import { postAPI } from '../shared/api/postAPI';
import { delay } from '../shared/utils';
import type { Post } from '../shared/types';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const fetchUser = async (id: number): Promise<UserData> => {
  await delay(600);
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  };
};

export default function ParallelFetch() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [posts, user1, user2] = await Promise.all([
        postAPI.fetchPosts(1, 3),
        fetchUser(1),
        fetchUser(2),
      ]);

      setData({ posts, users: [user1, user2] });
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Parallel Data Fetching</h3>
        <p className="text-muted mb-0">
          Fetch multiple resources simultaneously with Promise.all
        </p>
      </div>
      <div className="card-body">
        {loading && (
          <div className="text-center p-4" role="status">
            <div className="spinner-border" />
            <p className="mt-2">Loading all data in parallel...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
            <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchAllData}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="row g-3">
            <div className="col-md-8">
              <h5>Posts</h5>
              {data.posts.map((post: Post) => (
                <div key={post.id} className="card mb-2">
                  <div className="card-body">
                    <h6 className="card-title">{post.title}</h6>
                    <p className="card-text small">{post.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-4">
              <h5>Users</h5>
              {data.users.map((user: UserData) => (
                <div key={user.id} className="card mb-2">
                  <div className="card-body">
                    <h6>{user.name}</h6>
                    <p className="small mb-0">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

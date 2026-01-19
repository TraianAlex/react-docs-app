import { useState, useEffect } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

export default function BasicFetch() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postAPI.fetchPosts(1, 5);
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Basic Fetch with useEffect</h3>
        <p className="text-muted mb-0">Simple data fetching with loading and error states</p>
      </div>
      <div className="card-body">
        {loading && (
          <div className="text-center p-4" role="status">
            <div className="spinner-border" />
            <p className="mt-2">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
            <button className="btn btn-sm btn-outline-danger ms-2" onClick={loadPosts}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={loadPosts} disabled={loading}>
                Refresh Posts
              </button>
            </div>
            <div className="row g-3">
              {posts.map((post) => (
                <div key={post.id} className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">{post.body}</p>
                      <p className="small">
                        <strong>Author:</strong> {post.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with React 19',
    body: 'Learn about the new features in React 19...',
    author: 'Alice',
    likes: 42,
  },
  {
    id: 2,
    title: 'Understanding Concurrent Features',
    body: 'Dive deep into useTransition and useDeferredValue...',
    author: 'Bob',
    likes: 38,
  },
  {
    id: 3,
    title: 'Optimistic UI Updates',
    body: 'Make your app feel faster with optimistic updates...',
    author: 'Charlie',
    likes: 56,
  },
];

export default function OptimisticLikes() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || post.likes === undefined) return;

    // Optimistic update
    setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p)));
    setError(null);

    try {
      const newLikes = await postAPI.likePost(postId, post.likes);
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)));
    } catch (err) {
      // Revert on error
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: post.likes } : p)));
      setError('Failed to like post. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Optimistic Likes</h3>
        <p className="text-muted mb-0">
          Like buttons update instantly. If the request fails, the like is automatically reverted.
        </p>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        <div className="row g-3">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text-muted">{post.body}</p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <button className="btn btn-outline-danger" onClick={() => handleLike(post.id)}>
                    ❤️ {post.likes}
                  </button>
                  <small className="text-muted">Click to like</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

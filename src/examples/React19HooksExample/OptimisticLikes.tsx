import { useOptimistic, useState, useTransition } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

type PostWithPending = Post & { pending: boolean };

const initialPosts: PostWithPending[] = [
  {
    id: 1,
    title: 'Getting Started with React 19',
    body: 'Learn about the new features in React 19...',
    author: 'Alice',
    likes: 42,
    pending: false,
  },
  {
    id: 2,
    title: 'Understanding Concurrent Features',
    body: 'Dive deep into useTransition and useDeferredValue...',
    author: 'Bob',
    likes: 38,
    pending: false,
  },
  {
    id: 3,
    title: 'Optimistic UI Updates',
    body: 'Make your app feel faster with optimistic updates...',
    author: 'Charlie',
    likes: 56,
    pending: false,
  },
];

export default function OptimisticLikes() {
  const [posts, setPosts] = useState<PostWithPending[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);

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
      // Optimistic update (likes only)
      addOptimisticLike(postId);
      setError(null);

      try {
        const newLikes = await postAPI.likePost(postId, post.likes);
        setPosts((current) =>
          current.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)),
        );
      } catch (err) {
        console.error('Failed to like post', err);
        // Revert on error
        setPosts((current) =>
          current.map((p) =>
            p.id === postId ? { ...p, likes: post.likes } : p,
          ),
        );
        setError('Failed to like post. Please try again.');
      }
    });
  };

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Optimistic Likes</h3>
        <p className='text-muted mb-0'>
          Like buttons update instantly. If the request fails, the like is
          automatically reverted.
        </p>
      </div>
      <div className='card-body'>
        {error && (
          <div className='alert alert-danger alert-dismissible'>
            {error}
            <button
              type='button'
              className='btn-close'
              onClick={() => setError(null)}
            />
          </div>
        )}

        <div className='row g-3'>
          {optimisticPosts.map((post) => (
            <div key={post.id} className='col-md-4'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h5 className='card-title'>{post.title}</h5>
                  <p className='card-text text-muted'>{post.body}</p>
                </div>
                <div className='card-footer d-flex justify-content-between align-items-center'>
                  <button
                    className='btn btn-outline-danger'
                    onClick={() => handleLike(post.id)}
                    disabled={isPending}
                  >
                    ❤️ {post.likes}{' '}
                    {isPending && post.pending ? (
                      <span className='spinner-border spinner-border-sm ms-2'>
                        <span className='visually-hidden'>Loading...</span>
                      </span>
                    ) : null}
                  </button>
                  <small className='text-muted'>Click to like</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

export default function InfiniteScroll() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newPosts = await postAPI.fetchPosts(page, 10);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to load more posts', err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore(); // Initial load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Infinite Scroll</h3>
        <p className="text-muted mb-0">
          Automatically loads more posts when you scroll to the bottom
        </p>
      </div>
      <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <div className="list-group">
          {posts.map((post) => (
            <div key={post.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{post.title}</h6>
                  <p className="mb-1 small">{post.body}</p>
                  <small className="text-muted">By {post.author}</small>
                </div>
                <span className="badge bg-primary">{post.id}</span>
              </div>
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="text-center p-3">
          {loading && (
            <div role="status">
              <div className="spinner-border spinner-border-sm me-2" />
              <span>Loading more posts...</span>
            </div>
          )}
          {!hasMore && <div className="text-muted">No more posts to load</div>}
        </div>
      </div>
      <div className="card-footer">
        <small className="text-muted">Loaded {posts.length} posts</small>
      </div>
    </div>
  );
}

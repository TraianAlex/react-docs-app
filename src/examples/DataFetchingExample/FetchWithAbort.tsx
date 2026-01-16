import { useState, useEffect, useRef } from 'react';
import { postAPI } from '../shared/api/postAPI';
import type { Post } from '../shared/types';

export default function FetchWithAbort() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const search = async () => {
      try {
        setLoading(true);
        const data = await postAPI.searchPosts(query);
        if (!abortController.signal.aborted) {
          setResults(data);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Search failed:', err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(search, 500); // Debounce

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [query]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Fetch with AbortController</h3>
        <p className="text-muted mb-0">
          Search with automatic cancellation of previous requests
        </p>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="alert alert-info">
            <span className="spinner-border spinner-border-sm me-2" />
            Searching for "{query}"...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="list-group">
            {results.map((result) => (
              <div key={result.id} className="list-group-item">
                <h6 className="mb-1">{result.title}</h6>
                <p className="mb-1 small text-muted">{result.body}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="alert alert-warning">No results found for "{query}"</div>
        )}

        {!query && <div className="text-muted text-center p-4">Start typing to search...</div>}
      </div>
    </div>
  );
}

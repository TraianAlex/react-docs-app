import { useState, useDeferredValue, useMemo } from 'react';
import { expensiveFilter, type Item } from './itemGenerator';

interface Props {
  allItems: Item[];
}

export default function UseDeferredValueDemo({ allItems }: Props) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const isStale = query !== deferredQuery;

  const filteredItems = useMemo(() => {
    return expensiveFilter(allItems, deferredQuery);
  }, [allItems, deferredQuery]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>useDeferredValue Example</h3>
        <p className="text-muted mb-0">
          Type to search. The UI shows stale content with reduced opacity while updating.
        </p>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {isStale && (
          <div className="alert alert-warning">
            <div className="spinner-border spinner-border-sm me-2" />
            Updating results for "{query}"...
          </div>
        )}

        <div className="alert alert-info">
          Showing results for: <strong>{deferredQuery || '(all items)'}</strong>
          <br />
          Found {filteredItems.length.toLocaleString()} items
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table
            className="table table-sm table-striped"
            style={{
              opacity: isStale ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, 50).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <span className="badge bg-secondary">{item.category}</span>
                  </td>
                  <td className="text-muted small">{item.description}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length > 50 && (
            <p className="text-muted text-center">
              Showing first 50 of {filteredItems.length} results
            </p>
          )}
        </div>
      </div>

      <div className="card-footer">
        <h4>Key Differences</h4>
        <div className="row">
          <div className="col-md-6">
            <h5>useTransition</h5>
            <ul>
              <li>You control the state update</li>
              <li>Returns isPending flag</li>
              <li>Good for: tab switching, navigation</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>useDeferredValue</h5>
            <ul>
              <li>Defers a specific value</li>
              <li>Compare values to detect staleness</li>
              <li>Good for: search inputs, filtering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

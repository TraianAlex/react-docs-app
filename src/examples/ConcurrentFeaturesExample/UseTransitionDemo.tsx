import { useState, useTransition } from 'react';
import { expensiveFilter, type Item } from './itemGenerator';

interface Props {
  allItems: Item[];
}

export default function UseTransitionDemo({ allItems }: Props) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(allItems);

  const handleSearch = (value: string) => {
    setQuery(value); // Urgent: update input immediately

    startTransition(() => {
      // Non-urgent: update results without blocking
      const filtered = expensiveFilter(allItems, value);
      setFilteredItems(filtered);
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>useTransition Example</h3>
        <p className="text-muted mb-0">
          Type to search {allItems.length.toLocaleString()} items. The input stays responsive while
          filtering happens in the background.
        </p>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search items..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {isPending ? (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" />
            Filtering {allItems.length.toLocaleString()} items...
          </div>
        ) : (
          <div className="alert alert-success">
            Found {filteredItems.length.toLocaleString()} items
          </div>
        )}

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody style={{ opacity: isPending ? 0.6 : 1 }}>
              {filteredItems.slice(0, 50).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <span className="badge bg-secondary">{item.category}</span>
                  </td>
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
    </div>
  );
}

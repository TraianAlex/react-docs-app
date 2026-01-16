import { useMemo, useState } from 'react';

export default function BestPracticesExample() {
  const [query, setQuery] = useState('');
  const teammates = useMemo(
    () => ['Ava', 'Kai', 'Riley', 'Jamie', 'Sasha'],
    []
  );

  const filtered = useMemo(
    () =>
      teammates.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, teammates]
  );

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Invite teammates</h3>
      <input
          className='form-control'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Search teammates'
      />
        <ul className='list-group list-group-flush'>
          {filtered.map((name) => (
            <li key={name} className='list-group-item px-0'>
              <span className='badge text-bg-primary rounded-pill me-2'>
                {name.slice(0, 1)}
              </span>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

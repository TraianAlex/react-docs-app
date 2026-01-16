import { useState } from 'react';

export default function ConditionalListsExample() {
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const tasks = [
    { id: 1, label: 'Review onboarding flow', status: 'open' },
    { id: 2, label: 'Prepare release notes', status: 'done' },
    { id: 3, label: 'Schedule demo', status: 'open' },
  ] as const;

  const filtered = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Team tasks</h3>
        <div className='d-flex align-items-center gap-2 flex-wrap'>
        {(['all', 'open', 'done'] as const).map((value) => (
          <button
            key={value}
            className={`btn btn-sm ${
              filter === value ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
        </div>
        <ul className='list-group list-group-flush'>
          {filtered.map((task) => (
            <li key={task.id} className='list-group-item px-0'>
              <span
                className={`badge rounded-pill ${
                  task.status === 'open' ? 'text-bg-danger' : 'text-bg-success'
                }`}
              >
                {task.status}
              </span>{' '}
              {task.label}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className='list-group-item px-0 text-secondary'>
              No tasks to show.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

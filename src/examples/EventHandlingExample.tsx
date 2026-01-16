import { useState } from 'react';

export default function EventHandlingExample() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Campaign draft</h3>
        <p className='text-secondary mb-1'>Save your progress as you go.</p>
      <button
        className={`btn ${isSaved ? 'btn-success' : 'btn-primary'}`}
        onClick={() => setIsSaved((prev) => !prev)}
      >
        {isSaved ? 'Saved ✓' : 'Save draft'}
      </button>
      </div>
    </div>
  );
}

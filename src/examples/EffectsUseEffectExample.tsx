import { useEffect, useState } from 'react';

export default function EffectsUseEffectExample() {
  const [lastSynced, setLastSynced] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSynced(new Date());
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Live status</h3>
        <p className='text-secondary mb-1'>Syncing data from your workspace.</p>
        <div className='d-flex align-items-center gap-2'>
          <span className='badge text-bg-success'>Live</span>
          <span>Last synced at {lastSynced.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

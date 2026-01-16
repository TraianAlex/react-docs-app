import { useState, useMemo } from 'react';
import UseTransitionDemo from './UseTransitionDemo';
import UseDeferredValueDemo from './UseDeferredValueDemo';
import { generateItems } from './itemGenerator';

export default function ConcurrentFeaturesExample() {
  const [activeTab, setActiveTab] = useState<'transition' | 'deferred'>('transition');

  // Generate items once and memoize
  const allItems = useMemo(() => generateItems(5000), []);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Concurrent Features Demo</h2>

      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn ${activeTab === 'transition' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('transition')}
          >
            useTransition Demo
          </button>
          <button
            className={`btn ${activeTab === 'deferred' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('deferred')}
          >
            useDeferredValue Demo
          </button>
        </div>
      </div>

      {activeTab === 'transition' && <UseTransitionDemo allItems={allItems} />}
      {activeTab === 'deferred' && <UseDeferredValueDemo allItems={allItems} />}
    </div>
  );
}

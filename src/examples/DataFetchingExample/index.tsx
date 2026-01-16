import { useState } from 'react';
import BasicFetch from './BasicFetch';
import FetchWithAbort from './FetchWithAbort';
import ParallelFetch from './ParallelFetch';
import InfiniteScroll from './InfiniteScroll';

export default function DataFetchingExample() {
  const [activeTab, setActiveTab] = useState<'basic' | 'abort' | 'parallel' | 'infinite'>(
    'basic'
  );

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Data Fetching Patterns</h2>

      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn ${activeTab === 'basic' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Fetch
          </button>
          <button
            className={`btn ${activeTab === 'abort' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('abort')}
          >
            With Abort
          </button>
          <button
            className={`btn ${activeTab === 'parallel' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('parallel')}
          >
            Parallel Fetch
          </button>
          <button
            className={`btn ${activeTab === 'infinite' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('infinite')}
          >
            Infinite Scroll
          </button>
        </div>
      </div>

      {activeTab === 'basic' && <BasicFetch />}
      {activeTab === 'abort' && <FetchWithAbort />}
      {activeTab === 'parallel' && <ParallelFetch />}
      {activeTab === 'infinite' && <InfiniteScroll />}
    </div>
  );
}

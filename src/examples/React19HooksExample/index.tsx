import { useState } from 'react';
import OptimisticTodos from './OptimisticTodos';
import OptimisticLikes from './OptimisticLikes';
import OptimisticProfile from './OptimisticProfile';

export default function React19HooksExample() {
  const [activeTab, setActiveTab] = useState<'optimistic' | 'likes' | 'profile'>('optimistic');

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">React 19 Hooks Demo</h2>

      <div className="alert alert-info mb-4">
        <strong>Note:</strong> These examples demonstrate optimistic UI updates using React 19's
        useOptimistic hook. Updates are applied immediately, then reverted if the server request
        fails.
      </div>

      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn ${activeTab === 'optimistic' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('optimistic')}
          >
            Optimistic Todos
          </button>
          <button
            className={`btn ${activeTab === 'likes' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('likes')}
          >
            Optimistic Likes
          </button>
          <button
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('profile')}
          >
            Optimistic Updates
          </button>
        </div>
      </div>

      {activeTab === 'optimistic' && <OptimisticTodos />}
      {activeTab === 'likes' && <OptimisticLikes />}
      {activeTab === 'profile' && <OptimisticProfile />}
    </div>
  );
}

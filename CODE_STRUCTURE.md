# Code Structure

This document explains the refactored code structure following React best practices.

## Directory Structure

```
src/examples/
├── shared/                          # Shared utilities and APIs
│   ├── types.ts                     # Common TypeScript types
│   ├── utils.ts                     # Utility functions (delay, generateId, etc.)
│   └── api/                         # Fake API modules
│       ├── userAPI.ts               # User CRUD operations
│       ├── postAPI.ts               # Post fetching and operations
│       ├── todoAPI.ts               # Todo operations
│       └── profileAPI.ts            # Profile update operations
│
├── ConcurrentFeaturesExample/       # React 18+ concurrent features
│   ├── index.tsx                    # Main component & tab navigation
│   ├── UseTransitionDemo.tsx       # useTransition demonstration
│   ├── UseDeferredValueDemo.tsx    # useDeferredValue demonstration
│   └── itemGenerator.ts             # Data generation & filtering utility
│
├── React19HooksExample/             # React 19 new hooks
│   ├── index.tsx                    # Main component & tab navigation
│   ├── OptimisticTodos.tsx          # useOptimistic with todos
│   ├── OptimisticLikes.tsx          # useOptimistic with likes
│   └── OptimisticProfile.tsx        # useOptimistic with profile updates
│
├── CRUDOperationsExample/           # Full CRUD operations demo
│   ├── index.tsx                    # Main component & state management
│   ├── UserForm.tsx                 # Create/Update form component
│   ├── UserTable.tsx                # Read/Delete table component
│   └── CRUDOverview.tsx             # Informational overview card
│
├── DataFetchingExample/             # Data fetching patterns
│   ├── index.tsx                    # Main component & tab navigation
│   ├── BasicFetch.tsx               # Simple useEffect fetch
│   ├── FetchWithAbort.tsx           # AbortController pattern
│   ├── ParallelFetch.tsx            # Promise.all pattern
│   └── InfiniteScroll.tsx           # Intersection Observer pattern
│
└── examples.tsx                     # Registry of all examples
```

## Best Practices Applied

### 1. **Component Separation**
Each component is in its own file, making it:
- Easy to find and edit
- Testable in isolation
- Reusable across the application
- Following single responsibility principle

### 2. **Shared Code Organization**
Common code is extracted into a `shared/` folder:
- **types.ts**: Shared TypeScript interfaces
- **utils.ts**: Reusable utility functions
- **api/**: API layer separated by domain (users, posts, todos, profiles)

### 3. **Folder-Based Examples**
Each example feature has its own folder:
- **index.tsx**: Main component that orchestrates child components
- **Child components**: Specific UI/logic sections
- **Utilities**: Feature-specific helpers (e.g., itemGenerator.ts)

### 4. **Clear Naming Conventions**
- Components: PascalCase (e.g., `UserForm.tsx`)
- Utilities: camelCase (e.g., `itemGenerator.ts`)
- APIs: camelCase with "API" suffix (e.g., `userAPI.ts`)
- Types: Exported interfaces in PascalCase

### 5. **Separation of Concerns**
- **API layer**: All data fetching logic
- **Components**: UI and user interactions
- **Utilities**: Pure functions and helpers
- **Types**: Shared data structures

## Example Structure Pattern

Each example follows this pattern:

```typescript
// index.tsx - Main orchestrator
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

export default function Example() {
  const [state, setState] = useState();

  return (
    <div>
      <ComponentA onAction={handleAction} />
      <ComponentB data={state} />
    </div>
  );
}

// ComponentA.tsx - Focused component
interface Props {
  onAction: () => void;
}

export default function ComponentA({ onAction }: Props) {
  // Specific logic for ComponentA
  return <div>...</div>;
}
```

## Benefits

1. **Maintainability**: Easy to locate and modify specific components
2. **Scalability**: Can add new components without bloating existing files
3. **Testability**: Each component can be tested independently
4. **Reusability**: Components and utilities can be imported anywhere
5. **Collaboration**: Multiple developers can work on different files
6. **Code Review**: Smaller, focused changes are easier to review
7. **Performance**: Better tree-shaking and code splitting

## Shared API Examples

```typescript
// Using shared APIs
import { userAPI } from '../shared/api/userAPI';
import { postAPI } from '../shared/api/postAPI';
import type { User, Post } from '../shared/types';

const users = await userAPI.getAll();
const posts = await postAPI.fetchPosts(1, 10);
```

## Adding New Examples

To add a new example:

1. Create a new folder: `src/examples/NewExample/`
2. Add `index.tsx` as the main component
3. Split complex logic into separate component files
4. Use shared utilities from `shared/`
5. Add types to `shared/types.ts` if reusable
6. Register in `examples.tsx`

Example:
```typescript
// src/examples/NewExample/index.tsx
export default function NewExample() {
  return <div>New Example</div>;
}

// src/examples/examples.tsx
import NewExample from './NewExample/index';

export const examples = [
  // ... existing examples
  {
    slug: 'new-example',
    title: 'New Example',
    description: 'Description',
    element: <NewExample />,
  },
];
```

## File Naming Conventions

- **Component files**: `ComponentName.tsx` (PascalCase)
- **Utility files**: `utilityName.ts` (camelCase)
- **API files**: `domainAPI.ts` (camelCase with API suffix)
- **Type files**: `types.ts` (lowercase)
- **Index files**: `index.tsx` (lowercase)

## Import/Export Patterns

```typescript
// Named exports for utilities and APIs
export const userAPI = { ... };
export const delay = (ms: number) => { ... };

// Default exports for React components
export default function MyComponent() { ... }

// Type exports
export type { User, Post } from './types';
```

This structure makes the codebase professional, maintainable, and scalable while following React and TypeScript best practices.

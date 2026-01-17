# Test Suite Documentation

This document provides comprehensive information about the test suite for the React documentation application.

## Overview

The test suite provides extensive coverage for all React example components, utilities, and API modules. Tests are written using **Vitest** and **React Testing Library**, following modern testing best practices.

## Test Structure

```
src/
├── test/
│   └── setup.ts                              # Global test configuration
├── examples/
│   ├── shared/
│   │   ├── utils.test.ts                     # Utility function tests
│   │   ├── api/
│   │   │   ├── userAPI.test.ts              # User API tests
│   │   │   ├── todoAPI.test.ts              # Todo API tests
│   │   │   ├── postAPI.test.ts              # Post API tests
│   │   │   └── profileAPI.test.ts           # Profile API tests
│   ├── ConcurrentFeaturesExample/
│   │   ├── itemGenerator.test.ts             # Item generator utility tests
│   │   ├── UseTransitionDemo.test.tsx        # useTransition hook tests
│   │   └── UseDeferredValueDemo.test.tsx     # useDeferredValue hook tests
│   ├── React19HooksExample/
│   │   ├── OptimisticTodos.test.tsx          # Optimistic todos tests
│   │   ├── OptimisticLikes.test.tsx          # Optimistic likes tests
│   │   └── OptimisticProfile.test.tsx        # Optimistic profile tests
│   ├── CRUDOperationsExample/
│   │   ├── UserForm.test.tsx                 # User form component tests
│   │   ├── UserTable.test.tsx                # User table component tests
│   │   └── CRUDOverview.test.tsx             # CRUD overview tests
│   └── DataFetchingExample/
│       ├── BasicFetch.test.tsx               # Basic fetch tests
│       ├── FetchWithAbort.test.tsx           # Abort controller tests
│       ├── ParallelFetch.test.tsx            # Parallel fetching tests
│       └── InfiniteScroll.test.tsx           # Infinite scroll tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Advanced Options

```bash
# Run specific test file
npm test -- src/examples/shared/utils.test.ts

# Run tests matching pattern
npm test -- --grep "should render"

# Run tests in a specific folder
npm test -- src/examples/ConcurrentFeaturesExample

# Run with verbose output
npm test -- --reporter=verbose
```

## Test Categories

### 1. Shared Utilities Tests (`shared/utils.test.ts`)

**Coverage:**
- `delay()` - Async delay function
- `generateId()` - ID generation based on timestamp
- `randomFromArray()` - Random element selection

**Key Features:**
- Fake timers for delay testing
- Timestamp validation
- Type safety verification

### 2. API Module Tests

#### User API (`shared/api/userAPI.test.ts`)
Tests CRUD operations with localStorage:
- Reading default and stored users
- Creating users with generated IDs
- Updating user fields
- Deleting users
- Error handling for missing users

#### Todo API (`shared/api/todoAPI.test.ts`)
Tests todo operations with simulated failures:
- Adding todos with random IDs
- Deleting todos
- Updating todo properties
- 5% random failure simulation

#### Post API (`shared/api/postAPI.test.ts`)
Tests post operations:
- Fetching posts with pagination
- Searching posts
- Creating, updating, and deleting posts
- Liking posts with optimistic updates
- 10% random failure simulation for likes

#### Profile API (`shared/api/profileAPI.test.ts`)
Tests profile updates:
- Updating profile fields
- Partial updates
- 10% random failure simulation

### 3. Concurrent Features Tests

#### Item Generator (`ConcurrentFeaturesExample/itemGenerator.test.ts`)
- Item generation with correct structure
- Category rotation
- Price range validation
- Expensive filter simulation (20ms delay)
- Case-insensitive filtering

#### useTransition Demo (`ConcurrentFeaturesExample/UseTransitionDemo.test.tsx`)
- Initial rendering with all items
- Search input updates
- Pending state indicators
- Filtered results display
- Table opacity changes during transitions
- Accessibility features

#### useDeferredValue Demo (`ConcurrentFeaturesExample/UseDeferredValueDemo.test.tsx`)
- Deferred value behavior
- Stale state detection
- Search result updates
- Educational content display
- Comparison between useTransition and useDeferredValue

### 4. React 19 Hooks Tests

#### Optimistic Todos (`React19HooksExample/OptimisticTodos.test.tsx`)
**Tests:**
- Initial todo rendering
- Optimistic todo addition
- Pending state indicators
- Todo deletion with rollback
- Error handling and display
- Form submission

**Key Patterns:**
- `useOptimistic` hook testing
- Mocked API calls
- Error recovery
- Input validation

#### Optimistic Likes (`React19HooksExample/OptimisticLikes.test.tsx`)
**Tests:**
- Post rendering
- Optimistic like increments
- Like count reversion on error
- Multiple post interactions
- Error messaging

**Key Patterns:**
- Immediate UI updates
- Server response handling
- Error state management

#### Optimistic Profile (`React19HooksExample/OptimisticProfile.test.tsx`)
**Tests:**
- Profile field rendering
- Optimistic field updates
- Saving indicators
- Field-specific error messages
- Profile display synchronization

**Key Patterns:**
- Per-field updates
- Optimistic UI patterns
- Form state management

### 5. CRUD Operations Tests

#### User Form (`CRUDOperationsExample/UserForm.test.tsx`)
**Tests:**
- Form field rendering
- Input change handlers
- Form submission
- Loading states
- Create vs. Edit mode
- Required field validation
- Accessibility attributes

#### User Table (`CRUDOperationsExample/UserTable.test.tsx`)
**Tests:**
- User list rendering
- Edit/Delete button interactions
- Status toggle functionality
- Role badge display
- Loading states
- Empty state handling
- Refresh functionality

#### CRUD Overview (`CRUDOperationsExample/CRUDOverview.test.tsx`)
**Tests:**
- Static content rendering
- Layout structure
- Educational content display

### 6. Data Fetching Tests

#### Basic Fetch (`DataFetchingExample/BasicFetch.test.tsx`)
**Tests:**
- Initial data loading
- Loading state display
- Post rendering
- Refresh functionality
- Error handling
- Retry mechanism

**Key Patterns:**
- useEffect data fetching
- Loading/error/success states
- Manual refresh triggers

#### Fetch with Abort (`DataFetchingExample/FetchWithAbort.test.tsx`)
**Tests:**
- Search input updates
- Debounced search requests (500ms)
- Search result display
- Empty result handling
- AbortController usage
- Request cancellation

**Key Patterns:**
- Debouncing implementation
- AbortController cleanup
- Search UX optimization

#### Parallel Fetch (`DataFetchingExample/ParallelFetch.test.tsx`)
**Tests:**
- Simultaneous data fetching
- Promise.all usage
- Multiple data source display
- Error handling for parallel requests
- Loading state management

**Key Patterns:**
- Concurrent API calls
- Combined data display
- Performance optimization

#### Infinite Scroll (`DataFetchingExample/InfiniteScroll.test.tsx`)
**Tests:**
- Initial page load
- IntersectionObserver setup
- Scroll-triggered loading
- Post appending
- End-of-content detection
- Observer cleanup on unmount

**Key Patterns:**
- IntersectionObserver API
- Pagination logic
- Sentinel element usage
- Performance considerations

## Testing Patterns

### 1. Component Testing Pattern (Arrange-Act-Assert)

```typescript
it('should display user name after loading', async () => {
  // Arrange
  vi.mocked(userAPI.getAll).mockResolvedValue([mockUser]);

  // Act
  render(<UserComponent />);

  // Assert
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### 2. User Interaction Testing

```typescript
it('should submit form on button click', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<Form onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalled();
});
```

### 3. Async Operations Testing

```typescript
it('should show loading state while fetching', async () => {
  vi.mocked(api.fetch).mockImplementation(
    () => new Promise(() => {}) // Never resolves
  );

  render(<Component />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

### 4. Error Handling Testing

```typescript
it('should display error message on failure', async () => {
  vi.mocked(api.fetch).mockRejectedValue(new Error('Network error'));

  render(<Component />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### 5. Optimistic UI Testing

```typescript
it('should show optimistic update immediately', async () => {
  const user = userEvent.setup();

  render(<OptimisticComponent />);

  await user.click(screen.getByRole('button', { name: /add/i }));

  // Should appear immediately
  expect(screen.getByText('New Item')).toBeInTheDocument();

  // With pending indicator
  expect(screen.getByText('Saving...')).toBeInTheDocument();
});
```

## Mocking Strategy

### 1. API Mocking

```typescript
vi.mock('../shared/api/userAPI');

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(userAPI.getAll).mockResolvedValue(mockUsers);
});
```

### 2. localStorage Mocking

Global mock in `test/setup.ts`:
```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageMock as Storage;
```

### 3. IntersectionObserver Mocking

```typescript
class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver as any;
```

### 4. Random Function Mocking

```typescript
// For tests with random failures
vi.spyOn(Math, 'random').mockReturnValue(0.5); // Success
vi.spyOn(Math, 'random').mockReturnValue(0.96); // Failure
```

## Best Practices

### 1. Test Isolation
- Each test is independent
- `beforeEach` clears all mocks
- localStorage is reset between tests
- No shared state between tests

### 2. User-Centric Testing
- Use `screen.getByRole()` for semantic queries
- Test accessibility attributes
- Focus on user interactions, not implementation
- Use `user-event` library for realistic interactions

### 3. Async Testing
- Always use `async/await` with user-event
- Use `waitFor()` for async state changes
- Set appropriate timeouts for debounced operations
- Handle loading states explicitly

### 4. Accessibility Testing
- Test keyboard navigation
- Verify ARIA attributes
- Check semantic HTML usage
- Test screen reader content

### 5. Error Boundary Testing
- Test both success and failure paths
- Verify error messages are displayed
- Test retry mechanisms
- Check error state cleanup

## Common Patterns

### Testing Forms

```typescript
describe('UserForm', () => {
  it('should validate required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<UserForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // HTML5 validation prevents submission
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

### Testing Lists

```typescript
it('should render all users', () => {
  render(<UserList users={mockUsers} />);

  mockUsers.forEach(user => {
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
});
```

### Testing Loading States

```typescript
it('should show spinner while loading', () => {
  vi.mocked(api.fetch).mockImplementation(
    () => new Promise(() => {})
  );

  render(<Component />);

  const spinner = screen.getByRole('status');
  expect(spinner).toBeInTheDocument();
});
```

### Testing Debounced Operations

```typescript
it('should debounce search input', async () => {
  const user = userEvent.setup();

  render(<SearchComponent />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'query');

  // Should not search immediately
  expect(api.search).not.toHaveBeenCalled();

  // Wait for debounce
  await waitFor(() => {
    expect(api.search).toHaveBeenCalledWith('query');
  }, { timeout: 2000 });
});
```

## Troubleshooting

### Common Issues

#### 1. "Unable to find element" errors
- Use `waitFor()` for async content
- Check if element is conditionally rendered
- Verify correct query method (role, label, text)

#### 2. "Not wrapped in act(...)" warnings
- Ensure `user-event` actions use `await`
- Wrap state updates in `waitFor()`
- Check for missing async/await

#### 3. Timer-related test failures
- Use real timers for debounce tests
- Avoid mixing fake and real timers
- Clean up timers in afterEach

#### 4. Flaky tests
- Mock random functions
- Add delays for timestamp-based IDs
- Use proper wait conditions
- Avoid hardcoded timeouts

### Debug Tips

```typescript
// Print component tree
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Query all matching elements
screen.logTestingPlaygroundURL();

// Check what queries are available
screen.getByRole(''); // Logs available roles
```

## Coverage Goals

Current coverage targets:
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

## Contributing

When adding new tests:

1. **Follow existing patterns** - Match the structure of similar tests
2. **Test behavior, not implementation** - Focus on what users see
3. **Use descriptive test names** - Clearly state what is being tested
4. **Group related tests** - Use `describe` blocks effectively
5. **Test edge cases** - Include error states and boundary conditions
6. **Keep tests focused** - One assertion concept per test
7. **Mock external dependencies** - Isolate the component under test
8. **Clean up after tests** - Reset mocks and state in `beforeEach`/`afterEach`

## Performance Considerations

- Tests run in parallel by default
- Use `describe.sequential()` for tests that must run in order
- Mock expensive operations (API calls, heavy computations)
- Avoid unnecessary renders with proper mocking
- Use `screen` queries efficiently

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

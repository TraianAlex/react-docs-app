import type { ReactNode } from 'react';
import BestPracticesExample from './BestPracticesExample';
import ComponentsPropsExample from './ComponentsPropsExample';
import ConditionalListsExample from './ConditionalListsExample';
import ContextApiExample from './ContextApiExample';
import CustomHooksExample from './CustomHooksExample';
import EffectsUseEffectExample from './EffectsUseEffectExample';
import EventHandlingExample from './EventHandlingExample';
import FormsExample from './FormsExample';
import StateUseStateExample from './StateUseStateExample';
import ConcurrentFeaturesExample from './ConcurrentFeaturesExample/index';
import React19HooksExample from './React19HooksExample/index';
import CRUDOperationsExample from './CRUDOperationsExample/index';
import DataFetchingExample from './DataFetchingExample/index';

export type ExampleEntry = {
  slug: string;
  title: string;
  description: string;
  element: ReactNode;
};

export const examples: ExampleEntry[] = [
  {
    slug: 'components-props',
    title: 'Components & Props in practice',
    description: 'Reusable product cards powered by props.',
    element: <ComponentsPropsExample />,
  },
  {
    slug: 'state-usestate',
    title: 'State Management in practice',
    description: 'Seat selector with derived totals.',
    element: <StateUseStateExample />,
  },
  {
    slug: 'effects-useeffect',
    title: 'Effects in practice',
    description: 'Live sync indicator with cleanup.',
    element: <EffectsUseEffectExample />,
  },
  {
    slug: 'event-handling',
    title: 'Event Handling in practice',
    description: 'Save button with immediate feedback.',
    element: <EventHandlingExample />,
  },
  {
    slug: 'conditional-lists',
    title: 'Conditional Rendering & Lists in practice',
    description: 'Filter tasks with conditional empty state.',
    element: <ConditionalListsExample />,
  },
  {
    slug: 'forms',
    title: 'Forms in practice',
    description: 'A controlled support form with validation.',
    element: <FormsExample />,
  },
  {
    slug: 'context-api',
    title: 'Context API in practice',
    description: 'Theme toggle shared across components.',
    element: <ContextApiExample />,
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks in practice',
    description: 'Local storage hook for draft notes.',
    element: <CustomHooksExample />,
  },
  {
    slug: 'best-practices',
    title: 'Best Practices & Patterns in practice',
    description: 'Searchable invite list with memoized filtering.',
    element: <BestPracticesExample />,
  },
  {
    slug: 'concurrent-features',
    title: 'Concurrent Features in practice',
    description: 'Interactive demos of useTransition and useDeferredValue.',
    element: <ConcurrentFeaturesExample />,
  },
  {
    slug: 'react19-hooks',
    title: 'React 19 Hooks in practice',
    description: 'Optimistic UI updates with useOptimistic.',
    element: <React19HooksExample />,
  },
  {
    slug: 'crud-operations',
    title: 'CRUD Operations in practice',
    description: 'Full-featured user management system with fake API.',
    element: <CRUDOperationsExample />,
  },
  {
    slug: 'data-fetching',
    title: 'Data Fetching Patterns in practice',
    description: 'Various data fetching patterns including infinite scroll.',
    element: <DataFetchingExample />,
  },
];

export const getExampleBySlug = (slug: string) =>
  examples.find((example) => example.slug === slug);

import componentsProps from '../content/01-components-props.md?raw';
import stateUseState from '../content/02-state-useState.md?raw';
import effectsUseEffect from '../content/03-effects-useEffect.md?raw';
import eventHandling from '../content/04-event-handling.md?raw';
import conditionalLists from '../content/05-conditional-lists.md?raw';
import forms from '../content/06-forms.md?raw';
import contextApi from '../content/07-context-api.md?raw';
import customHooks from '../content/08-custom-hooks.md?raw';
import bestPractices from '../content/09-best-practices.md?raw';
import concurrentFeatures from '../content/10-concurrent-features.md?raw';
import react19Hooks from '../content/11-react19-hooks.md?raw';
import crudOperations from '../content/12-crud-operations.md?raw';
import dataFetching from '../content/13-data-fetching.md?raw';
import readme from '../content/README.md?raw';

export type DocEntry = {
  slug: string;
  title: string;
  content: string;
};

export const docs: DocEntry[] = [
  {
    slug: 'components-props',
    title: 'Components & Props',
    content: componentsProps,
  },
  {
    slug: 'state-usestate',
    title: 'State Management',
    content: stateUseState,
  },
  {
    slug: 'effects-useeffect',
    title: 'Effects',
    content: effectsUseEffect,
  },
  {
    slug: 'event-handling',
    title: 'Event Handling',
    content: eventHandling,
  },
  {
    slug: 'conditional-lists',
    title: 'Conditional Rendering & Lists',
    content: conditionalLists,
  },
  {
    slug: 'forms',
    title: 'Forms',
    content: forms,
  },
  {
    slug: 'context-api',
    title: 'Context API',
    content: contextApi,
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks',
    content: customHooks,
  },
  {
    slug: 'best-practices',
    title: 'Best Practices & Patterns',
    content: bestPractices,
  },
  {
    slug: 'concurrent-features',
    title: 'Concurrent Features (React 18+)',
    content: concurrentFeatures,
  },
  {
    slug: 'react19-hooks',
    title: 'React 19 New Hooks',
    content: react19Hooks,
  },
  {
    slug: 'crud-operations',
    title: 'CRUD Operations',
    content: crudOperations,
  },
  {
    slug: 'data-fetching',
    title: 'Data Fetching Patterns',
    content: dataFetching,
  },
];

export const homeDoc: DocEntry = {
  slug: 'home',
  title: '',
  content: readme,
};

export const defaultDocSlug = docs[0]?.slug ?? 'components-props';

export const getDocBySlug = (slug: string) =>
  docs.find((doc) => doc.slug === slug);

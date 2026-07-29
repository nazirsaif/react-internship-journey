# State Management Migration

## Pre-migration Analysis: Context + useReducer Pain Points

Before migrating to Zustand, here are the specific pain points identified in our current `Context` + `useReducer` implementation:

1. **Unnecessary Re-renders:** When using `useContext(KanbanContext)`, any component consuming the context will re-render whenever the context value changes. Because the entire board state (past, present, future) and the `dispatch` function are bundled into a single context, updating a single card causes the entire board and all cards to re-render, even if they don't depend on the changed data.
2. **Boilerplate and Verbosity:** `useReducer` requires defining a complex reducer function, action types, and action creator payloads. Dispatching actions requires creating object literals (e.g., `dispatch({ type: 'ADD_CARD', payload: { ... } })`), which is more verbose than calling a simple function.
3. **Manual Persistence Wiring:** Our current setup uses a custom `useLocalStorage` hook and a `useEffect` to synchronize the present state to `localStorage`. This is not an integrated solution and can lead to edge cases or performance hits if not managed carefully.
4. **Provider Hell:** The application requires wrapping the component tree in a `<KanbanProvider>`. While it's only one provider right now, as applications grow, this leads to deep nesting of providers in `App.tsx`.

## Post-Migration Analysis: Zustand Migration

### Boilerplate Difference
Zustand drastically reduced boilerplate. We eliminated:
- `KanbanContext.tsx` entirely (which contained the reducer, the provider, and the initial state).
- The `KanbanAction` types in `types.ts`.
- The manual `useEffect` and `useLocalStorage` hook integrations.

Instead, we have a single, clean `useBoardStore` that exposes specific methods (e.g., `addCard`, `moveCard`) directly as functions. The persistence logic is handled transparently via Zustand's `persist` middleware.

### Re-render Profiling
- **Before Migration (Context):** The `KanbanBoard` re-rendered on every state change because it consumed the entire `state` from the Context. The children were shielded only by `React.memo`.
- **After Migration (Zustand):** By using selectors (e.g., `useBoardStore(state => state.present.columns)`), we subscribe only to the slices of state the component actually needs.
- **Result:** Re-render counts remained practically **identical** (0 unnecessary sibling renders during drag, 5-10ms render phase for the active card), but the *architecture* is much more robust because we don't have to rely exclusively on `React.memo` to prevent cascading renders—the selector pattern handles it natively.

### Conclusion: Context vs. Zustand vs. Redux Toolkit
- **React Context:** Best for dependency injection or global state that changes very infrequently (e.g., theme, current user locale, or simple authentication state). It should not be used as a high-frequency state management tool due to its lack of granular subscriptions.
- **Zustand:** The sweet spot for most React applications. It provides a lightweight, unopinionated API with minimal boilerplate, built-in middleware for persistence/devtools, and granular re-renders via selectors. Ideal for our Kanban board which has frequent, localized state updates.
- **Redux Toolkit (RTK):** Best for massive enterprise applications with large teams, complex state slicing, and strict unidirectional data flow requirements. It brings heavier boilerplate but offers excellent debugging tools (Redux DevTools), RTK Query for data fetching, and strict immutability. Overkill for a simple Kanban board.

# State Management Migration

## Pre-migration Analysis: Context + useReducer Pain Points

Before migrating to Zustand, here are the specific pain points identified in our current `Context` + `useReducer` implementation:

1. **Unnecessary Re-renders:** When using `useContext(KanbanContext)`, any component consuming the context will re-render whenever the context value changes. Because the entire board state (past, present, future) and the `dispatch` function are bundled into a single context, updating a single card causes the entire board and all cards to re-render, even if they don't depend on the changed data.
2. **Boilerplate and Verbosity:** `useReducer` requires defining a complex reducer function, action types, and action creator payloads. Dispatching actions requires creating object literals (e.g., `dispatch({ type: 'ADD_CARD', payload: { ... } })`), which is more verbose than calling a simple function.
3. **Manual Persistence Wiring:** Our current setup uses a custom `useLocalStorage` hook and a `useEffect` to synchronize the present state to `localStorage`. This is not an integrated solution and can lead to edge cases or performance hits if not managed carefully.
4. **Provider Hell:** The application requires wrapping the component tree in a `<KanbanProvider>`. While it's only one provider right now, as applications grow, this leads to deep nesting of providers in `App.tsx`.

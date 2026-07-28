# Performance Optimization Report

**Live Demo**: [https://nazirsaif.github.io/react-internship-journey/](https://nazirsaif.github.io/react-internship-journey/)

This document records the baseline and post-optimization performance metrics for the Kanban Board project.

## 1. Re-render Optimization (React.memo & useCallback)

**Before:**
- **Issue:** The `KanbanContext` provided a non-memoized `{ state, dispatch }` object. Every time a card was moved or edited, `state` changed, causing the entire context value to be recreated. Since `KanbanCard` called `useKanban()`, **every single card re-rendered** on every state change (e.g., during a drag operation or when filtering).
- **Metric:** Dragging a card across the screen caused roughly **40-60 re-renders per second** for *every* card on the board.

**After:**
- **Fix:** We memoized the `KanbanContext` value using `useMemo`. We also removed `useKanban()` from inside `KanbanCard`, instead passing `onEdit` and `onDelete` as stable callback props (`useCallback`) from the parent `KanbanColumn`. We wrapped both `KanbanColumn` and `KanbanCard` in `React.memo`.
- **Metric:** Dragging a card now causes **0 unnecessary sibling card re-renders**. Only the active dragging card and the destination drop zones update, drastically reducing CPU idle time.

## 2. Virtualization (@tanstack/react-virtual)

**Before:**
- **Issue:** Rendering 1,000 synthetic cards directly into the DOM caused the browser's paint and layout threads to freeze.
- **Metric:** Initial render time with 1,000 cards was **> 2.5 seconds** (2500ms). Searching/filtering froze the UI for ~800ms.

**After:**
- **Fix:** Implemented `@tanstack/react-virtual` in `KanbanColumn.tsx` to virtualize the sortable lists.
- **Metric:** Initial render time with 1,000 cards is now **~45ms**. Only the 5-7 visible cards (plus 5 overscan) are rendered into the DOM at any given time. Searching is instantly responsive at 60 FPS.

## 3. Code-Splitting and Bundle Analysis

**Before:**
- **Issue:** All routes and dependencies were bundled into a single file. An unused dependency (`date-fns`) was installed, though Vite tree-shaking mitigated some damage.
- **Metric:** Initial monolithic bundle size was **408.64 kB (126.90 kB gzipped)**.

**After:**
- **Fix:** Installed `react-router-dom` and used `React.lazy` + `Suspense` to code-split the `/playground` route. Ran `rollup-plugin-visualizer` and uninstalled `date-fns`.
- **Metric:** The main bundle `index.js` was effectively segmented. The `/playground` route is completely deferred until visited, improving Time to Interactive (TTI).

## 4. Lighthouse Performance Audit

**Before Optimization:**
- Performance Score: **78 / 100**
- Largest Contentful Paint (LCP): ~1.8s
- Total Blocking Time (TBT): ~340ms (due to excessive DOM nodes without virtualization)

**After Optimization:**
- Performance Score: **99 / 100**
- Largest Contentful Paint (LCP): ~0.4s
- Total Blocking Time (TBT): ~10ms (DOM size is now strictly bounded by virtualization)

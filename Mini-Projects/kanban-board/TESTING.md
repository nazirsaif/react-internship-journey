# Testing Strategy

This document outlines the testing strategy used for the Kanban Board project.

## Overview
We employ a comprehensive three-tier testing strategy to ensure reliability across all layers of the application:
1. **Unit Tests (Jest)**: Focus on pure business logic (like reducers) and custom hooks in isolation.
2. **Integration Tests (React Testing Library)**: Ensure the components render correctly and interact properly with each other within the context provider.
3. **End-to-End Tests (Playwright)**: Test the full user flow exactly as a user would experience it in a real browser.

## 1. Unit Tests
- **Tool**: Jest + `ts-jest`
- **Scope**: Reducers (`KanbanContext.test.ts`), custom hooks (`hooks.test.ts`).
- **Running Locally**:
  ```bash
  npm run test
  ```
  *(Note: Due to the ESM setup, this runs `jest` with Node's `--experimental-vm-modules` flag).*

## 2. Integration Tests
- **Tool**: Jest + React Testing Library (`@testing-library/react`) + user-event
- **Scope**: `KanbanBoard.test.tsx` 
- **Details**: Tests component rendering, user interactions (typing, clicking), and the integration between the UI components and the context state.
- **Running Locally**: 
  Integration tests are run alongside unit tests.
  ```bash
  npm run test
  ```

## 3. End-to-End (E2E) Tests
- **Tool**: Playwright (`@playwright/test`)
- **Scope**: `kanban.spec.ts`
- **Details**: Tests the complete application flow (loading, creating tasks, dragging, editing, deleting, and data persistence).
- **Running Locally**:
  ```bash
  npm run test:e2e
  ```
  *(You can also use `npx playwright test --ui` for an interactive UI mode).*

## Code Coverage
We generate coverage reports for our unit and integration tests. 
To generate a coverage report locally, run:
```bash
npm run test -- --coverage
```

## Continuous Integration
All tests are integrated into a GitHub Actions workflow (`.github/workflows/ci.yml`). 
On every push or pull request to `main` or `master`:
- Dependencies are installed.
- The UI system and Kanban board are built.
- Jest is executed with the `--coverage` flag.
- Playwright tests are executed on the latest browsers.

The build will automatically fail if any tests fail, maintaining code quality.

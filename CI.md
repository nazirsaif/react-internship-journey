# Continuous Integration (CI) Process

This repository uses GitHub Actions for Continuous Integration. Our CI pipeline ensures code quality by automatically checking formatting, types, and tests across all sub-projects.

## What runs on every push and PR
The workflow `.github/workflows/ci.yml` is triggered on every `push` and `pull_request` to `master` or `main`. It runs four parallel jobs for the following projects:

1. **React UI System**
   - Linting via ESLint
   - Type checking via TypeScript (`tsc --noEmit`)
2. **Kanban Board**
   - Type checking
   - Unit tests and E2E tests (Playwright)
3. **Kanban API**
   - Unit tests
4. **Chat App**
   - Linting and type checking for the frontend
   - Test script for the backend

If any job fails (due to a linting violation, type error, or failing test), the entire build is marked as failed.

## How to read a failed CI run
1. Navigate to the **Actions** tab in the GitHub repository.
2. Click on the latest workflow run with a red "X".
3. Check which job failed (e.g., `Kanban Board`, `React UI System`).
4. Click on the failed job and expand the specific step (e.g., `Run Unit Tests` or `Type check`) to see the error output.

## How to run checks locally
Before pushing your code, you should run the checks locally to ensure they pass:

- **React UI System**:
  ```bash
  cd Mini-Projects/react-ui-system
  npm run lint
  npx tsc --noEmit
  ```
- **Kanban Board**:
  ```bash
  cd Mini-Projects/kanban-board
  npx tsc --noEmit
  npm run test
  npm run test:e2e
  ```
- **Kanban API**:
  ```bash
  cd Mini-Projects/kanban-api
  npm test
  ```
- **Chat App (Frontend)**:
  ```bash
  cd Mini-Projects/chat-app/frontend
  npm run lint
  npx tsc --noEmit
  ```

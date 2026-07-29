# Kanban Board

This is the frontend application for the Kanban Board.

## Architecture

The architecture has been updated to separate server state and client state:

- **Server State (React Query)**: Card data is fetched from the `kanban-api` backend using `@tanstack/react-query`. Operations such as adding, editing, moving, and deleting cards are handled via mutations with optimistic updates to make the UI feel instant while syncing with the server. If an error occurs, the UI rolls back to the previous state.
- **Client State (Zustand)**: UI-specific state such as the search term, active label filters, and dark/light mode are managed using Zustand. The undo/redo stack is also maintained here exclusively for UI state.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Make sure the `kanban-api` backend is running on `http://localhost:3001`.
3. Start the dev server:
   ```sh
   npm run dev
   ```

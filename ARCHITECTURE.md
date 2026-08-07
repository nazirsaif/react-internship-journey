# Architecture

This repository contains a full-stack Kanban board application split into multiple projects.

## Project Structure

1. **kanban-api**: An Express.js backend connected to MongoDB. Handles authentication, card operations, and business logic.
2. **kanban-board**: A React single-page application built with Vite. It serves as the primary frontend for the Kanban board.
3. **react-ui-system**: A shared UI component library (design system) that `kanban-board` imports to build its interface consistently.

These components are designed to be decoupled. The frontend uses the design system for UI consistency and calls the API for data persistence.

## State Management

State in the frontend is explicitly split into two categories to improve separation of concerns:

- **Server State (`@tanstack/react-query`)**: Used for asynchronous data fetching, caching, synchronization, and updating data from the backend API (e.g., fetching boards, cards, creating tasks).
- **UI State (Zustand)**: Used for synchronous, global client-side state that doesn't need to be persisted to the database (e.g., current authenticated user, access tokens, UI toggle states).

## Authentication Flow

The application uses a robust token-based authentication system:

1. **Tokens**:
   - **Access Token**: A short-lived JWT stored in memory (via Zustand). Used in the `Authorization: Bearer <token>` header for API requests.
   - **Refresh Token**: A long-lived JWT stored in an `httpOnly`, `secure` cookie.

2. **Login/Signup**: 
   Upon successful authentication, the backend responds with the access token in the JSON body and sets the refresh token in the secure cookie.

3. **Silent Refresh**:
   If an API request returns `401 Unauthorized` (indicating the access token expired), the `apiClient` automatically intercepts the failure and attempts a silent refresh:
   - It calls `POST /auth/refresh`, which sends the `httpOnly` refresh token.
   - If successful, a new access token is returned, stored in memory, and the original failed request is retried seamlessly.
   - If the refresh token is also invalid or expired, the user is logged out and redirected to the login screen.

4. **Security**:
   - The access token is never stored in `localStorage`, protecting against XSS attacks.
   - The refresh token is strictly `httpOnly` and `sameSite: none` (in production) so JavaScript cannot access it, but the browser automatically sends it with cross-origin requests securely.

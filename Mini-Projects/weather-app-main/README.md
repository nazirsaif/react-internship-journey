# Weather-Wise Application

> Originally built Day 1, refactored on Week 6 Day 1 with React, TypeScript, tests, and accessibility fixes.

Weather-Wise is a modern, accessible web application that provides real-time weather updates and user-friendly interaction. It has been completely rebuilt to reflect production-grade frontend and backend standards.

## Refactoring Journey

This project was initially a flat, monolithic vanilla JavaScript application with hardcoded values and direct DOM manipulation. It has since been refactored into:

1. **Structured Architecture:** Split into a distinct `frontend` and `backend`.
2. **TypeScript:** Both the Express backend and React frontend are now strictly typed for maximum reliability and maintainability.
3. **Componentization:** The raw HTML files were decomposed into reusable React components using Vite.
4. **Accessibility (a11y):** Form inputs and buttons now utilize semantic HTML elements and ARIA labels (e.g., `aria-label="City search form"` and `role="main"`).
5. **Testing:** Vitest has been integrated for reliable component rendering validation.

## Running Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run start
```

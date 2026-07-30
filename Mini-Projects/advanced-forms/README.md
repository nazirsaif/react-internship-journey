# Advanced Forms Wizard

A multi-step registration wizard built with React, Vite, TypeScript, React Hook Form, and Zod. 

This project consumes the shared `@internal/ui-system` component library.

## Live Demo
[Live Demo](https://nazirsaif.github.io/react-internship-journey/advanced-forms/)

## Features
- **Multi-step navigation** with validation at each step
- **Zod schemas** for strict type-safe validation
- **Async validation** (debounced username availability check)
- **Dynamic fields** (adding/removing skills)
- **Local Storage persistence** (refreshing mid-wizard restores progress)
- **Accessibility** (focusing first invalid field on error, `aria-describedby` linking)

## Running Locally

1. Install dependencies from the monorepo root:
   ```bash
   npm install
   ```

2. Start the development server for this specific package:
   ```bash
   npm run dev -w advanced-forms
   ```

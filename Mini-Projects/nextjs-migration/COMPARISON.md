# Next.js vs React Migration Comparison

This document details the concrete architectural differences observed while migrating the AIFlow landing page from a plain React + Vite setup (in `react-ui-system`) to the Next.js App Router.

## 1. Server vs. Client Components
In the original React application, all components are client-side rendered by default, meaning all Javascript (including static layout logic) is sent to the browser.
In Next.js, components are Server Components by default. 
- **What became Client Components:** The `MobileMenu` (handling hamburger toggle) and `FAQAccordion` (handling open/close state of FAQs). We explicitly marked them with `"use client"` because they rely on React `useState` and DOM events (`onClick`).
- **Why:** Next.js Server Components cannot contain interactive hooks. By isolating state to these specific client components, the vast majority of the page (Navbar shell, Hero, Features, Pricing shell, Footer) is rendered on the server. The client only downloads the JavaScript required for the accordion and the menu, resulting in a much smaller bundle size and faster Time to Interactive (TTI).

## 2. Routing (File-Based vs. React Router)
- **Plain React:** Routing typically requires `react-router-dom`, defining a `<BrowserRouter>` and explicit `<Route>` components mapping paths to UI components.
- **Next.js:** Next.js uses file-based routing. Creating `app/about/page.tsx` instantly maps to the `/about` route without any configuration. Next.js also provides the `<Link>` component for client-side navigation with built-in prefetching, replacing the need for anchor tags or `react-router-dom`'s `<Link>`.

## 3. Data Fetching and Rendering
- **Plain React:** Fetching data or defining complex static data often happens in `useEffect` hooks, triggering a re-render after the initial mount, which can cause layout shifts or loading spinners.
- **Next.js:** The pricing and FAQ data were moved to a static `content.ts` file. In `Pricing.tsx` (a Server Component), this data is imported and mapped over directly during the server render phase. No `useEffect` or client-side fetching is needed. The HTML sent to the browser contains the fully rendered pricing cards and FAQ items, improving SEO and initial page load speed.

## 4. Built-in Optimizations
- **SEO Meta Tags:** In Next.js, SEO can be handled natively by exporting a `metadata` object in `layout.tsx` or `page.tsx` (e.g., setting the title and description), whereas plain React requires manipulating the `document.title` or using third-party libraries like `react-helmet`.
- **Automatic Code Splitting:** Next.js automatically code-splits per route. When navigating to `/about`, only the JavaScript necessary for that route is loaded.
- **Image Optimization:** Although not explicitly used in this specific static migration, Next.js provides the `<Image>` component (`next/image`) which automatically serves correctly sized WebP/AVIF images, preventing layout shift and saving bandwidth—something that requires manual configuration in Vite.

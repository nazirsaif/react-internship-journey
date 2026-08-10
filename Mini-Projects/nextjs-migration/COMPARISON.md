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

## 5. Rendering Strategies: SSG vs ISR vs SSR
With the addition of the Blog section, we can clearly see the differences between Next.js's rendering strategies.

- **Static Site Generation (SSG) - `/blog/[slug]` (Base)**:
  - **How it works:** By using `generateStaticParams`, we tell Next.js to fetch all blog post data at *build time* and generate static HTML files for every post.
  - **When to use it:** For content that rarely changes (e.g., marketing pages, documentation, legacy blog posts). It offers the fastest load times and best SEO because the HTML is already built and served from a CDN.

- **Incremental Static Regeneration (ISR) - `/blog/[slug]` (with `revalidate: 10`)**:
  - **How it works:** We added `export const revalidate = 10;` to our blog post pages. Now, Next.js still generates static HTML, but if a request comes in and the page is older than 10 seconds, it will serve the stale static page instantly, while regenerating a fresh version in the background. Subsequent visitors get the new version.
  - **When to use it:** For content that updates frequently but still needs to be fast and SEO-friendly (e.g., e-commerce product pages, active blog posts, news articles). It gives you the speed of SSG with the freshness of SSR without requiring a full site redeploy.

- **Server-Side Rendering (SSR) - `/blog/latest-activity`**:
  - **How it works:** By using `export const dynamic = 'force-dynamic'`, this page is dynamically rendered on the server for *every single incoming request*. We demonstrated this by showing a live timestamp that updates on every refresh.
  - **When to use it:** For highly personalized, user-specific, or real-time data where you cannot afford any stale data (e.g., a user dashboard, a live stock ticker, checkout pages). It is slower than SSG/ISR because the server must compute the HTML on the fly before sending it to the browser.

## 6. Next.js Route Handlers vs. Separate Express API

With the addition of the Comments feature, we connected Next.js directly to MongoDB using Route Handlers. This highlights the architectural choice between a monolithic Next.js approach vs a decoupled frontend/backend (like the `kanban-api` Express app).

- **When to use Route Handlers (Next.js Monolith):**
  - **Code Organization:** Keeps frontend and backend logic in a single repository. Types and models can be easily shared between the server routes and client components without duplicating code.
  - **Deployment:** Simpler deployment process. Platforms like Vercel automatically deploy Next.js Route Handlers as Serverless Functions. There's no need to manage separate hosting for a Node.js/Express server.
  - **Scaling:** Route handlers scale automatically as serverless functions. However, serverless functions can lead to cold starts, and managing stateful connections (like MongoDB) requires connection caching to avoid exhausting connection pools.
  - **Use Case:** Best for small-to-medium apps, side projects, or features heavily coupled to the UI (like our blog comments).

- **When to use a separate Express API (Decoupled):**
  - **Code Organization:** Enforces a strict separation of concerns. The API can be maintained by a dedicated backend team and can serve multiple frontends (e.g., a web app, an iOS app, and an Android app) uniformly.
  - **Deployment:** Requires separate infrastructure (e.g., Docker containers). The deployment pipeline is more complex, but provides full control over the runtime environment.
  - **Scaling:** Better suited for heavy background processing, websockets, or maintaining long-lived database connections without the limitations of serverless execution limits.
  - **Use Case:** Best for large-scale enterprise applications, microservices architectures, or APIs that act as a central hub for various clients (like the `kanban-api`).

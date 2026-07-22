# Admin Dashboard Shell

A responsive, layout-focused Admin Dashboard Shell built exclusively with **HTML, CSS (Grid/Flexbox), and vanilla JavaScript**. No CSS frameworks (like Tailwind or Bootstrap) and no JS frameworks were used.

## Features & Requirements Met

1. **Overall Layout**: Uses CSS Grid (`grid-template-areas`) for the core shell structure (sidebar + main content).
2. **Sidebar**: 
   - Fixed width (`260px`) on desktop.
   - Collapses to `72px` with a CSS transition, hiding text and showing only icons.
   - Nav items feature interactive hover and active states.
3. **Topbar**: 
   - Sticky positioning (`position: sticky`) to remain at the top while content scrolls.
   - Features a scroll-triggered box-shadow via vanilla JS event listener.
4. **Widget Grid**:
   - Fully responsive using `repeat(auto-fit, minmax(260px, 1fr))`, allowing it to reflow naturally without relying heavily on media queries.
   - Each card features a smooth hover-lift effect (`translateY` + `box-shadow`).
5. **Responsive / Mobile Behavior**:
   - Below `768px`, the sidebar disconnects from the grid and transforms into an off-canvas slide-in drawer.
   - Includes a semi-transparent overlay that closes the drawer when clicked.
   - Adapts cleanly down to `375px` mobile view.

## Tech Used
- **HTML5**: Semantic tags (`<aside>`, `<header>`, `<main>`, `<nav>`).
- **CSS3**: CSS Grid, Flexbox, Custom Properties (variables), Media Queries, Keyframe Animations.
- **Vanilla JavaScript**: DOM Manipulation, Event Listeners for toggle and scroll behaviors.
- **Font Awesome**: Icons.
- **Google Fonts**: Inter.

## Folder Structure

```
admin-dashboard-shell/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
└── README.md
```

## How to Run Locally

1. Clone the repository.
2. Open `index.html` in your preferred web browser. 
   - Alternatively, serve it via a local development server like VS Code's "Live Server" for hot reloading.
3. Resize the window to test desktop (1920px), tablet (768px), and mobile (375px) breakpoints!

## Live Demo
*(Placeholder for live deployment URL)*

# AIFlow - SaaS Landing Page

![AIFlow Hero](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop)

A professional, high-converting SaaS landing page built for a fictional AI startup. This project focuses on semantic HTML, modern CSS layouts (Grid/Flexbox), and vanilla JavaScript logic without relying on heavy frameworks.

## 🚀 Live Demo
**[View the Live Demo on GitHub Pages](https://nazirsaif.github.io/react-internship-journey/Mini-Projects/saas-landing-page/)**
*(Note: You may need to enable GitHub Pages on the `main` branch in your repository settings!)*

## 🛠️ Tech Stack
- **HTML5:** Semantic architecture and accessibility (`aria-` attributes, landmarks).
- **CSS3:** Custom properties (variables), Grid, Flexbox, media queries for responsive design, and CSS transitions.
- **Vanilla JavaScript:** DOM manipulation, scroll-reveal IntersectionObserver animations, form validation, and `localStorage` for theme persistence.

## ✨ Features
- **Responsive Layout:** Fluidly scales across mobile, tablet, and desktop devices without horizontal overflow.
- **Dark/Light Mode:** Toggleable theme that persists user preference via `localStorage`.
- **Scroll-Reveal Animations:** High-performance, library-free scroll animations powered by IntersectionObserver.
- **Accessibility:** Full keyboard operability, ARIA attributes, semantic heading structure, and visible focus states.
- **Form Validation:** Client-side email validation for the newsletter signup.
- **SEO Optimized:** Open Graph tags, meta descriptions, and Google Fonts preconnects.

## 📊 Lighthouse Scores
| Metric | Score |
| --- | --- |
| **Performance** | 🟢 90+ |
| **Accessibility** | 🟢 100 |
| **Best Practices**| 🟢 100 |
| **SEO** | 🟢 100 |

## 📂 Folder Structure
```text
saas-landing-page/
├── index.html       # Main HTML document
├── css/
│   └── style.css    # Centralized CSS stylesheet
├── js/
│   └── script.js    # Interactive logic (Theme, Animations, Menu)
├── assets/          # Image and icon assets
└── README.md        # Project documentation
```

## 🔮 What I'd Improve Next
- **Componentization:** Migrating to React or Next.js to break down the HTML into reusable `<Card>` and `<Section>` components as the site scales.
- **Backend Integration:** Wire up the Newsletter form to a real service like Mailchimp, Resend, or a custom API endpoint.
- **Analytics:** Add Google Analytics or Plausible to track conversion rates on the "Get Started" buttons.

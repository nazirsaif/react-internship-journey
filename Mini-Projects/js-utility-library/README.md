# JS Utility Library

A plain HTML, CSS, and vanilla JavaScript project demonstrating custom implementations of common utility functions without any external libraries or frameworks.

## Utilities Included

1. **Debounce (debounce)**: 
   Debouncing ensures that a function is not called again until a certain amount of time has passed without it being called. For example, if you set a 500ms delay, the function will only execute after you have *stopped* triggering it for 500ms. It's perfect for search inputs so we don't query the database on every single keystroke, but rather when the user pauses typing.

2. **Throttle (	hrottle)**:
   Throttling enforces a maximum number of times a function can be called over time. If you set a 300ms limit, the function will execute at most once every 300ms, regardless of how many times the event fires. This is ideal for high-frequency events like window scrolling or resizing, where you want regular updates but don't want to overwhelm the browser.

3. **Pub-Sub Event Bus**:
   A minimal publish-subscribe pattern implementation (subscribe, unsubscribe, publish) that allows different parts of the application to communicate without being tightly coupled.

## Tech Stack
- Plain HTML5
- Vanilla CSS3
- Vanilla JavaScript (ES6+)

## Folder Structure
\\\
js-utility-library/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── utils.js
│   └── script.js
├── assets/
└── README.md
\\\

## Live Demo
Open index.html in your browser to see the utilities in action:
- **Live Search**: Uses debounce to wait until you pause typing to filter the country list, and uses the pub-sub bus to show a typing indicator.
- **Scroll Counter**: Uses 	hrottle to limit the rate at which scroll events update the on-screen counter.

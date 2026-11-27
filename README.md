# Semantic Portfolio Website

A responsive multi-page portfolio with a modular e-commerce capstone, weather dashboard and interactive to-do app, built with HTML5, CSS and vanilla JavaScript.

## Pages
- `index.html` — Home and featured work
- `about.html` — Introduction and skills
- `projects.html` — Project gallery
- `todo.html` — Interactive to-do app with task CRUD, filters and localStorage persistence
- `weather.html` — City-search weather dashboard using asynchronous Open-Meteo APIs
- `shop.html` — Studio Market e-commerce capstone with product catalogue, filters, product details, cart and hash-based client-side routing
- `shop.css` — Responsive storefront styles
- `js/store-data.js` — Product catalogue and shared formatting helpers
- `js/store-cart.js` — Cart state and localStorage persistence
- `js/store-router.js` — Lightweight hash-based client-side router
- `js/store-app.js` — Storefront UI, product search, filters, sorting and checkout demo
- `contact.html` — Accessible contact form

## Run locally
Open `index.html` in a browser, or use a local development server (for example, VS Code Live Server). Open `shop.html` to explore the e-commerce capstone. Because it uses JavaScript modules, a local development server is recommended.

## Personalize before submission
1. Replace **Your Name** and **YN** with your name/initials across all HTML pages.
2. Update the biography, skills and project descriptions to reflect your real work.
3. In `main.js`, replace `your.email@example.com` with your email address. The form opens the visitor's email application; it does not store or send messages to a server.
4. Add links to your real project demos and repositories if available.
5. Optionally replace the CSS-generated project visuals with your own project screenshots and meaningful alt text.

## Accessibility and SEO included
- Semantic landmarks and heading hierarchy
- Skip-to-content link and keyboard-visible focus
- Responsive navigation with `aria-expanded` and `aria-controls`
- To-do app with delegated events, create/read/update/delete, All/Active/Completed filters and localStorage
- Weather dashboard using async/await, Fetch API, JSON parsing, city geocoding, live weather metrics and error handling
- Modular e-commerce storefront with hash routing, searchable/filterable/sortable products, product details, cart CRUD, localStorage persistence and a demo checkout
- Explicit form labels, native validation and a live status region
- Descriptive page titles, meta descriptions, language and viewport metadata
- Reduced-motion preference support and responsive layouts

## Deployment
The repository is configured for GitHub Pages from the `main` branch and repository root. Once Pages finishes publishing, the capstone storefront is available at `https://kokilmithran24-crypto.github.io/personal-portfolio/shop.html`. The storefront is a static front-end demo; checkout does not collect payment or create real orders.

## Important
This is a front-end static project. A perfect Lighthouse score cannot be guaranteed across every browser/device; run Lighthouse after adding your own content and assets.

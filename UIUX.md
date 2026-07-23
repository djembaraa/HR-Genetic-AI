# UI/UX & SEO Guidelines - HR-Genetic-AI

## 1. Gestalt Principles Implementation
To ensure a highly professional and intuitive interface, we apply Gestalt psychology principles:
- **Proximity:** Related elements (like a candidate's name, email, and skills) are grouped closely together in Cards.
- **Similarity:** All primary actions (Upload, Search, Submit) use the same teal/green accent color and pill-shaped border-radius.
- **Figure/Ground:** Use of a soft gradient background with glassmorphism (translucency and blur) on foreground cards to create deep contrast and focus.

## 2. Design System
- **Colors:**
  - Primary: `#008080` (Teal)
  - Background: Soft warm gradient `#fcf5ee` to `#e6f2f2`
  - Text: `#1f2937` (Dark Gray for readability)
- **Typography:** Modern Sans-Serif (e.g., Inter or Plus Jakarta Sans). High legibility for data-heavy HR dashboards.

## 3. SEO (Search Engine Optimization)
Since ATS landing pages need to be discoverable:
- **Semantic HTML:** Use proper `<header>`, `<nav>`, `<main>`, `<section>`, and hierarchical heading tags (`<h1>` to `<h3>`).
- **Meta Tags:** Ensure `<title>`, `<meta name="description">`, and OpenGraph tags are dynamically injected using `react-helmet-async` for the landing page.
- **Accessibility (a11y):** All images have `alt` attributes, buttons have `aria-labels`, and high contrast ratios are maintained.

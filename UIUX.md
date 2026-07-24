# UIUX.md - Design System, Dual-Portal Layouts, Component Slicing & Icon Protocol

> **Document Type:** Single Source of Truth (SOT)
> **Version:** 2.0 (Dual-Sided Platform)
> **Last Updated:** 2026-07-24
> **Author:** Senior UI/UX Designer (Audit Phase)
> **Status:** PLANNING - Awaiting Execution by Gemini Agent
> **Design Reference:** Hurang HR SaaS (Cover-05.jpg)

---

## 1. Design Reference Analysis

### Extracted Visual Identity from Hurang Reference

**Color Strategy:** White-dominant with a single bold accent. The reference uses deep purple/indigo for CTAs and active states. All backgrounds are clean white or off-white. Text uses a strict gray-black hierarchy. No gradients on interactive elements.

**Typography:** Tight tracking on display headings (-0.04em). Generous line-height on body text (1.6). Strong weight contrast between headings (600-700) and body (400). A single font family throughout (Inter or equivalent).

**Card Treatment:** Thin 1px gray border. Small radius (8-12px). No drop shadow at rest; subtle shadow appears only on hover. Content padding is consistent (24px). No glassmorphism, no colored borders.

**Layout Density:** The reference design uses generous whitespace between sections (80-120px padding). Feature grids use 3-column layouts with 24-32px gaps. Sidebar is 240-260px with clear section dividers.

**Imagery:** The reference uses real photography (diverse team members, workplace shots) for hero and testimonial sections. Product mockups are displayed within device frames (laptop screens). No abstract illustrations or emojis.

---

## 2. Design System Tokens (Tailwind v3 Configuration)

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          hover: '#1F2937',
        },
        accent: {
          DEFAULT: '#6C2BD9',
          hover: '#5B21B6',
          light: '#F5F3FF',
          muted: '#DDD6FE',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        border: {
          DEFAULT: '#E5E7EB',
          hover: '#D1D5DB',
          focus: '#6C2BD9',
        },
        success: { DEFAULT: '#059669', light: '#ECFDF5' },
        warning: { DEFAULT: '#D97706', light: '#FFFBEB' },
        error: { DEFAULT: '#DC2626', light: '#FEF2F2' },
        info: { DEFAULT: '#2563EB', light: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
```

---

## 3. Component Refactoring Plan

### Mandate: Refactor existing components. Do not create redundant alternatives.

| Component | File | Current Issues | Target Refactoring |
|:----------|:-----|:---------------|:-------------------|
| **Button** | `Button.jsx` | Only `primary`/`secondary` variants. No size prop. No icon support. | Add `size` prop: `sm` (32px), `md` (40px), `lg` (48px). Add `variant`: `primary`, `secondary`, `ghost`, `danger`, `accent`. Add `icon` prop (lucide-react component). Add `loading` state with spinner. |
| **Card** | `Card.jsx` | Uses `.minimalist-card`. Accepts arbitrary `style`. | Rename CSS class to `.card`. Add `padding` prop: `compact` (16px), `default` (24px), `spacious` (32px). Remove hover transform. Shadow only on `:hover`. |
| **Navbar** | `Navbar.jsx` | Hardcoded inline styles. No mobile menu. Uses `Link` from react-router. | Extract all styles to CSS (`.navbar`, `.navbar__logo`, `.navbar__links`). Add mobile hamburger via `lucide-react` `Menu`/`X` icons. Conditionally render auth-aware links (show "Dashboard" if logged in, "Login" if not). |
| **Sidebar** | `Sidebar.jsx` | Hardcoded inline styles. Fixed 260px width. | Extract to CSS. Add collapsible behavior (full -> icon-only -> hidden). Add section dividers. Add role-based nav filtering (show different items for ADMIN vs HR_MANAGER vs CANDIDATE). |
| **Footer** | `Footer.jsx` | Hardcoded inline styles. | Extract to CSS (`.footer`, `.footer__grid`, `.footer__column`). Responsive: 3-col -> 1-col on mobile. |
| **UploadForm** | `UploadForm.jsx` | Uses emoji for upload icon. `alert()` for errors. | Replace emoji with `lucide-react` `Upload` icon. Replace `alert()` with inline error display. Style dropzone per design tokens. |
| **ChatBox** | `ChatBox.jsx` | Basic message list. No typing indicator. No scroll-to-bottom. | Add `lucide-react` `Send` icon on button. Add typing indicator (animated dots). Add `useRef` for auto-scroll. Style bubbles per design tokens. |
| **ProtectedRoute** | `ProtectedRoute.jsx` | Checks token existence only. No role check. | Parse JWT to extract role. Redirect CANDIDATE to `/candidate`, HR roles to `/admin`. Redirect expired tokens to `/login`. |

---

## 4. Page Layout Specifications

### Layout A: Public Landing Page (`/`)

```
+----------------------------------------------------------+
| Navbar (fixed, h:64px, white, border-bottom)              |
|  [Logo]              [Products] [Pricing] [Login] [CTA]  |
+----------------------------------------------------------+
|                                                           |
| Hero (min-h: calc(100vh - 64px))                          |
|  +------------------------+  +-------------------------+ |
|  | H1 (display size)      |  | Product screenshot      | |
|  | Subtitle (text-lg)     |  | inside laptop frame     | |
|  | [CTA btn] [Ghost btn]  |  | or feature preview      | |
|  +------------------------+  +-------------------------+ |
|                                                           |
+----------------------------------------------------------+
| Social Proof Bar (py: 48px, bg: secondary)                |
|  "Trusted by 50+ companies"                              |
|  [Logo] [Logo] [Logo] [Logo] [Logo]                      |
+----------------------------------------------------------+
| Features (py: 96px)                                       |
|  Section title (centered)                                |
|  [Feature Card] [Feature Card] [Feature Card]  3-col     |
|  [Feature Card] [Feature Card]                 2-col opt |
+----------------------------------------------------------+
| How It Works (py: 96px, bg: secondary)                    |
|  3-step process with numbered circles                    |
+----------------------------------------------------------+
| Testimonial (py: 96px)                                    |
|  Single quote card with avatar and company               |
+----------------------------------------------------------+
| CTA Banner (py: 80px, bg: primary/dark, white text)       |
|  "Ready to transform your HR?" + [CTA button]           |
+----------------------------------------------------------+
| Footer (py: 64px, bg: secondary, border-top)              |
|  [Col: Brand]  [Col: Links]  [Col: Contact]              |
|  [Copyright bar]                                          |
+----------------------------------------------------------+
```

### Layout B: Admin Dashboard (`/admin`)

```
+------+--------------------------------------------------+
|      | Header (h:64px, bg:white, border-bottom)          |
| S    |   [Breadcrumb]                    [Search] [User] |
| I    +--------------------------------------------------+
| D    | Content (p:24px, bg:--color-bg-secondary)          |
| E    |                                                    |
| B    | [KPI] [KPI] [KPI] [KPI]         4-col grid        |
| A    |                                                    |
| R    | [Data Table - full width, Card wrapper]            |
|      |   Columns: Name, Email, Job, Status, Date, Action |
| 260  |   Pagination bar at bottom                         |
| px   |                                                    |
|      | [AI Chat Card]  [Recent Activity Card]  2-col     |
+------+--------------------------------------------------+
```

### Layout C: Candidate Portal (`/candidate`)

```
+------+--------------------------------------------------+
|      | Header (h:64px, same as admin)                    |
| S    +--------------------------------------------------+
| I    | Content (p:24px)                                   |
| D    |                                                    |
| E    | Resume Builder:                                    |
| B    | +---------------------+  +----------------------+ |
| A    | | Form Section        |  | Live Preview Panel   | |
| R    | | [Personal Info]     |  | (read-only render    | |
|      | | [Experience] (+Add) |  |  of resume data)     | |
| 240  | | [Education]  (+Add) |  |                      | |
| px   | | [Skills]     (+Add) |  |                      | |
|      | +---------------------+  +----------------------+ |
|      |   50% width               50% width              |
+------+--------------------------------------------------+
```

---

## 5. Responsive Breakpoints

| Name | Range | Key Changes |
|:-----|:------|:------------|
| Mobile | 0 - 767px | Single column everywhere. Sidebar hidden (hamburger toggle). Hero stacks vertically (image hidden or below text). Feature cards stack. Resume builder: form full-width, preview hidden or tabbed. Footer single column. |
| Tablet | 768px - 1023px | Two-column where appropriate. Sidebar collapsed to icon-only (64px). Feature cards 2-column. Resume builder: stacked (form above preview). |
| Desktop | 1024px+ | Full layout as specified. Sidebar expanded (260px). Feature cards 3-column. Resume builder: side-by-side. |

### Mobile-First CSS Rules

```css
/* Base: Mobile */
.hero-content { display: flex; flex-direction: column; gap: var(--space-8); }
.hero-content .image-section { display: none; }
.features-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }
.footer__grid { grid-template-columns: 1fr; }
.resume-builder { display: flex; flex-direction: column; }
.resume-builder__preview { display: none; } /* Accessible via tab on mobile */
.sidebar { position: fixed; left: -260px; transition: left 0.3s ease; z-index: 50; }
.sidebar--open { left: 0; }
.nav-links { display: none; }
.nav-hamburger { display: flex; }

/* Tablet */
@media (min-width: 768px) {
  .hero-content { flex-direction: row; }
  .hero-content .image-section { display: block; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .footer__grid { grid-template-columns: 1fr 1fr 1fr; }
  .sidebar { left: 0; width: 64px; }
  .sidebar__label { display: none; }
  .admin-content { margin-left: 64px; }
  .resume-builder__preview { display: block; }
}

/* Desktop */
@media (min-width: 1024px) {
  .features-grid { grid-template-columns: 1fr 1fr 1fr; }
  .sidebar { width: 260px; }
  .sidebar__label { display: inline; }
  .admin-content { margin-left: 260px; }
  .nav-links { display: flex; }
  .nav-hamburger { display: none; }
  .resume-builder { flex-direction: row; }
  .resume-builder__form { flex: 1; }
  .resume-builder__preview { flex: 1; }
}
```

---

## 6. Gestalt Principles Application

| Principle | Application in This Design |
|:----------|:---------------------------|
| **Proximity** | Form fields within the same resume section (e.g., company + title + dates for one Experience entry) are grouped inside a bordered container with shared padding. Different sections (Experience vs Education) are separated by 32px gap. KPI cards are grouped in a tight grid (16px gap) to signal they belong together. |
| **Similarity** | All cards share identical border, radius, and padding. All buttons of the same variant look identical regardless of page. All nav items share the same typography and spacing. Status badges use consistent color coding (green=success, yellow=warning, red=error). |
| **Enclosure** | Cards use 1px border to visually group related content. The sidebar is enclosed by a right border. Form sections use a subtle background tint or border to separate them from the page. Modal dialogs use overlay + centered card. |
| **Focal Point** | The primary CTA button uses `--color-accent` (deep purple) to stand out from the monochrome palette. Active sidebar items use accent-colored left border + accent background tint. KPI numbers use `--text-3xl` + `--font-bold` to draw attention. |

---

## 7. Icon Protocol: lucide-react Mapping

### Navigation Icons

| UI Element | Icon Component | Size | Context |
|:-----------|:---------------|:-----|:--------|
| Dashboard nav item | `LayoutDashboard` | 20px | Sidebar |
| Candidates nav item | `Users` | 20px | Sidebar |
| Jobs nav item | `Briefcase` | 20px | Sidebar |
| Resume Builder nav item | `FileText` | 20px | Sidebar (candidate portal) |
| Settings nav item | `Settings` | 20px | Sidebar |
| Logout action | `LogOut` | 20px | Sidebar bottom |
| Mobile menu open | `Menu` | 24px | Navbar |
| Mobile menu close | `X` | 24px | Navbar |

### Action Icons

| UI Element | Icon Component | Size | Context |
|:-----------|:---------------|:-----|:--------|
| Upload file | `Upload` | 24px | Upload dropzone |
| Send message | `Send` | 16px | Chat input button |
| Add entry (Experience/Edu) | `Plus` | 16px | Form section header |
| Delete entry | `Trash2` | 16px | Form row action |
| Edit entry | `Pencil` | 16px | Table row action |
| Download PDF | `Download` | 16px | Resume action bar |
| AI Enhance | `Sparkles` | 16px | Experience entry action |
| Search | `Search` | 20px | Header search bar |
| Filter | `SlidersHorizontal` | 16px | Table toolbar |
| Chevron (expand/collapse) | `ChevronDown` / `ChevronRight` | 16px | Collapsible sections |

### Feature Section Icons (Landing Page)

| Feature | Icon Component | Size | Display |
|:--------|:---------------|:-----|:--------|
| AI/RAG Screening | `Zap` | 24px | Inside 48x48 circle with `--color-accent-light` bg |
| Security | `ShieldCheck` | 24px | Same treatment |
| Performance | `Gauge` | 24px | Same treatment |
| Resume Builder | `FileText` | 24px | Same treatment |
| Employee Management | `UserCheck` | 24px | Same treatment |
| Analytics | `BarChart3` | 24px | Same treatment |

### Status Indicators

| Status | Icon | Color |
|:-------|:-----|:------|
| Success / Completed | `CheckCircle2` | `--color-success` |
| Warning / Pending | `Clock` | `--color-warning` |
| Error / Failed | `AlertCircle` | `--color-error` |
| Info | `Info` | `--color-info` |

---

## 8. Emoji Removal Registry

Every emoji in the current codebase must be replaced:

| File | Line | Current | Replacement |
|:-----|:-----|:--------|:------------|
| `App.jsx` | ~36 | Robot emoji in hero card | `<Bot size={48} strokeWidth={1.5} />` |
| `App.jsx` | ~52 | Lightning emoji (Feature: RAG) | `<Zap size={24} />` inside icon circle |
| `App.jsx` | ~57 | Lock emoji (Feature: Security) | `<ShieldCheck size={24} />` inside icon circle |
| `App.jsx` | ~62 | Rocket emoji (Feature: I/O) | `<Gauge size={24} />` inside icon circle |

### Icon Circle Component Pattern
```jsx
// Reusable pattern for feature icons
const IconCircle = ({ icon: Icon }) => (
  <div style={{
    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
    background: 'var(--color-accent-light)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)'
  }}>
    <Icon size={24} color="var(--color-accent)" strokeWidth={1.5} />
  </div>
);
```

---

## 9. CSS Architecture (Tailwind Utility-First)

### File Structure

```
frontend/
  tailwind.config.js
  src/
    index.css         # @tailwind base; @tailwind components; @tailwind utilities;
    components/
      Button.jsx      # Uses Tailwind classes (e.g. `bg-accent text-white px-4 py-2 rounded-md`)
      Card.jsx        # Uses Tailwind classes (e.g. `border border-border rounded-lg shadow-sm`)
      Navbar.jsx      # Uses Tailwind classes (e.g. `fixed w-full h-16 bg-white border-b`)
      Sidebar.jsx     # Uses Tailwind classes
      Footer.jsx      # Uses Tailwind classes
      UploadForm.jsx  
      ChatBox.jsx     
```

### Anti-Patterns to Eliminate

| Anti-Pattern | Current Codebase Instances | Fix |
|:-------------|:---------------------------|:----|
| Inline `style={{ }}` props | Every component and page file | Replace with Tailwind utility classes |
| Hardcoded color values | `#fafafa`, `#ef4444`, `rgba(...)` scattered throughout | Replace with `bg-background-secondary`, `text-error`, etc. |
| Emoji characters in JSX | 4 instances in `App.jsx` | Replace with `lucide-react` components |
| Custom CSS classes | `.minimalist-card`, `.glass-container`, `.btn-primary` | Delete all custom CSS classes and use Tailwind utilities exclusively |

---
*© 2026 Djembar Arafat. All Rights Reserved.*

# Winterior Design — Site Analysis Document
**For AI-to-AI Comparison**

> Generated from codebase audit on 2026-09-03. Covers design tokens, layout patterns, typography, color, motion, components, accessibility, performance, UX conventions, and identifiable design DNA.

---

## 1. Brand & Positioning

- **Brand name**: WINTERIOR DESIGN
- **Tagline / niche**: Kitchen, wardrobe, and bath vanities centre in Nairobi
- **Tone**: restrained luxury, material-focused, craft-forward
- **Primary contact**: info@winteriordesign.co.ke, +254 728 846 560 / +254 755 164 654
- **Address**: Enterprise Rd, Opp Hillocks Hotel, Industrial Area, Nairobi, P.O. Box 39254-00623
- **WhatsApp integration**: Selection bar generates pre-filled inquiry message with selected project titles

### Design positioning signals
- Serif display type + clean sans body = "luxury editorial"
- Warm neutral palette with single metal accent (aged brass) = "tactile, material-led"
- 4:5 image aspect ratio in grid = editorial / magazine layout convention
- Dark overlay on images with gradient = drama + legibility balance

---

## 2. Design Token System

### 2.1 Colors
```
background:     #FAF8F5  (warm ivory / cream)
foreground:     #1A1A18  (near-black, warm)
limestone:      #E8E4DE  (section dividers, subtle backgrounds)
plaster:        #F5F2ED  (hover states, card backgrounds)
charcoal:       #2C2C2C  (dark overlays, detail view background)
warm-ivory:     #FAF8F5  (alias of background)
aged-brass:     #A68A64  (PRIMARY ACCENT — links, active states, selection)
deep-green:     #3A4F41  (secondary / earthy)
warm-gray:      #8A8580  (secondary text, muted labels)
stone:          #B5AFA8  (borders, scrollbar thumb)
sand:           #D4CFC7  (dividers, subtle borders)
moss:           #5A6B5E  (rarely used)
earth:          #6B5D52  (rarely used)
cream:          #F0EBE3  (text-on-dark, light surfaces)
```

**Accent rule**: Single accent color (aged-brass) used for all interactive highlights, active nav indicators, selection states, and glow effects. No multi-color system.

**Contrast pattern**: Dark text on light backgrounds (foreground/background pair). Light text on dark overlays (cream/charcoal). No pure black-on-white; all colors are warm-shifted.

### 2.2 Typography
```
Display: Cormorant Garamond
  Weights: 300, 400, 500, 600, 700
  Usage: All headings (H1–H3), project titles, navigation logo, pull quotes
  Style: Classic serif, high contrast, editorial feel
  Tracking: Usually tight/normal (-0.02em to 0), sometimes wide on labels

Body: DM Sans
  Weights: 300, 400, 500, 600, 700
  Usage: Body copy, labels, buttons, navigation, captions, metadata
  Style: Geometric sans-serif, clean, modern
  Tracking: Wide on labels (0.25em–0.4em), normal on body

Scale pattern:
  Hero H1:  text-5xl md:text-7xl lg:text-[8.5rem] xl:text-[10rem]  (up to ~160px)
  Page H1:  text-4xl md:text-6xl lg:text-7xl
  Section H2: text-3xl md:text-5xl lg:text-6xl
  Card H3:  text-2xl md:text-3xl
  Body:     text-sm md:text-[15px]
  Label:    text-[10px] with tracking-[0.3em] uppercase
```

**Font loading**: Next.js Google Fonts with `display: swap` behavior. Variables `--font-cormorant` and `--font-dm-sans`.

### 2.3 Spacing & Layout
```
Horizontal padding:  px-4 (mobile) → md:px-12 → lg:px-16
Vertical rhythm:    py-20 md:py-28 (major sections), pb-32 (bottom breathing room)
Grid system:        12-column implicit via Tailwind (md:grid-cols-12)
Gallery grid:       1 col (mobile) → sm:grid-cols-2 → lg:grid-cols-3
Gap pattern:        gap-4 md:gap-6 (gallery), gap-px (offers dividers)
```

**Whitespace philosophy**: Generous vertical spacing, content doesn't touch edges, sections breathe. "Less is more" with intentional asymmetry.

### 2.4 Border & Divider System
```
Border color:       border-sand/30, border-foreground/25, border-cream/10, border-cream/30
Border width:       1px (subtle), 2px (active states)
Dividers:           Top borders on footer, offers section, studio section
No heavy box shadows: Only subtle shadow on selection bar (shadow-2xl) and slider glow
```

---

## 3. Component Architecture

### 3.1 Core Layout Components
```
Preloader        — Full-screen cream overlay, thin loading line + "Loading" text, 2.5s safety timeout
Navigation       — Fixed header, transparent→blur on scroll, mobile hamburger menu
Footer           — 4-column grid, bordered top, cream background
PageTransition   — Simple opacity fade (600ms) on pathname change
SmoothScrollProvider — Lenis smooth scroll wrapper
ScrollToTop      — Syncs window.scrollTo + lenis.scrollTo(0, {immediate:true})
```

### 3.2 Hero & Slider Components
```
ProjectSlider (homepage compact)   — GSAP clip-path reveal, Ken Burns, 2 eager + rest lazy images, prev/next buttons, pagination dots with glow
Hero (legacy/alternate?)           — Full-screen, GSAP ScrollTrigger parallax, 14-project autoplay, vertical pill nav
```

**Slider interaction model**:
- Horizontal swipe for image cycling (threshold 60px)
- Explicit prev/next buttons
- Keyboard arrow support
- Mobile: bottom active-slide indicator bar (brass line)
- Pagination dots with brass glow on active

### 3.3 Gallery Components
```
GalleryGrid       — Category filter chips, lazy-load tiles, IO fade-in, selection toggle, numbered index
SingleItemView    — Full-screen detail, left/right project nav edges, horizontal swipe, thumbnail strip, expandable details panel
SelectionBar      — Fixed bottom bar, shows selected count + titles, WhatsApp CTA + Clear
SelectionContext  — localStorage-backed selection state, WhatsApp message generation
```

**Gallery tile pattern**:
- 4:5 aspect ratio (portrait orientation)
- Gradient overlay (charcoal, bottom-heavy)
- Hover: subtle scale (1.03)
- Category label (uppercase, tiny)
- Project title (display font, light)
- Subtitle (italic)
- Selection button (top-right, brass when active)

### 3.4 Content Sections
```
OffersSection    — 3-column grid, "gap-px" dividers, GSAP scroll reveal, numbered cards
StudioSection    — 4-step process (Listen/Design/Craft/Install), materials palette, WIP image grid
WorkInProgress   — Masonry-like grid of construction photos, scroll-triggered reveal
ContactSection   — Split layout, form with placeholders, social icons (FB/X/IG inline SVG), lucide-react icons
ServicesSection  — Full-bleed hero image, translucent overlay, "What we do." centered text, offerings list
```

---

## 4. Interaction Design

### 4.1 Navigation Behavior
- **Scroll state**: Transparent at top → blurred background + shadow after 80px scroll
- **Mobile menu**: Full-screen overlay, staggered fade-up animation (0.1s per item), large display-type links
- **Active state**: Brass underline on desktop, brass text on mobile
- **Logo**: "WINTERIOR" (all caps, display font, tracking-tight)

### 4.2 Custom Cursor (Desktop Only)
```
Dot:     2px circle, foreground color, immediate follow
Ring:    36px circle (9x9 with border), 0.22 lerp follow, trailing effect
Hover:   Ring scales to 50%, fills with aged-brass/10, border becomes brass
Hide:    Pointer coarse devices, form inputs (via CSS cursor:none)
```

**Implementation**: Two separate elements (position vs scale) to avoid transform conflicts. `will-change: transform` for performance.

### 4.3 Gallery Interactions
- **Filter**: Category chips with count badges, active state = filled brass
- **Tile hover**: Scale image 1.03, 1000ms ease-out
- **Selection**: Toggle button top-right, immediate brass fill + checkmark
- **Lazy reveal**: IntersectionObserver with 200px rootMargin, 60ms stagger delay per tile
- **Back links**: Always point to `/` (home), not `/v5/gallery`

### 4.4 Detail View Interactions
- **Project navigation**: Edge-tap zones (left/right 16-28% width), cursor changes to w-resize/e-resize, hover reveals prev/next title
- **Image cycling**: Horizontal swipe (60px threshold), keyboard arrows
- **Details panel**: Tap main image to toggle expandable info panel (60vh max, scrollable)
- **Thumbnail strip**: Vertical on desktop (snap scroll), horizontal on mobile
- **Swipe hint**: Animated arrows + "Swipe to change image" text, dismisses on first interaction

### 4.5 Form Behavior
- **Contact form**: Name, email, phone, service select, message textarea
- **Submission**: Client-side only (sets submitted=true, no API call)
- **Validation**: None visible (placeholder-only)
- **Social links**: FB, X, IG inline SVG icons, no lucide equivalents

---

## 5. Motion Design

### 5.1 Animation Library
- **GSAP** (core + ScrollTrigger) for all scroll-triggered animations
- **CSS transitions** for hover states, opacity changes, color shifts
- **No Framer Motion**

### 5.2 Animation Patterns
```
Scroll reveal:
  Header:   y: 40 → 0, opacity 0→1, 0.9s, power3.out
  Cards:    y: 50 → 0, opacity 0→1, 0.9s, stagger 0.12s, power3.out
  WIP tiles: y: 40, opacity, scale 0.98→1, stagger 0.08s

Hero reveal (ProjectSlider):
  Clip-path inset reveal (0% 0% 100% → 0% 0% 0%)
  Ken Burns: scale 1.08 → 1.0 over 2.4s, power2.out
  Stagger: 0.18s between slides

Parallax (Hero component):
  Image scale 1.3→1.0 on load, then 1.0→1.2 on scroll (scrub: 1.2)
  Text y: -80, opacity 0 on scroll (scrub: 1)
  Overlay scaleY: 1→0→1 on scroll (scrub: 1)

Transition durations:
  Hover:    300ms (color), 700ms (bg), 1000ms (image scale)
  Slider:   850ms–1050ms (clip-path)
  Page:     600ms (opacity fade)
```

### 5.3 Reduced Motion
- Global `prefers-reduced-motion: reduce` media query kills all animations
- Slider: `clearProps: "all"` on all slides
- Ken Burns: disabled
- ScrollTrigger: not initialized

---

## 6. Accessibility

### 6.1 Implemented
- Skip link (top-left, slides in on focus)
- `focus-visible` ring (2px aged-brass, 3px offset)
- ARIA labels on interactive elements
- `aria-roledescription="carousel"` and `"slide"`
- `aria-live="polite"` on pagination counter
- `aria-expanded` on details toggle
- `aria-pressed` on selection buttons
- Keyboard navigation (arrows, escape)
- `role="grid"`, `role="tablist"`, `role="gridcell"` on gallery
- `alt` text on all images (project + sequential numbering)
- Decorative images: `alt=""`

### 6.2 Gaps / Notes
- No skip link on single item view (fixed overlay)
- Contact form has no validation messaging
- No `aria-busy` during selection hydration
- Social icons lack accessible names (inline SVG without `aria-label`)

---

## 7. Performance Strategy

### 7.1 Image Optimization
```typescript
// next.config.ts
formats: ["image/avif", "image/webp"]
deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920]
imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384, 512, 768]
minimumCacheTTL: 60 * 60 * 24 * 30  // 30 days
```

### 7.2 Loading Strategies
```
Eager:   First 2 slider images, first 3 gallery tiles (priority="high", loading="eager")
Lazy:    Rest of gallery (loading="lazy", decoding="async")
Blur:    SVG base64 placeholder (cream color) on all Next.js Images
Preload: Dynamic <link rel="preload"> on slider index change (current ± 1)
IO:      Gallery tiles use IntersectionObserver (200px rootMargin)
CV:      content-visibility: auto on gallery tiles
```

### 7.3 Cursor Performance
- `will-change: transform` on cursor elements
- `requestAnimationFrame` for ring interpolation
- `transform: translate3d` for GPU acceleration
- Throttled state updates via `performance.now()` check

---

## 8. UX Conventions

### 8.1 Navigation Flow
```
Home → Work → Gallery → Single Item → (back to home, not gallery)
Home → Studio → Process → WIP
Home → Services → Offerings
Home → Contact → Form
```

### 8.2 Selection Pattern
- Persistent across sessions (localStorage)
- Floating bar with project titles truncated
- WhatsApp deep link with pre-filled message
- Clear button resets selection

### 8.3 Empty / Error States
- Missing project: Full-screen charcoal, "Not catalogued" / "Missing entry" with return link
- Empty category: Centered text "No projects in this category yet."

### 8.4 Micro-interactions
- Hover: Image scale (1.03), text color shift, border glow
- Active: Brass fill on buttons, checkmark appears
- Focus: Brass ring on all interactive elements
- Cursor: Ring scales down + fills on interactive elements

---

## 9. Technical Stack

```
Framework:      Next.js (App Router)
Styling:        Tailwind CSS v4 (with @theme inline for custom tokens)
Animation:      GSAP + ScrollTrigger
Icons:          lucide-react (Mail, Phone, MapPin, ArrowUpRight, Check)
Fonts:          Next/font/google (Cormorant Garamond + DM Sans)
Scroll:         Lenis (smooth scroll)
Images:         Next/Image (optimized)
State:          React Context (SelectionContext) + useState
Storage:        localStorage (selection persistence)
TypeScript:     Strict mode
```

---

## 10. File Structure (Key Files)

```
src/
  app/
    layout.tsx                    — Root layout, providers, fonts
    page.tsx                      — Homepage (hero + offers + gallery)
    globals.css                   — Design tokens, cursor styles, scrollbar, reduced motion
    work/page.tsx                 — Work listing (GalleryGrid)
    studio/page.tsx                — Studio page (process + WIP)
    services/page.tsx              — Services hero + offerings
    contact/page.tsx               — Contact section wrapper
  components/
    Navigation.tsx                 — Header, mobile menu
    Footer.tsx                    — Site footer
    CustomCursor.tsx               — Dot + ring cursor
    Preloader.tsx                  — Loading screen
    PageTransition.tsx             — Route transition
    ScrollToTop.tsx                — Lenis-aware scroll reset
    SmoothScrollProvider.tsx       — Lenis wrapper
    ProjectSlider.tsx              — GSAP hero slider
    Hero.tsx                      — Legacy full-screen hero
    OffersSection.tsx              — 3-card value props
    StudioSection.tsx              — 4-step process
    WorkInProgress.tsx             — Construction photo grid
    ContactSection.tsx             — Contact form + info
    ServicesSection.tsx            — Services offerings
    variants/v5/
      GalleryGrid.tsx              — Filterable project grid
      SingleItemView.tsx           — Full-screen project detail
      SelectionBar.tsx             — Floating selection bar
      SelectionContext.tsx         — Selection state + WhatsApp link
  lib/
    projects.ts                   — 14 projects, types, helpers
    lenis-context.tsx             — Lenis context provider
  types/
    lucide-react.d.ts             — (removed, package ships types)
```

---

## 11. Design DNA — Comparison Metrics

### For AI comparison, score this site on:

**A. Visual Identity**
- [x] Single accent color system (brass)
- [x] Warm neutral base (cream/ivory)
- [x] Serif display + sans body pairing
- [x] Editorial 4:5 image ratio
- [x] High contrast dark overlays
- [ ] Logo animation / SVG logo mark
- [ ] Gradient brand elements beyond overlays

**B. Layout Patterns**
- [x] Asymmetric hero (text + image split)
- [x] Full-bleed image sections
- [x] Generous vertical whitespace
- [x] Grid-based gallery (1/2/3 columns)
- [x] Fixed overlay navigation
- [ ] Horizontal scrolling sections
- [ ] Staggered / overlapping layouts

**C. Motion Design**
- [x] GSAP scroll-triggered reveals
- [x] Clip-path transitions
- [x] Ken Burns effect
- [x] Staggered card entrances
- [x] Smooth scroll (Lenis)
- [x] Page transition fade
- [ ] SVG path animations
- [ ] Text scramble / reveal effects
- [ ] 3D transforms / perspective

**D. Interaction Patterns**
- [x] Custom cursor (desktop)
- [x] Horizontal swipe (mobile)
- [x] Edge-tap navigation (detail view)
- [x] Selection + share (WhatsApp)
- [x] Category filtering
- [x] Keyboard navigation
- [ ] Drag-to-reorder
- [ ] Infinite scroll
- [ ] Search / autocomplete

**E. Accessibility**
- [x] Skip link
- [x] Focus indicators
- [x] ARIA labels/roles
- [x] Reduced motion support
- [ ] Screen reader testing evidence
- [ ] Color contrast audit (WCAG 2.1 AA)
- [ ] Focus trap in modals

**F. Performance**
- [x] AVIF/WebP auto-negotiation
- [x] Lazy loading + eager first paints
- [x] Blur placeholders
- [x] IntersectionObserver
- [x] content-visibility
- [x] 30d image cache TTL
- [ ] Critical CSS extraction
- [ ] Font subsetting evidence
- [ ] Third-party script audit

**G. Content Strategy**
- [x] Project-centric storytelling
- [x] Material specifications
- [x] Location + year metadata
- [x] Category taxonomy
- [x] Social proof (awards, consultation)
- [ ] Blog / journal content
- [ ] Team / about photography
- [ ] Testimonials / case studies

---

## 12. Differentiators & Quirks

1. **WhatsApp as primary conversion**: No contact form submission; selection generates WhatsApp deep link. Unusual for high-end design sites (typically email or CRM).

2. **Edge-tap navigation**: Project switching requires tapping left/right 16-28% of viewport. Novel but discoverability risk — relies on hint text.

3. **Brass-only accent**: Restrained palette means all interactive feedback uses one color. Can feel monotone but maintains luxury restraint.

4. **4:5 image ratio**: Consistent across gallery tiles and many project photos. Editorial/magazine convention but less common in web portfolios (which often use 16:9 or 1:1).

5. **No pricing / CTA buttons**: Site is showcase-focused. No "Request Quote" buttons on tiles, only WhatsApp from selection bar.

6. **Single-item view as full-screen overlay**: Not a separate route with its own layout — fixed `z-50` div. Affects scroll behavior and URL structure.

7. **Project count**: 14 static projects, 4 categories. Moderate scale — manageable without pagination.

8. **Preloader**: 2.5s safety timeout + window load. Can feel slow on fast connections.

---

## 13. Comparison Checklist for Another AI

When comparing this site to another, evaluate:

| Dimension | This Site | Benchmark |
|-----------|-----------|-----------|
| Color system | Warm neutral + brass accent | [other] |
| Typography pairing | Cormorant Garamond + DM Sans | [other] |
| Image aspect ratio | 4:5 (portrait editorial) | [other] |
| Hero interaction | GSAP clip-path + Ken Burns | [other] |
| Gallery filtering | Category chips with counts | [other] |
| Mobile gestures | Swipe images, edge-tap projects | [other] |
| Conversion path | WhatsApp deep link | [other] |
| Scroll behavior | Lenis smooth + ScrollTrigger parallax | [other] |
| Selection state | localStorage + floating bar | [other] |
| Accessibility | Skip link, focus ring, reduced motion | [other] |
| Performance | AVIF/WebP, blur placeholders, IO | [other] |
| Load state | Preloader with safety timeout | [other] |

**Suggested comparison questions**:
1. Does the other site use a multi-accent or single-accent system?
2. Is the hero a static image, video, or animated slider?
3. What is the primary conversion action (form, email, WhatsApp, phone)?
4. How does mobile navigation differ (hamburger, tab bar, bottom sheet)?
5. What motion libraries are used (GSAP, Framer, CSS, none)?
6. Are images served in modern formats (AVIF, WebP)?
7. Is there a selection/wishlist pattern?
8. How is scroll handled (native, Lenis, locomotive, other)?
9. What is the typography pairing strategy (serif/sans, mono, single)?
10. Are there accessibility audits or compliance claims?

---

## 14. Potential Comparison Advantages

- **Restraint**: Fewer colors, fewer fonts, fewer animations than typical agency sites. Can feel more premium.
- **Material storytelling**: Project cards include materials list, not just imagery.
- **WhatsApp integration**: Direct-to-chat conversion (if target audience uses WhatsApp).
- **Performance-first image handling**: AVIF, blur placeholders, eager first paints.
- **Accessibility baseline**: Skip link, focus states, reduced motion respected.

## 15. Potential Comparison Weaknesses

- **Discoverability**: Edge-tap navigation and swipe gestures need explicit hints.
- **Content depth**: No blog, team page, or detailed case studies.
- **Form feedback**: Contact form has no validation or success messaging.
- **Preloader timing**: Fixed 2.5s safety timeout can feel sluggish.
- **Single accent**: Risk of visual monotony on long-scrolling pages.
- **No pricing/CTA**: May deter users seeking immediate quotes.

---

*End of analysis. This document is intended for AI-to-AI comparison and should be read alongside live site inspection.*

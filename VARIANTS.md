# Variants Reference

A single source of truth for every visual variant of the Kim Interior Designs
client portfolio. The intent: any change to a variant touches exactly the
files listed under that variant's **Scope**, and any design question can be
answered by grepping this document.

All variants render the same underlying data (`src/lib/projects.ts`) and the
same images, but the **what** (data) is constant while the **how** (style) is
deliberately different. This file exists so a fourth, fifth, or tenth variant
can be designed without re-deriving the system, and so any two variants can
be cross-compared in seconds.

---

## Index

| ID | Codename | Mood | Routes | Component dir |
|----|----------|------|--------|---------------|
| v1 | **Editorial** | Magazine / residential spread | `/work`, `/projects/[slug]` | `src/components/{ProjectsSection,HorizontalProjects}.tsx` + `src/app/{work,projects/[slug]}/page.tsx` |
| v2 | **Archive** | Brutalist catalogue / specimen register | `/v2/work`, `/v2/work/[slug]` | `src/components/variants/v2/ArchiveIndex.tsx`, `src/components/variants/v2/ArchivePlate.tsx` |
| v3 | **Viewing** | Private gallery / luxury exhibit | `/v3/work`, `/v3/work/[slug]` | `src/components/variants/v3/GalleryIndex.tsx`, `src/components/variants/v3/GalleryPlate.tsx` |
| v4 | **Collision** | Architecture/furniture editorial publication | `/v4/work`, `/v4/work/[slug]` | `src/components/variants/v4/CollisionIndex.tsx`, `src/components/variants/v4/CollisionPlate.tsx` |
| v5 | **Gallery** | Visual product gallery with multi-select + WhatsApp share + full-screen single item view | `/v5/gallery`, `/v5/gallery/[slug]` | `src/components/variants/v5/{GalleryGrid,SingleItemView,SelectionBar,SelectionContext}.tsx` + `src/app/v5/gallery/{layout,page}.tsx` + `src/app/v5/gallery/[slug]/page.tsx` |

**Switching**: small bordered "Archive" / "Viewing" / "Collision" links
in the top nav (`Navigation.tsx`) point to v2, v3, and v4
respectively. **v5 is the default**: the home `/`, `/work`, and
`/projects/[slug]` all render v5 components. `/v5/gallery` and
`/v5/gallery/[slug]` remain as alias routes for backwards-compatibility
with any existing links.

---

## v1 — Editorial

**Codename**: Editorial
**Mood**: Restrained residential-magazine spread. Cream-on-charcoal serif
type, generous whitespace, soft gradients on full-bleed imagery.
**Aesthetic reference**: Aria, Apartamento, Cereal.

### Tokens

| Token | Value |
|-------|-------|
| `--background` | `#f4f1ea` (cream — `bg-background` from Tailwind theme) |
| `--foreground` | `#0a0a0a` (charcoal — `text-foreground`) |
| `--cream` | `#f4f1ea` (image overlay type) |
| `--charcoal` | `#0a0a0a` |
| `--warm-gray` | `text-warm-gray` (metadata) |
| `--stone` | `text-stone` |
| `--sand` | `border-sand/30` |
| `--aged-brass` | `#a37e2c`-ish — accent (active link underline, hover state) |
| Display font | `Cormorant Garamond` (light, italic for subtitles) — `font-display` |
| Body font | `DM Sans` — `font-body` |
| Display weight | 300 (light) for titles; italic 300/400 for accent words |
| Body weight | 300–500, tracking 0.25em uppercase for nav, 0.3–0.4em for labels |
| Grid | 2-col mosaic on `ProjectsSection` (varied aspect ratios `4/5`, `3/4`, `16/10`, `1/1`) |
| Spacing | `py-24 md:py-32` section padding, `px-6 md:px-12` gutters |
| Motion | GSAP fade-up on scroll, `power4.out` for hero, `power3.out` for grid; 0.7–1.4s; image scale 1 → 1.05 on hover; 700ms ease-out |
| Imagery rule | Soft gradient `from-charcoal/90 via-charcoal/30 to-charcoal/50` over hero image |

### Components (scope of v1)

- `src/app/work/page.tsx` — `WorkPage` (header + ProjectsSection or HorizontalProjects by breakpoint)
- `src/app/projects/[slug]/page.tsx` — `ProjectPage` (hero + grid + prev/next)
- `src/components/ProjectsSection.tsx` — desktop grid (2-col, varying aspect)
- `src/components/HorizontalProjects.tsx` — mobile horizontal scroll
- `src/components/Hero.tsx` — home hero with GSAP intro (also references v1 tokens)

### Signature

- Editorial italic accent words inside otherwise-roman display titles
  (e.g. *Selected* **Work**, *Spaces* **crafted** with intent).
- Cream-on-charcoal type over photo; never pure black on white.
- Aspect ratio varies per card to break the grid rhythm.

### v1 — Editorial: Architecture & UI/UX Deep-Dive

Same shape as the v4 deep-dive below: **why** each piece exists, **what**
each library is doing, **how** to change it without breaking the brief.

#### Design intent, in one sentence

A residential-magazine spread. The reader should feel they are looking at
a published interior-design feature, not a SaaS landing page. **Restraint
is the design system.**

#### Library inventory and role

| Library | Role in v1 | Why this library |
|---|---|---|
| `next` (App Router) | File-system routing for `/work` and `/projects/[slug]`, server components for `ProjectPage` and `WorkPage`, RSC streaming | Lets the home page stay server-rendered while the grid and hero stay client. Default of the project. |
| `react` | Hooks (`useState`, `useEffect`, `useRef`), event handlers, conditional rendering | Standard. v1 state is just `hoveredId` and `currentImage`. |
| `next/image` | All photography | Forces `priority` on the home hero; lazy by default elsewhere. The hero `setInterval` cycles the *image* (not the URL fragment), so `Image` is the right primitive. |
| `gsap` + `gsap/ScrollTrigger` | Home hero intro, scroll reveals across `ProjectsSection`, the hero parallax | v1 is the **most motion-heavy** variant. Every section uses a `ScrollTrigger`. Easing is `power3.out` / `power4.out`. |
| `@gsap/react` | `useGSAP` helper, registered in `Hero.tsx` | Available for a future cleanup. Today, v1 still uses raw `useEffect` + `gsap.context`. |
| `lenis` (via `SmoothScrollProvider`) | Inertial scroll | Works behind GSAP without competing. |
| `tailwindcss` | All styling | Same as v4. v1 also pulls in a small set of custom theme colors (`bg-background`, `text-cream`, `text-warm-gray`, `text-aged-brass`, `border-sand/30`) defined in the root `tailwind.config.*`. |
| **No** Framer Motion, **no** inline SVG sketches, **no** new fonts | — | v1 is intentionally photograph-led. Any decoration would fight the photography. |

#### Color system

v1 uses the **same three-token system as v4** (cream / charcoal / aged
brass) but spends them differently:

- **Cream** is the page and the type. The hero *is* a charcoal photograph
  with cream type over it.
- **Charcoal** is the type on cream *and* the substrate under the cream
  hero type. A `from-charcoal/90 via-charcoal/30 to-charcoal/50` gradient
  on the home hero gives the cream type a charcoal mid-tone to read
  against. This is the only gradient in v1, and it exists for *legibility*,
  not style.
- **Aged brass** appears only in: the active-link underline in the nav
  (`bg-aged-brass`), the active-link text color, and a single
  `hover:text-aged-brass` on the project-detail "Previous / Next" links.
  Never a fill. Never a background.

If you flip the background to dark:

- All `text-foreground` becomes `text-cream`.
- All `text-warm-gray` (metadata) must be re-tuned: it was chosen to
  read on cream. On dark, switch to a higher-luminance neutral
  (e.g. `text-cream/60`).
- The hero gradient must *invert* (`from-cream/90 via-cream/20 to-cream/40`)
  or the cream type will disappear.
- The aged-brass underline on the active link still works, but consider
  raising its opacity or shifting to a warmer gold against dark.

#### Type system

| Register | Font | Style | Where |
|---|---|---|---|
| Display | `Cormorant Garamond` (`font-display`), `font-light`, often *with one italic word* inside an otherwise-roman headline | Hero "Spaces **crafted** with intent", section titles, project titles | Hero, sections, project detail. |
| Body | `DM Sans` (`font-body`), `text-sm`–`text-base` | Description copy, paragraph text | Body, project detail description. |
| Label | `DM Sans`, `text-[10px]`–`text-xs`, `tracking-[0.25em]`–`tracking-[0.4em]`, uppercase | Nav links, category labels, scroll prompt | Marginalia. |

The italic accent word inside the display headline is the v1 signature
typographic gesture. Drop it and v1 collapses into "generic editorial
template". Keep it.

#### Layout system

v1 is the *only* variant with a fixed 2-column photo mosaic. Aspect ratios
are pre-shuffled by index (`4/5`, `3/4`, `16/10`, `1/1`, …) so the
overall shape is uneven. The shuffling is the layout's whole point.

The project detail page is a 3-col grid: a 1-col metadata strip
(`Year / Location / Materials`) and a 2-col content block (description
plus 2-col image grid). The first body image is 16:9 across the full
content column; the rest are square.

If you flip from a 2-col mosaic to a 3-col grid:

- The aspect-shuffle becomes wrong. A 3-col grid reads better with
  *uniform* aspect (`1/1` or `3/4`) and the layout loses its "magazine
  spread" quality. Either keep the shuffle, or move to v2-style
  table-of-rows.
- The "VIEW PROJECT" hover-reveal scale (1.05 on the image) becomes
  cramped at three columns; consider a 1.03 cap.

#### Spacing and rhythm

- Section padding: `py-24 md:py-32`. This is larger than v4 — v1 is
  *uncrowded by default*, not by an overlap word.
- Grid gap: `gap-4 md:gap-6`. Small gaps so the photo fields dominate.
- Hero: `h-screen` and `h-[70vh]` for the project-detail cover. The home
  hero always fills the viewport.
- Body padding: `px-6 md:px-12`. Same as v4.

If you reduce section padding to `py-12`, v1 immediately looks like a
"premium agency site". Do not go below `py-16`.

#### Imagery rules

- Same `next/image` discipline as v4: `fill` + `object-cover` + `sizes`
  on every image.
- `priority` is set on the home hero image and the project-detail cover.
  Everywhere else, lazy.
- The home hero cycles the image with a `setInterval` (7s). When the
  image swaps, GSAP fades-and-scales the new image in (`scale: 1.3 →
  1.0`, `opacity: 0 → 1`).
- The image-overlay gradient is the only v1 image treatment. No
  grain, no duotone, no corner stamps.

If you change the home-hero cycle interval:

- Below 4s: feels like a stock carousel.
- Above 10s: viewers don't see the second image.
- The 7s value is editorial, not UX. It matches a print-magazine page
  turn.

#### Motion budget (the largest in the project)

v1 runs *significantly more* animation than v4. Listed exhaustively:

| Animation | Trigger | From → To | Duration | Easing | Where |
|---|---|---|---|---|---|
| Hero overlay reveal | Mount | `scaleY: 1, transformOrigin: top` → `scaleY: 0` | 1.4s | `power4.out` | Hero, after a 0.3s delay |
| Hero image scale-in | Mount | `scale: 1.3, opacity: 0` → `scale: 1, opacity: 1` | 2.0s | `power4.out` | Hero image, offset `-=1` |
| Hero text reveal | Mount | `y: 120, opacity: 0, rotateX: -15` → `y: 0, opacity: 1, rotateX: 0` | 1.4s, stagger 0.12 | `power4.out` | Hero text children |
| Hero image scroll parallax | Scroll | `scale: 1 → 1.2` | scrub 1.2s | linear | Hero image |
| Hero text scroll-out | Scroll | `y: 0 → -80, opacity: 1 → 0` | scrub 1s | linear | Hero text block |
| Hero overlay scroll-revert | Scroll | `scaleY: 0 → 1, transformOrigin: bottom` | scrub 1s | linear | Hero overlay |
| Section header fade-up | `top 85%` | `y: 60, opacity: 0` → `y: 0, opacity: 1` | 1.2s | `power3.out` | `ProjectsSection` header |
| Card fade-up | `top 88%` | `y: 80, opacity: 0` → `y: 0, opacity: 1` | 1.1s, delayed 0.1s on odd cards | `power3.out` | Every project card |
| Card hover | Pointer enter | `scale: 1 → 1.05` on inner image | 1.0s | ease-out | Card image |
| Card "View Project" reveal | Pointer enter | `opacity: 0 → 1, translateY: 2 → 0` | 500ms | ease-out | "View Project" footer in card |

If you need to **reduce motion** (a11y, `prefers-reduced-motion`, or just
visual noise):

- Drop the scroll-driven hero parallax block (lines 53–83 of `Hero.tsx`).
- Drop the per-card stagger (lines 45–61 of `ProjectsSection.tsx`).
- Keep the mount-time hero intro. It is the entry to the page; reducing
  it is fine, removing it leaves a static frame.
- Never wrap the parallax in `if (prefersReduced)` *after* GSAP has
  registered; gate it at the `useEffect` top instead.

#### Component composition map

```
src/app/page.tsx                              (server component)
  ├─ <Hero />                                 (client — GSAP intro + scroll parallax)
  ├─ <ProjectsSection />  (≥ md)              (client — GSAP scroll reveals)
  ├─ <HorizontalProjects /> (< md)            (client — horizontal scroll, no GSAP)
  ├─ <StudioSection />                        (client — light motion)
  ├─ <ServicesSection />                      (client — light motion)
  └─ <ContactSection />                       (client — light motion)

src/app/work/page.tsx                         (server component)
  ├─ header
  ├─ <ProjectsSection />   (≥ md)
  └─ <HorizontalProjects /> (< md)

src/app/projects/[slug]/page.tsx              (server component)
  ├─ hero (cover image + title block)
  ├─ 3-col grid: meta (1) | description + 2-col image grid (2)
  └─ prev/next footer
```

#### State and data flow

- `Hero` owns `currentImage` (cycling index) and `isLoaded` (mounted).
- `ProjectsSection` owns `hoveredId` for the year-chip on hover.
- `HorizontalProjects` owns horizontal-scroll position.
- `ProjectPage` is a server component and reads from
  `projectById(slug)` synchronously — no client fetch.

#### How to extend v1 without breaking the brief

1. **Adding a new card aspect.** Add to the `aspectClasses` array in
   `ProjectsSection.tsx`. Never use the same aspect twice in a row; the
   shuffle is the layout's identity.
2. **Adding a section.** The home page sections are *unrelated* to one
   another (Studio, Services, Contact). Each has its own light-motion
   behavior. Keep the cross-section rhythm `py-24 md:py-32`; do not let
   any one section become the visual boss.
3. **Tightening motion.** See the table above. There are eight
   animations. Removing one is fine. Adding a ninth is allowed only if a
   tenth is removed in the same PR.
4. **Replacing Cormorant Garamond.** Read the *Adding a new font* rule
   in the v4 deep-dive. Same applies here.

#### Gaps and opportunities (v1)

- The home hero cycle interval is 7s. If the user is mid-scroll during a
  swap, the image changes underneath their gaze. A possible fix:
  pause the cycle while the hero is out of view (use an
  `IntersectionObserver` in `Hero.tsx`).
- The project-detail "Next" link wraps from the last project to the
  first (`projects.length`). This is intentional in a 6-project
  collection but reads oddly with a 50+ project list.
- The italic accent word in the headline is hardcoded per-page
  ("crafted", "Selected"). A future v1+ could source the italic word
  from the project data and let the editor choose it.
- `prefers-reduced-motion` is *not* honored. v1 is the variant where
  this hurts the most. See the *Tightening motion* rule above.

#### How to read this section in 60 seconds

- Residential-magazine spread. Restraint is the design system.
- Two fonts, three colors, one gradient (on the hero, for legibility).
- The italic accent word inside the headline is v1's signature. Drop
  it and the variant dies.
- Motion is GSAP-heavy (eight animations, mostly scroll-driven).
- Components live in `src/components/` (not under `variants/v1/`)
  because v1 is the *default*; the home page uses them.

---

## v2 — Archive

**Codename**: Archive
**Mood**: Brutalist specimen register. Hairline rules everywhere, monospace
metadata, no decoration for its own sake. Reads like a museum archive or
architectural plate index.
**Aesthetic reference**: Bauhaus print, MoMA archive, Wim Crouwel.

### Tokens

| Token | Value |
|-------|-------|
| Background | `#f4f1ea` (bone) |
| Foreground | `#0a0a0a` (black) |
| Display font | `font-sans` (system sans), `font-black`, `tracking-tighter`, `uppercase` |
| Body / metadata | `font-mono` (system mono), `text-[10px]`, `tracking-[0.2em]`, `uppercase` |
| Borders | 1px solid `#0a0a0a` — drawn between every cell, no rounded corners |
| Accents | None. The image content is the only color. |
| Grid | 12-col, every cell border-separated; tables not cards |
| Spacing | Tight — `p-4 md:p-6` per cell, `p-6 md:p-10` for hero cells |
| Motion | Static. Hover swaps bg/fg on the row; hover reveals a floating 48×32 thumbnail at row midpoint (desktop only). No animation libs. |
| Imagery rule | Plates carry corner stamps `PL. NN`, `KIM-INT / SLUG`, location. Hover thumbnails are small specimen swatches. |

### Components (scope of v2)

- `src/app/v2/work/page.tsx` — `V2WorkPage`
- `src/app/v2/work/[slug]/page.tsx` — `V2ProjectPage`
- `src/components/variants/v2/ArchiveIndex.tsx` — header strip, catalogue heading, entries table, materials grid
- `src/components/variants/v2/ArchivePlate.tsx` — sticky header, dossier, specimen, materials, plate index, prev/next

### Signature

- "Entry №" / "Plate NN / MM" / "§ 02 / Entries" framing copy throughout.
- Hover-on-row → floating thumbnail (desktop only) gives a tactile "filing through a drawer" feel.
- Sticky plate-detail header shows running entry number and active plate counter.
- Border-everywhere layout; the page is a grid of tables.

### v2 — Archive: Architecture & UI/UX Deep-Dive

v2 is the **information-density** variant. It exists to answer the
question "what if the portfolio read like a museum specimen register?"
Everything below describes how it gets there.

#### Design intent, in one sentence

A working archive. The reader is a researcher; the page should reward
scanning, counting, and cross-referencing the way a paper catalogue does.

#### Library inventory and role

| Library | Role in v2 | Why this library |
|---|---|---|
| `next` (App Router) | Routing for `/v2/work` and `/v2/work/[slug]`, server components for the route files | Same as v4. The route files are minimal; all the visual is in the variant component. |
| `react` | `useState` for the active hover row; no `useEffect` | v2 has *no* mount-time work, *no* animation, *no* scroll observers. This is the variant that proves the architecture supports a "no-motion" sub-site. |
| `next/image` | Photography and the floating hover thumbnail | The hover thumbnail is a small `48×32` specimen swatch that appears at the row midpoint. `next/image` keeps the per-image optimization intact. |
| `gsap` | **Not used.** v2 is animation-free. | The point of v2 is to be legible. Motion would compete with the table grid. |
| `lenis` (via shared chrome) | Inertial scroll | Still applied to v2 because the chrome is global. The motion is *inertial*, not *animated*. |
| `tailwindcss` | All styling | The v2 component is the most "raw Tailwind" of the four variants — almost every visual decision is a single utility. |
| **No** new fonts | — | v2 uses the system monospace stack (`font-mono`) for *all* metadata. No font is loaded. |

#### Color system

v2 is the **monochrome** variant. It uses exactly two values, period:

- **Bone `#f4f1ea`** (`bg-background`, kept for consistency with the rest of
  the site) as the page. Could just as easily be `#ffffff` — v2 reads the
  same on either. The bone was kept only so the variant sits in the same
  family as v1 and v4.
- **Black `#0a0a0a`** for *every* type and *every* border.

There is no accent color. There is no secondary surface. There is no
gradient.

If you flip the background to dark:

- Every `text-foreground` (charcoal) becomes `text-cream` (or `text-white`).
- Every `border-[#0a0a0a]` becomes `border-cream` (or `border-white`).
- The hover row's `hover:bg-[#0a0a0a] hover:text-[#f4f1ea]` and
  `group-hover:border-[#f4f1ea]/30` must both *invert* to the same pair.
- The floating thumbnail's frame is `border-[#0a0a0a]` outside the row
  and `border-[#f4f1ea]` inside. On dark, swap both.
- The plate-page corner stamps use `bg-[#f4f1ea] text-[#0a0a0a]` and
  `bg-[#0a0a0a] text-[#f4f1ea]` as inverted labels. On dark, these still
  invert correctly *only* because the page background flips too. Test
  every label.

If you add an accent color (resist this): v2 becomes v3, not "v2 with
a color". The accent is what makes v3 feel like a gallery and v2 feel
like an archive.

#### Type system

| Register | Font | Style | Where |
|---|---|---|---|
| Display | System sans, `font-black`, `uppercase`, `tracking-tighter` | Project titles in the table, page titles (`INDEX`, `ARCHIVE OF WORK.`) | Index, plate detail. |
| Body | System mono (`font-mono`), `text-[10px]`, `tracking-[0.2em]`, `uppercase` | Almost *everything* else. Headers, table cells, corner stamps, materials, even the footer "End of document" | Throughout. |
| Numerals | Mono, `tabular-nums` | Counts (entries, plates), project numbers (`01`, `02`, …) | Header strip, table. |

The mono-everywhere rule is the v2 signature. If you find yourself
wanting to introduce a serif for the project titles, you are designing
v3, not v2.

#### Layout system

v2 is the **table-of-rows** variant. The index is a 12-col grid, but every
project is rendered as a single row with:

- A 1/12 column for the index number (`01`, `02`, …).
- A 4/12 column for title + subtitle.
- A 2/12 column for category.
- A 2/12 column for year.
- A 2/12 column for location.
- A 1/12 column for plate count (right-aligned).

The 1/12 / 4/12 / 2/12 / 2/12 / 2/12 / 1/12 split is **not negotiable**.
Change it and the table stops reading as a table.

The plate detail page is a stack of horizontal sections, each of which is
itself a table:

- Header strip (3-col: back-link / entry + title / plate counter).
- Title section (3-col side label / 9-col title block).
- Specimen section (3-col § label / 9-col image + thumbnail strip).
- Dossier (3-col § label / 9-col 4-col metadata grid).
- Description (3-col § label / 9-col text block).
- Materials (3-col § label / 9-col grid of pills).
- Plate index (3-col § label / 9-col 4-to-5-col thumbnail grid).
- Prev / Index / Next footer (4-col / 4-col / 4-col).

If you flip from a table to a 2-col grid (resist): v2 becomes "v1 with
borders" and stops being a catalogue.

#### Spacing and rhythm

Tight, but never crowded:

- Cell padding: `p-4 md:p-6`.
- Section padding: `p-6 md:p-10` for the larger cells.
- The table cells are flush against each other (no `gap`); the borders
  do the separating.
- The header strip is `border-b border-[#0a0a0a]` with a single line.
  Adding a second line of "decoration" is not allowed — the variant is
  one-line-per-cell.

If you add vertical margins between rows (resist): the table collapses
into a card grid. v2 needs to feel like a printed page where the rules
*are* the spacing.

#### Imagery rules

- Same `next/image` discipline.
- No `priority` on the index — there is no hero image. v2's first
  content is a header strip and a heading.
- The floating hover thumbnail is a 192×128 specimen swatch (`w-48 h-32`)
  positioned at the row's vertical midpoint. It is the *only* motion in
  v2, and it is just an `opacity: 0 → 100` swap driven by `onMouseEnter`
  / `onMouseLeave`. No GSAP. No transition. Just CSS.
- The plate page's "specimen" frame is the one place v2 puts the
  photograph forward. It carries two pairs of corner stamps:
  - Top-left: `PL. NN`. Top-right: `Category / Year`.
  - Bottom-left: `KIM-INT / SLUG`. Bottom-right: `Nairobi` (or location).

If you replace the corner stamps with a single text label: v2 starts to
look like a normal portfolio. The stamps are the variant.

#### Motion budget (zero)

There is no motion in v2 aside from:

- The `hover:bg` swap on rows (instant; no transition timing).
- The `opacity` swap on the floating thumbnail (instant; no transition).
- The browser's default focus / active state on links and buttons.

Do not add `transition-*` classes to v2. Do not wrap the page in
`gsap.context`. Do not import any animation library. The variant's value
is its legibility, which motion would damage.

If you need to indicate "this row is the current project" (e.g. on the
plate page, the source row in the index): invert the row *statically*
(`bg-[#0a0a0a] text-[#f4f1ea]`). This is a presentational decision, not
a motion one.

#### Component composition map

```
src/app/v2/work/page.tsx                       (server component)
  └─ <ArchiveIndex />                          (client — only because of useState for hover)

src/app/v2/work/[slug]/page.tsx                (server component)
  └─ <ArchivePlate slug={slug} />              (client — useState for activePlate)
```

`<ArchivePlate>` does not re-use `<ArchiveIndex>`. They are siblings
under `src/components/variants/v2/`. Resist the temptation to extract a
shared `<TableRow>` component: the rows on each page have *different*
column splits and pulling them into one component adds a prop surface
that obscures the per-page intent.

#### State and data flow

- `ArchiveIndex` owns one piece of state: `hoveredId` (string | null).
  The floating thumbnail renders only while `hoveredId === project.id`.
- `ArchivePlate` owns one piece of state: `activePlate` (number). The
  spec frame and the thumbnail strip read from `activePlate`.
- All data flows from `src/lib/projects.ts` via the `projects` and
  `projectById` helpers. No fetch. No URL search params. No localStorage.

#### How to extend v2 without breaking the brief

1. **Adding a new column to the entries table.** Add a 1/12 (or 2/12)
   cell to *every* row. The 12-col split must sum to 12. Re-balance the
   other cells if needed; do not introduce a 13th column.
2. **Adding a new section to the plate page.** It must be a
   "3-col § label / 9-col content" row, identical in shape to the
   existing sections. The § label is `§ NN / Title` in mono micro-type.
3. **Adding hover state to a cell.** Allowed only if the state is
   *inversion* (`bg-fg` / `fg-bg`). Adding a color accent breaks v2.
4. **Adding a `transition-*` class anywhere.** Stop. Strip it out. v2
   is a static page.
5. **Adding a non-mono typeface.** Stop. Strip it out.

#### Gaps and opportunities (v2)

- v2 has no search, no filter, and no per-category grouping. The
  category column is *information*, not a control. A v2+ could add a
  `?category=kitchen` URL filter without changing the visual, since
  rows already exist in mono tables.
- The floating hover thumbnail is desktop-only (`hidden md:block`). On
  mobile, the table is read-only. A possible fix: render a small
  always-visible specimen swatch as the row's first column on mobile.
- The plate page is the longest page in the project (10 sections). On
  mobile, the `3 / 9` col split becomes a single column but the §
  labels still read as labels. No change required; flagging because
  it's the only place the mobile experience is intentionally flat.
- The "Plate index" footer grid uses a uniform `aspect-square` for
  every plate. v2 might gain character from `aspect-[4/5]` or
  `aspect-[3/2]` rotation here, mirroring v4's "remaining images" grid.

#### How to read this section in 60 seconds

- A museum specimen register. Information density over composition.
- Two colors (black + bone). One typeface system (system mono, plus
  system sans-black for display). No accent.
- The table column split (1 / 4 / 2 / 2 / 2 / 1) is the layout's
  identity; do not rebalance.
- Zero motion. Adding any transitions breaks the variant.
- Components live under `src/components/variants/v2/`. v2 has no
  shared sub-components with v1, v3, or v4.

---

## v3 — Viewing

**Codename**: Viewing
**Mood**: Private gallery / luxury exhibit. Deep navy ground, gold rule lines,
monumental serif display, italic gold accents. Reads like a private viewing of
a curated collection.
**Aesthetic reference**: Hermès exhibition catalogues, Aesop store design,
museum wall texts.

### Tokens

| Token | Value |
|-------|-------|
| Background | `#0d1b2a` (deep navy / oxblood-leaning) |
| Foreground | `#e8d9b8` (parchment / warm cream) |
| Accent | `#c8a85a` (gold rule lines, italic words, "§" markers) |
| Secondary surface | `#0a1622` (slightly deeper navy for §-sections) |
| Display font | `font-serif` (system serif — `ui-serif, Georgia`), `font-light`, italic for gold accents |
| Body / labels | `font-sans` `text-[10px]` `tracking-[0.4em]` uppercase, color `text-[#e8d9b8]/50` |
| Borders | Hairline gold `border-[#c8a85a]/30` (header strip) and `/20` (row separators) |
| Grid | 12-col, generous gutters; sections separated by full-width gold rules |
| Spacing | Generous — `pt-12 md:pt-20` for hero cells, `py-16 md:py-24` between sections |
| Motion | Subtle. Title color shifts to gold on row hover (500ms). Active plate thumbnail gets `border-[#c8a85a]`. No animation libs. |
| Imagery rule | Plate overlays with corner stamps on translucent navy `bg-[#0d1b2a]/70 backdrop-blur-sm`. Active plate shows a gold `2px` border. |

### Components (scope of v3)

- `src/app/v3/work/page.tsx` — `V3WorkPage`
- `src/app/v3/work/[slug]/page.tsx` — `V3ProjectPage`
- `src/components/variants/v3/GalleryIndex.tsx` — "A private viewing" header, collection list, provenance, footer
- `src/components/variants/v3/GalleryPlate.tsx` — sticky Collection link, work header, 21:9 hero plate, plate grid, catalogue notes, materials pills, prev/next

### Signature

- "Exhibit № III", "§ The Collection", "§ Catalogue Notes", "§ Provenance", "§ Materials" — exhibit-style section markers.
- Italic gold accent words inside roman display ("*A private* *viewing.*", "*Bespoke Storage.*").
- Materials rendered as bordered pills with serif italic.
- Sticky header on plate page mirrors a museum wall text.

### v3 — Viewing: Architecture & UI/UX Deep-Dive

v3 is the **moody-luxury** variant. It exists to answer "what if the
portfolio read like a private museum viewing, late at night, with
spotlights on each work?" Where v1 is a daytime magazine and v2 is a
daylight catalogue, v3 is a controlled-light gallery.

#### Design intent, in one sentence

An after-hours private viewing. The reader is an invited guest; the
parchment type and gold rules are the wall text.

#### Library inventory and role

| Library | Role in v3 | Why this library |
|---|---|---|
| `next` (App Router) | Routing for `/v3/work` and `/v3/work/[slug]`, server components for the route files | Same as v2 / v4. |
| `react` | `useState` for the active plate and the active hover row | Minimal state. v3 also intentionally does not animate state changes. |
| `next/image` | All photography, the hover preview image, the plate thumbnails | `next/image` handles the soft `bg-[#0d1b2a]/70 backdrop-blur-sm` plate overlays without showing layout shift when the image loads. |
| `gsap` | **Not used.** | v3 is animation-free. The "physicality" comes from layout, not motion. |
| `lenis` (via shared chrome) | Inertial scroll | Global. The smoothness reads well against the dark ground. |
| `tailwindcss` | All styling, including the navy / parchment / gold tokens | The navy + parchment + gold palette is *not* in `tailwind.config.*`; v3 uses arbitrary values (`bg-[#0d1b2a]`, `text-[#e8d9b8]`, `border-[#c8a85a]/30`). If a future change promotes v3 to the default, these should be promoted to theme tokens. |
| **No** new fonts | — | v3 uses `font-serif` (system serif stack) and `font-sans` (system sans). The "italic + light + serif" combination is achieved by stacking utilities, not by loading a face. |

#### Color system

v3 uses three values plus one secondary surface:

- **Deep navy `#0d1b2a`** (`bg-[#0d1b2a]`) — the page.
- **Parchment `#e8d9b8`** — the type on the navy. The name matters: it
  is *not* `cream` and *not* `text-cream` (which is `#f4f1ea`). The
  parchment is warmer and more amber, and the warmth is what makes v3
  feel like a wall text instead of a normal dark theme.
- **Gold `#c8a85a`** — the accent. Used for: italic accent words, the
  `§` section markers, the active-plate border, the prev/next link
  color on hover, the small `ISSUE` and "Work №" labels. The gold
  appears at full opacity for accent text and at 30% opacity
  (`/30`) for hairline rules and divider borders.
- **Secondary navy `#0a1622`** (`bg-[#0a1622]`) — the slightly deeper
  surface for the "§ Provenance" / "§ Catalogue Notes" sections. The
  6-luminance-step drop is *just* enough to read as a different
  surface without becoming a different theme.

If you flip the navy ground to bone (do this carefully):

- All `text-[#e8d9b8]` (parchment) becomes `text-[#0d1b2a]` (navy).
- The secondary surface `bg-[#0a1622]` becomes a warmer cream
  (`bg-[#ece6d6]`, same as v4's meta panel).
- The gold `#c8a85a` is *still* the accent, but on cream it reads as
  a deeper ochre. Test contrast on body text — gold on cream is
  lower contrast than parchment on navy. If body legibility fails,
  darken the gold to `#a78641` or shift it to a deeper umber.
- The plate-page "translucent navy" labels (`bg-[#0d1b2a]/70`) become
  "translucent cream" (`bg-[#e8d9b8]/70`). The corner stamps keep
  their inverted logic.

#### Type system

| Register | Font | Style | Where |
|---|---|---|---|
| Display | System serif (`font-serif`), `font-light`, `leading-[0.9]`, very large (`text-6xl`–`text-9xl`) | "A *private* *viewing.*", project titles, "Wardropes" | Hero, plate-detail header. |
| Display / italic accent | System serif, *italic*, color `#c8a85a` (gold) | "viewing.", "Bespoke Storage.", section headings' first word | Always paired with a roman partner. The italic gold word is the v3 signature. |
| Body | System sans (`font-sans`), `text-[10px]`, `tracking-[0.4em]`, uppercase | "§ The Collection", "§ Catalogue Notes", "ISSUE № III", "WORK № 01 OF 06" | Marginalia, section markers. |
| Body / running copy | System serif, `italic`, `text-lg`–`text-2xl` | The description paragraph in the plate header | Reads as wall text, not body copy. |
| Numerals | System serif, `font-light`, `tabular-nums` for year | Year in the dossier, plate counter | Catalogue numbers. |

The italic-gold-accent-on-roman-serif rule is the v3 signature
typographic gesture. Drop it and v3 collapses into "v1 with a dark
background". The gold italic word is what makes v3 a gallery.

#### Layout system

v3 is **12-col generous sections**. Every section is either:

- A 12-col strip with a §-marker in col 1 and content in cols 4–12 (or
  9–12 for narrower content), or
- A 12-col strip with a 8/4 or 4/8 split for image+text pairings.

The index page composes:

- Header strip (12-col intro: 7/12 title + 5/12 description).
- Collection list (full-width 12-col, each item a 2/12 number + 7/12
  title block + 2/12 category + 2/12 year, with the hover-reveal
  preview image below the row).
- Provenance (3/12 § label + 9/12 4-col material grid).
- Footer (6/6 with cross-links to v2 and v1).

The plate-detail page composes:

- Sticky header (6/6 with Collection link + work counter).
- Title block (8/4 with title on the left, description on the right).
- Hero plate (full-bleed 16:9 → 21:9 at md+).
- All-plates grid (3-col mobile, 5–7-col desktop, 1:1 thumbnails).
- Catalogue notes (3/12 § label + 9/12 4-col dossier).
- Materials (3/12 § label + 9/12 flex-wrap pills).
- Prev / Index / Next footer (5/2/5).

If you collapse the 12-col into a 2-col (resist): v3 starts to look
like a magazine spread (v1 territory) and loses the "wall text"
feeling. The generous gutters and 12-col discipline are what make v3
feel like a museum.

#### Spacing and rhythm

Generous, *almost uncrowded*:

- Section padding: `py-16 md:py-24`.
- Hero padding: `pt-12 md:pt-20` and `pb-12`.
- Hero plate height: `aspect-[16/9] md:aspect-[21/9]`.
- Between sections: a single `border-t border-[#c8a85a]/30` hairline.
  This is the only visible divider. Adding a second divider (a shadow,
  a double rule, a colored band) breaks the variant.
- Within sections: no internal dividers, just generous `gap-12 md:gap-16`.

If you tighten section padding below `py-12`, v3 immediately becomes
"a normal dark-themed portfolio site". Do not.

#### Imagery rules

- Same `next/image` discipline.
- `priority` is set on the plate-detail hero image and on the first
  cover image of the index.
- Plate-page hero carries translucent navy corner stamps:
  - Top-left: `PLATE NN / MM` on `bg-[#0d1b2a]/70 backdrop-blur-sm`.
  - Top-right: location on the same surface.
  The stamps are the v3 equivalent of v2's corner stamps: they tell
  you *what you are looking at* in the language of a museum label.
- The hover-reveal preview image on the index is a 40vh slot that
  appears *below* the hovered row, with its own bottom gradient and
  a "PLATE I / MM" stamp and location. The transition is an instant
  swap (no fade) so the user perceives it as a "this row is selected"
  signal, not a "a panel just opened" signal.
- No gradients on UI surfaces. The only gradient is `from-[#0d1b2a]
  via-transparent to-transparent` at the bottom of the hover preview,
  and it is for legibility (the row text below the image) only.

#### Motion budget (zero)

There is no motion in v3 aside from:

- The hover-reveal preview's instant `opacity` swap.
- The title color shift on row hover (`group-hover:text-[#c8a85a]`,
  `transition-colors duration-500`).
- The active plate thumbnail's `border-[#c8a85a]` swap (instant).

The one piece of *timed* motion is the title color transition
(`duration-500`). That is the entire budget. Do not add GSAP. Do not
add CSS keyframes. The slow color shift is the only "physicality" the
variant allows itself.

If you want a fade-in on the hover preview: stop. The instant swap is
*v3's* signature; a fade would make it feel like a tooltip.

#### Component composition map

```
src/app/v3/work/page.tsx                      (server component)
  └─ <GalleryIndex />                         (client — useState for hoveredId)

src/app/v3/work/[slug]/page.tsx               (server component)
  └─ <GalleryPlate slug={slug} />             (client — useState for active)
```

`<GalleryIndex>` and `<GalleryPlate>` are siblings. They share a
`label` constant (`"font-sans text-[10px] tracking-[0.4em] uppercase"`)
but nothing else. Resist extracting a shared `<Section>` component
just because both have a 3/12 + 9/12 split — the content of those
columns differs enough that the abstraction would leak.

#### State and data flow

- `GalleryIndex` owns one piece of state: `activeId` (string | null).
- `GalleryPlate` owns one piece of state: `active` (number = active
  plate index).
- All data flows from `src/lib/projects.ts` via the same helpers
  used by every variant.

#### How to extend v3 without breaking the brief

1. **Adding a new section.** Must be a 3/12 + 9/12 row with a `§ …`
   marker in the left col. The marker is mono, gold, all-caps.
2. **Adding a hover state.** The only allowed transition is a color
   change with `duration-500`. Adding a transform, scale, or translate
   breaks v3.
3. **Promoting a value to a theme token.** If you intend v3 to be the
   *default* variant (it is currently a parallel route), promote
   `bg-[#0d1b2a]`, `text-[#e8d9b8]`, `border-[#c8a85a]/30`, and
   `bg-[#0a1622]` to `tailwind.config.ts` under names like
   `gallery-navy`, `gallery-parchment`, `gallery-gold`, and
   `gallery-navy-deep`. Keep the v3 component using the same utility
   names; only the source-of-truth changes.
4. **Replacing the gold with another accent.** Test contrast on the
   parchment first. Gold is the only accent that holds its hue at
   30% opacity on the navy. Saturated colors (red, blue) will vibrate
   and need additional opacity tuning.

#### Gaps and opportunities (v3)

- v3 is the only variant whose type system relies on the system serif
  stack. On Linux / older Windows, the rendered face will be
  `Liberation Serif` or `DejaVu Serif`, which are heavier than
  `ui-serif` on macOS / modern Windows. The result: the "light"
  display is no longer "light". A v3+ could load a hosted serif
  (Cormorant Garamond is already available) — but doing so would
  push v3 closer to v1's typographic identity. The trade-off is real.
- The hover-reveal preview is desktop-only (`hidden md:block`). On
  mobile, the user gets the list and a tap-to-open. A possible fix:
  add a small always-visible thumbnail as the first column of each
  row on mobile.
- The plate page's "all-plates" grid is uniform 1:1 thumbnails. v3
  could rotate aspect ratios here, matching v4's "remaining images"
  grid. The current uniform grid is part of the *clean* gallery
  feel, so this is a judgment call.
- The gold `#c8a85a` is a single hue. There is no "shade" or "tint"
  hierarchy. A v3+ could introduce a darker gold for hover and a
  lighter gold for accent text to create a small hierarchy.
- The category row in the index has no visual weight separation
  between the label and the count. A possible fix: dim the count
  further (`text-foreground/20`).

#### How to read this section in 60 seconds

- A private museum viewing, late at night, with spotlights.
- Three colors (deep navy, parchment, gold) + one secondary surface
  (deeper navy).
- The italic gold accent word inside the roman serif headline is
  v3's signature. Drop it and the variant dies.
- No motion. The only "physical" moment is a 500ms color transition
  on hover.
- Components live under `src/components/variants/v3/`. The navy /
  parchment / gold tokens are inline (arbitrary values), not in
  `tailwind.config.ts` — promote them if v3 becomes the default.

---

## v4 — Collision

**Codename**: Collision
**Mood**: Architecture/furniture editorial publication. Massive overlap
serif becomes a compositional object; the page reads as a printed issue
rather than a business site. Warm cream background, charcoal type, near-zero
decoration beyond a hairline rule here and there.
**Aesthetic reference**: Apartamento, A+U, Cabinet magazine, COLLISION
reference spread, Aesop catalogues, contemporary independent design studios.

### Tokens

| Token | Value |
|-------|-------|
| Background | `bg-background` (cream `#f4f1ea`) |
| Secondary surface | `bg-[#ece6d6]` (half-step warmer for the project meta block and other breathing-room panels) |
| Foreground | `text-foreground` (charcoal) |
| Accent | Aged brass `#a37e2c`-ish (used sparingly: link hover, plate link underline) — *no* gold, no purple, no blue |
| Display font | `Cormorant Garamond` (already loaded — `font-display`), light + italic, `tracking-[-0.04em]` for the overlap word |
| Body font | `DM Sans` (`font-body`) |
| Display sizes | Overlap word: `clamp(34vw, 28vw, …)` on the index cover, `clamp(24vw, 18vw, …)` on plate covers. Section titles: `clamp(2.5rem, 5vw, 5rem)`. |
| Body type | Metadata labels: `text-[10px] tracking-[0.3em] uppercase` (`label`). Body copy: 14–16px regular. |
| Grid | 12-col, but **broken** per section. Three rotated composition templates on the index: full-bleed + side caption, two-up with vertical offset, narrow image + text. |
| Spacing | `pt-[18vw] md:pt-[12vw]` after the hero overlap; section `py-16 md:py-24` to `py-24 md:py-40` between plates. |
| Motion | GSAP `ScrollTrigger` only. One-time overlap fade-up on the index hero (~1.6s, `power4.out`). `clipPath` reveal on every image block (`inset(100% 0 0 0)` → `inset(0)`). Subtle fade-up on metadata. No parallax. No infinite loops. |
| Imagery rule | Same source photos as v1/v2/v3. Decorative SVG sketches (line + dimension labels + section marker) at 1px `text-foreground/25` between sections. No image gradients except a discreet `from-charcoal/40` on hero for type legibility. |

### Components (scope of v4)

- `src/app/v4/work/page.tsx` — `V4WorkPage`
- `src/app/v4/work/[slug]/page.tsx` — `V4ProjectPage`
- `src/components/variants/v4/CollisionIndex.tsx` — index composition (hero overlap, category strip, editor's note, three-template plate rotation, end-of-issue strip)
- `src/components/variants/v4/CollisionPlate.tsx` — project composition (cover with overlap, meta panel, editor's note, plate index, full-bleed, image + caption, inline SVG `ArchitecturalSketch`, rest-of-images grid, prev/next)
- `src/components/Navigation.tsx:85-93` — new "Collision" nav link

### Signature

- A single huge italic serif word ("*collision*", or the project title on
  detail pages) bleeds from inside the hero photograph downward past the
  image's lower edge into the next section.
- "Editor's note" italic display serif, narrow column, set in a 7/12
  offset to the right.
- Three composition templates rotated per project so no two adjacent
  plates share the same shape.
- Inline SVG section sketch (a 1px dimension drawing with `§ SECTION A — A`
  label) between sections — the *only* decoration in the page.
- A category index strip (`Kitchen`, `Cabinetry`, `Finishes`, `Material`
  + actual project categories) presented as wide-tracked typographic rows
  with small numeric counts. Each row is a clickable filter chip — the
  active chip inverts to aged-brass with a hairline underline, the
  grid below re-renders to show only matching projects, and the §
  section header updates its label to read `§ KITCHEN` (etc.). A
  leading "All" chip returns the full set. Empty categories render as
  disabled muted labels rather than disappearing.
- Above the hero overlap word, a small gold "Latest" eyebrow plus a
  one-sentence italic display subhead ("Bespoke interior design from
  Nairobi — quiet rooms, honest materials, documented as a working
  register.") anchors the page in plain language before the overlap
  word takes over.
- A "Browse the collection" scannable grid section (uniform 3-col on
  desktop) using a single `PropertyCard` component — image, name, year
  on the right, subtitle in italic, location, three material chips,
  and a "Read plate →" link. This is the *Wander-style* scannable
  index; the full-bleed composition plates remain below for the
  *editorial* read.
- A "Why Kim" 4-column value-prop strip (Bespoke, Material-honest, One
  studio, Documented) with hairline-rule borders and a numbered list
  — a single horizontal block in the spirit of Wander's "Wander
  difference" but compressed to four short principles.
- Every `PropertyCard` image carries a corner `NN / 06` plate number
  (top-left) and a category badge (top-right) in the same micro-type
  used by the rest of the variant. Hover scales the image 1.03 and
  shifts the title to aged-brass.

### Explicitly avoided (per brief)

- No rounded cards, no glassmorphism, no gradient backgrounds, no
  purple/blue accents, no SaaS hero, no "Book a consultation" CTA,
  no testimonial carousel, no shadow-heavy UI, no badge/icon grid.
- No new fonts (reuses the existing Cormorant Garamond + DM Sans).
- No new dependencies (reuses GSAP and `lenis` already in `package.json`).

---

## Cross-Variant Comparison

| Concern | v1 Editorial | v2 Archive | v3 Viewing | v4 Collision |
|---|---|---|---|---|
| Background | Cream | Bone | Deep navy | Cream |
| Foreground | Charcoal | Black | Parchment | Charcoal |
| Accent color | Aged brass | None (black only) | Gold `#c8a85a` | Aged brass (links only) |
| Display font | Cormorant Garamond | System sans black | System serif light + italic | Cormorant Garamond italic, overlap-sized |
| Body font | DM Sans | System mono | System sans | DM Sans |
| Italic usage | Subtitle accent | Never | Gold accent words | Overlap word + editor's note |
| Layout primitive | 2-col photo mosaic | 12-col table grid | 12-col generous sections | 12-col, broken; three composition templates rotated |
| Imagery framing | Soft gradient overlay | Corner stamps | Translucent navy plate + corner stamps | Full-bleed + side caption / two-up offset / narrow + text |
| Section markers | Spaced headings | "§ 01 / …" | "§ The Collection" + gold rules | "Issue 04 / Volume I" header, "Editor's note", "End of issue" |
| Motion library | GSAP + ScrollTrigger | None | None | GSAP `ScrollTrigger` (overlap fade + `clipPath` reveal) |
| Hover signature | Image scale 1.05 + "View Project" reveal | Row inverts + floating thumbnail | Title shifts to gold | Underline shifts to brass |
| Card metaphor | Magazine spread | Filing cabinet | Gallery wall | Printed editorial issue |
| Data display | Title + subtitle | Numbered table row | Numbered exhibit list | Numbered plate, materials as typographic list |
| Decoration budget | Low (gradient only) | None (rules only) | Gold rules | One inline SVG section sketch |

---

## Shared / Constant (across all variants)

- **Data source**: `src/lib/projects.ts` — 6 projects, all read-only.
- **Image base path**: `/images/<project-id>/WhatsApp-Image-…` (see `projects.ts`).
- **Layout chrome**: `Navigation`, `Footer`, `SmoothScrollProvider`,
  `PageTransition`, `CustomCursor`, `Preloader`, `AgentationToolbar` are
  shared from the root layout (`src/app/layout.tsx`). Variants only change
  the inner page body.
- **404 / not-found**: falls through to `src/app/not-found.tsx` for all
  variants.
- **Sticky/fixed nav**: the existing transparent → solid nav continues to
  float over every variant.

---

## Adding a New Variant

1. Pick a codename and write a section above following the v2/v3 structure:
   Tokens, Components (scope), Signature.
2. Add the route(s) under `src/app/vN/...` and components under
   `src/components/variants/vN/`.
3. Add an entry to the **Index** table and the **Cross-Variant Comparison**.
4. Add a small nav link in `Navigation.tsx` alongside "Archive" and "Viewing"
   (use the same bordered-button pattern).
5. Verify with the Playwright script at `scripts/verify-v2.mjs` (extend the
   `URLS` array to include the new routes).

## Verification

The Playwright script `scripts/verify-v2.mjs` (extend the `URLS` array when
adding routes) loads each variant, captures title / first heading / `<img>`
count / `<header><nav>` count / body sample, and reports any console
errors, page errors, or failed requests. Run with:

```bash
node scripts/verify-v2.mjs
```

It expects a dev server already running on `http://localhost:3000`.

## How to Query This File

- **Find every component a variant touches**:
  `grep -A 20 "^### Components" VARIANTS.md`
- **Compare a specific token (e.g. background) across variants**:
  `grep -i "background" VARIANTS.md` → see the row in each variant's table.
- **Find what makes a variant visually distinct**:
  scroll to its **Signature** section.
- **List all routes**: the **Index** table at the top.

---

## v4 — Collision: Architecture & UI/UX Deep-Dive

This section is written for an AI tool (or a new contributor) that needs
to *extend, repair, or reskin* the Collision variant without diluting the
editorial intent. It is a single source of truth on **why** each piece of
the page exists, **what each library is doing**, and **how** the libraries
are used to produce the result.

The brief is: "an internationally designed architecture/furniture
publication, not a premium SaaS site." Everything below is in service of
that. If a future change violates the brief, this section is what to check
against.

### Design intent, in one sentence

The page is a *printed issue* (a numbered volume, with editor's notes,
plates, section sketches, and end-of-issue marks) that happens to scroll
in a browser. The reader is treated as a subscriber, not a lead.

### Library inventory and role

| Library | Version (from `package.json`) | Role in v4 | Why it's here, not a heavier or lighter alternative |
|---|---|---|---|
| `next` | `16.3.3` (App Router) | File-system routing (`src/app/v4/...`), server components for the page wrappers, RSC streaming | App Router is what lets v4 sit alongside v1/v2/v3 as a *parallel* site without affecting them. Server components keep the route files trivial (`page.tsx` just renders the client component) so the variants stay isolated. |
| `react` / `react-dom` | `19.2.8` | Component model, hooks (`useEffect`, `useRef`, `useState`) | Standard. No state library — v4 state is a single ref for the GSAP context. |
| `next/image` | (bundled with `next`) | Responsive, lazy-loaded photography | Forces a single image primitive with explicit `sizes` and `priority` on the lead hero. Prevents layout shift and the "image suddenly appears" feel that would break the editorial tone. |
| `gsap` | `^3.15.0` | Animation engine for the overlap reveal and section reveals | Chosen because the *only* animations in v4 are time-based, scroll-driven, and need precise easing (`power3.out`, `power4.out`). CSS transitions can't reproduce `clipPath` interpolation across Safari/Firefox reliably. |
| `gsap/ScrollTrigger` | (bundled with `gsap`) | Scroll-bound triggers for `clipPath` and fade-up reveals | Lets the page do *physical* reveals (image wipes from bottom on scroll) without a custom IntersectionObserver setup. |
| `lenis` (via `SmoothScrollProvider`) | `^1.3.26` | Inertial smooth scrolling for the whole site | Wraps every variant. Used in v4 only as the scroll surface — the animations are still GSAP-driven, so the inertia and the reveals stay independent. |
| `@gsap/react` | `^2.1.2` | Optional — used elsewhere in the codebase, not used directly in v4 | Available if a future v4 addition needs to coordinate GSAP timelines with React state, but the current v4 components do all animation inside a `gsap.context` block. |
| `tailwindcss` | `^4` | Utility-first styling for every layout and type spec | The whole variant uses Tailwind utilities. No CSS modules, no per-variant stylesheet — keeps variants diff-friendly and means a design change is one line in JSX, not a multi-file CSS patch. |
| `lenis` + `react` integration | existing | Provides a single `useEffect`-mounted smooth scroll across the document | See `SmoothScrollProvider` in the shared chrome. |
| **No** Framer Motion, Motion One, Three.js, Lottie, Rive, or a charting library | — | — | Motion budget is deliberately tiny (see *Motion budget* below). Adding a second animation engine would also fight GSAP over the scroll position. |
| **No** new fonts | — | — | v4 reuses the Cormorant Garamond + DM Sans pair loaded once in the root layout. The overlap word *is* a sizing trick on an already-loaded face. |

### Color system

Three values do the work. Everything else is derived:

- **Cream `#f4f1ea`** — `bg-background`. The page. Never `bg-white`.
- **Charcoal `#0a0a0a`** — `text-foreground`. The type. Never `text-black` plus a softened variant — just a single near-black.
- **Aged brass** — used only for: the *hovered* state of typographic links, the "Read plate →" / "Open →" underline. Never a fill, never a background.

One secondary surface exists: **`#ece6d6`** (a half-step warmer than the
background), used as a tonal break for the project meta panel on the plate
page. The brief says "no gradients" — this panel is a *flat* warm panel, not
a gradient, and it's used once.

`from-charcoal/40 via-transparent to-transparent` appears on **hero
images only**, and only because the overlap word sits on top of the
photograph and needs legibility. It is a *legibility veil*, not a stylistic
gradient. It is not used on UI surfaces.

### Type system

Two faces, three registers. That's the whole type system.

| Register | Font | Style | Where it appears |
|---|---|---|---|
| Display / overlap | `Cormorant Garamond` (`font-display`), `font-light`, `italic`, `tracking-[-0.04em]`, `leading-[0.78]`–`leading-[0.82]` | One per page: the word *collision* on the index, the project title on the plate. Sized `clamp(24vw, 18vw)` and `clamp(34vw, 28vw)` so it bleeds off the viewport. | Hero, sitting on top of the lead photograph and extending past its lower edge. |
| Display / titles | `Cormorant Garamond`, `font-light`, roman (not italic) at `text-4xl`–`text-7xl` | Section titles inside the page, e.g. project titles in plates B and C. | Mid-page. |
| Display / editor's note | `Cormorant Garamond`, `font-light`, `italic` at `text-2xl`–`text-4xl` | Editor's-note paragraphs. | After the meta block on the plate page, in a 7/12 column. |
| Body | `DM Sans` (`font-body`), `font-light` to `font-normal`, `text-sm`–`text-base` | Project description copy. | Adjacent to images. |
| Label / metadata | `DM Sans`, `text-[10px]`, `tracking-[0.3em]`, `uppercase` | "Issue 04 / Volume I", category row counts, plate numbers, "End of issue". | Marginalia, never the focal element. |

The italic-vs-roman split is the **most important typographic decision** in
v4. The italic display is reserved for the *overlap word* and the *editor's
note*. Every other title is roman. This single rule keeps the overlap word
from competing with section titles, and keeps editor's notes from
collapsing into body copy.

### Layout system

v4 sits on a 12-column grid, but the grid is **broken per section** on
purpose. Three composition templates are rotated across the project list on
the index:

- **Template A — Full-bleed + side caption.** 100vw image; a left caption
  column (~20ch wide) with title, year, category, materials as a vertical
  list, and a "Read plate →" link. The caption is *inside* the hero
  (`absolute left-…`), not below it. The image bleeds full-width; the
  caption reads against a transparent panel, with the dark veil on the
  hero supplying contrast.
- **Template B — Two-up with vertical offset.** A 7/12 image and a 4/12
  image offset downward by ~`md:pt-32` so the second image hangs below
  the first's lower edge. Below the images: a 12-col metadata strip
  (`NN / Category / Year`, title, subtitle, "Open →").
- **Template C — Narrow image + text block.** A 4/12 portrait image with
  a `NN / 06` stamp in the corner, paired with a 7/12 text column that
  holds the project description, materials, and a "Read the plate →" link.

The rotation means **no two adjacent plates share the same shape**. This
is what gives the index the rhythm of a printed issue rather than a
Pinterest board.

Mobile recomposes rather than stacks. The full-bleed template drops its
caption into a stack below the image; the two-up template becomes a
single column with a smaller height; the narrow-image template keeps the
text-on-the-right shape but at full width. (This is the part of the brief
the v1 `HorizontalProjects` component gets wrong — v4 does not stack.)

### Spacing and rhythm

Three spacing values do most of the work:

- **`pt-[18vw] md:pt-[12vw]`** after the hero. The overlap word is sized
  to *exactly* this height, so the next section always begins where the
  overlap word ends. No magic numbers in the CSS — the spacing is a
  function of the type size.
- **`py-16 md:py-24`** between sections that contain body copy.
- **`mb-24 md:mb-40`** between plate compositions. This is a print-grade
  generous gap; the page is *uncrowded by design*.

`px-6 md:px-12` is the standard horizontal gutter, matching the rest of
the site. Where the brief is being read as "generous whitespace", the
vertical gaps are doing more than the horizontal gutters.

### Imagery rules

- **Source**: `projects[].images` from `src/lib/projects.ts`. No stock
  imagery. No `https://` URLs.
- **Loading**: the lead photograph on every page is `priority` (preload).
  Every other `<Image>` is lazy by default.
- **`sizes`**: every `<Image>` carries an explicit `sizes` attribute. The
  Next.js warning seen during verification (`missing "sizes" prop`) is
  coming from a v1 component and is *not* a v4 regression. v4 files all
  declare sizes.
- **`fill` + `object-cover`**: the universal pattern. v4 never uses
  `width`/`height` attributes on a content image because the layout is
  fluid.
- **Hero veil**: a single linear gradient from bottom (`from-charcoal/40`)
  fading to transparent. Purpose: legibility for the overlap word.
- **No corner stamps, no glass overlays, no color tints**. The
  architecture/furniture publication brief is explicit that photography
  should look like *photography*, not treated material.

### Architectural sketches (the only decoration)

The single inline `<svg>` `ArchitecturalSketch` component renders:

- A 1px horizontal line spanning the section width.
- Vertical ticks every 50px, like an elevation grid.
- Two end-cap marks with `0` and `2400` labels (mm, on a 2400mm wall —
  deliberately a real architectural dimension, not arbitrary).
- A `§ SECTION A — A` label below the line, monospaced.

It is rendered once per plate page between the image + caption block and
the rest-of-images grid. **That is the entire decoration budget for the
variant.** It is drawn at `text-foreground/25` so it reads as a printed
mark, not a UI element. The brief's "occasional diagrams / sketches"
becomes a single, repeated, very small mark — not a flourish.

### Motion budget (explicitly small)

Three GSAP animations run on the index, three on the plate. Total: six
across the page. No animation runs on the rest of the site chrome; v4
animations are *scoped* inside a `gsap.context(root, () => {...})` block
and torn down on unmount.

| Animation | Trigger | From → To | Duration | Easing | Where |
|---|---|---|---|---|---|
| Overlap fade-up | Component mount | `y: 80, opacity: 0` → `y: 0, opacity: 1` | 1.6s | `power4.out` | Index hero word |
| Overlap fade-up (plate) | Component mount | `y: 60, opacity: 0` → `y: 0, opacity: 1` | 1.6s | `power4.out` | Plate cover title |
| `clipPath` reveal | `ScrollTrigger` start `top 88%` | `inset(100% 0 0 0)` → `inset(0% 0 0 0)` | 1.1s | `power3.out` | Every image block (`.ci-reveal`, `.cp-reveal`) |
| Subtle fade-up | `ScrollTrigger` start `top 90%` | `y: 24–30, opacity: 0` → `y: 0, opacity: 1` | 0.9s | `power3.out` | Metadata blocks, editor's note, closing strip |
| Overlap reveal (no animation, but related) | — | The overlap word is positioned with `bottom-[-10vw]` so it bleeds past the image — this is a static layout decision, not motion. | — | — | — |

Rules of thumb that produced this list:

- **One entrance per element.** A scroll reveal happens once. The hero
  word is a one-time mount-time animation; the rest are scroll-driven
  reveals. Nothing re-reveals on viewport re-entry.
- **No parallax.** The brief explicitly warns against it; v4 honors that.
- **No motion on hover.** Hover state is an underline color shift, not a
  transform. This is the *one* place where the brief is read most
  strictly: "hover states that reveal project information" is achieved
  with typography (`group-hover:text-aged-brass` on the underline), not
  with motion.
- **No autoplay, no infinite loops, no marquee.** The Preloader is the
  only thing that runs once on load, and it is shared chrome, not v4.

### Component composition map

```
src/app/v4/work/page.tsx          (server component — metadata + renders <CollisionIndex />)
src/app/v4/work/[slug]/page.tsx   (server component — metadata + renders <CollisionPlate slug />)

src/components/variants/v4/CollisionIndex.tsx
  ├─ Hero: full-bleed <Image priority fill sizes="100vw" /> + overlap <h1> + Issue/Volume micro
  ├─ Contents strip (left col) + category index (right col)
  ├─ Editor's note (italic display, 7/12 offset)
  └─ Map over projects → 3 templates (A full-bleed, B two-up, C narrow)
        └─ <Link href={`/v4/work/${project.id}`}> for "Read plate" / "Open" / "Read the plate"

src/components/variants/v4/CollisionPlate.tsx
  ├─ Cover: full-bleed <Image priority /> + overlap project title
  ├─ Meta panel on bg-[#ece6d6] (Project / Location / Year / Discipline / Materials)
  ├─ Editor's note (italic display, 7/12 offset)
  ├─ Plate index (7 thumbnails + PL. NN / MM micro)
  ├─ Full-bleed plate at ~80vh
  ├─ Image + caption pairing (7/12 image, 4/12 caption)
  ├─ <ArchitecturalSketch /> (the inline SVG)
  ├─ Remaining images: 12-col grid with rotated aspect ratios
  └─ Prev / Next (typographic, hairline rule above)
```

### State and data flow

v4 is **stateless** aside from a single `useRef` for the GSAP context. No
forms, no URL filters, no localStorage, no client-side state that
persists across navigation. The "category index" on the index is a *visual
index* of categories that exist in the data, not a filter. Clicking a
category label is a future feature and is intentionally not implemented —
the brief's "category indexes rather than conventional buttons" was
understood as a *typographic* treatment, not an interactive one.

The data path is: `src/lib/projects.ts` → server component (`page.tsx`) →
client component (`CollisionIndex` / `CollisionPlate`) → DOM. No
`fetch`, no SWR, no cache invalidation logic. This is by design: the brief
explicitly says "not a SaaS site", and an editorial publication would
have build-time data, not runtime data.

### How to extend v4 without breaking the brief

1. **Adding a fourth composition template.** Add a new branch to the
   `projects.map` in `CollisionIndex.tsx`, picked by `idx % 4 === 3`. The
   template must use the same `py`/`mb` rhythm and must not introduce
   rounded corners, gradients, or new colors. Verify with the
   Playwright script.
2. **Adding a new label register.** If you need a fourth style of
   micro-type (e.g. a numbered footnote), add it as a constant next to
   the existing `label` constant in the relevant file. Do **not** define
   it inline with ad-hoc classes — keep the label vocabulary consistent.
3. **Adding a new animation.** First question: "Is this an entrance, a
   reveal, or a state change?" Entrance = `power4.out` 1.6s. Reveal =
   `power3.out` 1.1s. State change = 200ms CSS transition only, no
   GSAP. The motion budget is six — adding a seventh is allowed only if
   one of the existing six is removed in the same PR.
4. **Adding a font.** Stop. Re-read the brief's "no new fonts" rule.
   v4 reuses Cormorant Garamond. If a future need genuinely requires a
   second serif, add it to the root layout's `next/font/google` import
   so the file is shared with the other variants — do not import a font
   inside a v4 component.
5. **Adding a SaaS pattern.** Stop. Search this document for the closest
   existing pattern. If none fits, the answer is *do not add it*. The
   brief is the design system.

### How to read this section in 60 seconds

If you are an AI tool and you only have time for the highlights:

- The page is a *printed issue* in a browser. The user is a reader, not a
  lead.
- Two fonts, three colors, one SVG sketch. That's the whole design system.
- The overlap word is the single most distinctive element. If you change
  it, you have changed the variant.
- Motion is six GSAP animations. Nothing else moves. Do not add a second
  animation engine.
- Components are isolated under `src/components/variants/v4/`. Do not
  reach into `src/components/`, `src/app/layout.tsx`, or `src/lib/`
  from v4 code.
- Verify with `node scripts/verify-v2.mjs` after any change. The script
  must report `HTTP 200` for `/v4/work` and `/v4/work/<any-slug>` with
  zero page errors and zero failed requests.
- For filter UX: run `node scripts/verify-collision-filter.mjs`. The
  script must show 6 cards on "All", 2 cards on "Kitchen", 2 cards on
  "Cabinetry", and 0 page errors. The static `STATIC_CATEGORIES` list
  in `CollisionIndex.tsx` must match the actual data categories in
  `src/lib/projects.ts` — every static entry must have a non-zero
  count or it will render as a disabled muted label.

### Wander-style patterns Collision adopted (2026-09)

After comparing Collision to the Wander.com homepage, the variant gained
conventional UX patterns that improve scannability and clarity **without
diluting the editorial brief**. These are *additions* to the variant,
not replacements for the overlap word, the three composition templates,
or the inline SVG sketch.

| Pattern | What it is | Where in Collision |
|---|---|---|
| Hero eyebrow + subhead | A small gold "Latest" label and a one-sentence italic display subhead above the overlap word. | `CollisionIndex.tsx`, absolute-positioned over the hero photograph. |
| Category filter chips | The "Contents" row is now a row of clickable filter buttons: "All" + every category present in the data, each with a numeric count. Active chip inverts to aged-brass with a hairline underline; empty categories are disabled and muted. | "Contents" row, immediately after the hero overlap. |
| "Browse the collection" scannable grid | A uniform 3-col grid (desktop) / 1-col (mobile) of `PropertyCard` components with a section header that includes a §-marker and a "NN of 06 shown" counter. | New section between the editor's note and the "Why Kim" strip. |
| `PropertyCard` component | A single component rendering one project: image with corner plate-number and category badge, title (hover → brass), year on the right, italic subtitle, location label, three material chips, and a "Read plate →" link. | Defined inline in `CollisionIndex.tsx`. |
| "Why Kim" value-prop strip | A 4-column grid (Bespoke, Material-honest, One studio, Documented) with hairline-rule top borders and a numbered list prefix. | New section between the browse grid and the "Featured plates" compositions. |
| LQIP-style image placeholders | Each `PropertyCard` image sits inside a `bg-foreground/5` container that acts as a low-contrast placeholder; the image fades in as it loads. | Inline in `PropertyCard`. |
| View-all link pattern | Each major section header carries a right-aligned "Read top to bottom" / "NN of 06 shown" micro-label that signals *how to read* the section. | Inline in the section header rows. |

#### What Collision deliberately *did not* adopt from Wander

- **Background imagery of the search bar** — the in-page filter chips
  replace it. There is no Where/When/Who widget.
- **The "Luxury" / "Iconic" tier badge on every card** — the
  category badge is a *category* label, not a *tier* label. Tier
  badges would imply marketing tiers, which contradicts the
  editorial brief.
- **The wishlist / heart toggle** — the project is a portfolio
  item, not a booking. The "Read plate →" link replaces both the
  wishlist and the rating/price meta block.
- **"Less than other sites" social-proof badge** — there is no
  competitor to compare against and the editorial brief explicitly
  forbids price-driven marketing language.

#### Cascading rules introduced by the new patterns

- **Filter chips change ⇒ grid re-renders** (driven by `activeCategory`
  state in `CollisionIndex`). The § section header label updates
  synchronously. The empty state is a single italic line.
- **Card hover state change** (currently image scale 1.03 + title →
  aged-brass) is governed by the same `transition-colors` / `duration-`
  family used elsewhere. Adding a transform outside `1.0`–`1.05` would
  compete with the overlap word's identity.
- **Why Kim strip additions** must keep the four-feature ceiling.
  Adding a fifth would push the strip onto a 2-col layout on mobile,
  which is the same trap v2 falls into (see the v2 deep-dive).

---

## v5 — Gallery (Visual Selection) — DEFAULT

**Status**: **Default route**. The home `/`, `/work`, and
`/projects/[slug]` all render v5 components. `/v5/gallery` and
`/v5/gallery/[slug]` are kept as alias routes for any existing deep
links. The v5 `SelectionProvider` and `SelectionBar` are mounted in
the root layout (`src/app/layout.tsx`) so the user's selection persists
across every page in the site, not just inside `/v5/gallery`.

**Promoted**: 2026-09-01. Before this date, v1 was the default and v5
was a parallel variant. See `DEPLOY.md` for the Vercel + env-var setup
that coincided with this promotion.

**Codename**: Gallery
**Mood**: A visual product gallery. The page reads as a *catalog the
user can shop* — every project has a + button, selections accumulate
in a floating bar, and the user can dump their selection into a
WhatsApp inquiry. Tap any project for a full-screen single-item view
with breadcrumb, swipe navigation, and a tap-to-toggle description
panel. This is the *only* variant that is not editorial-first; it is
a functional gallery, on purpose.
**Aesthetic reference**: Shopify product gallery, Pinterest, Behance
project view. Built to satisfy the brief from
"`/v5/gallery` requirements" (multi-select, WhatsApp share, full-screen
single-item view, scroll-snap, breadcrumb).

### Tokens

| Token | Value |
|-------|-------|
| Background (grid) | `bg-background` (cream `#f4f1ea`) |
| Background (single-item view) | `bg-charcoal` |
| Foreground (grid) | `text-foreground` (charcoal) |
| Foreground (single-item view) | `text-cream` (`#f4f1ea`) |
| Accent | Aged brass (selection toggle, WhatsApp button) — `bg-aged-brass text-charcoal` |
| Display font | Cormorant Garamond (`font-display`, light) — gallery hero only |
| Body font | DM Sans (`font-body`) — all controls, labels, description |
| Card aspect | `aspect-[4/5]` uniform (no cropping) |
| Single-item view | `position: fixed; inset: 0; z-50` — overlays the global chrome |
| Description panel | `max-h-[60vh] overflow-y-auto` so long copy never pushes the image off-screen |
| Motion | CSS transitions only. `transition-all duration-500 ease-out` on description panel translate. `transform: scale(1.03)` on hover. No GSAP, no scroll-driven reveals. |
| Imagery rule | `object-cover` on a uniform `aspect-[4/5]` cell. Single-item view uses `object-cover` on a `position: absolute; inset: 0` image. No gradient overlays — text legibility is solved by overlay panels with `bg-charcoal/95 backdrop-blur-sm`. |

### Components (scope of v5)

- `src/app/v5/gallery/layout.tsx` — `SelectionProvider` + `<SelectionBar/>` wrapper (shared by grid and single-item routes).
- `src/app/v5/gallery/page.tsx` — `V5GalleryIndex` (server-rendered shell with client grid).
- `src/app/v5/gallery/[slug]/page.tsx` — `V5SingleItemPage` (server-rendered with `generateMetadata`).
- `src/components/variants/v5/SelectionContext.tsx` — `SelectionProvider` + `useSelection` hook. Persists to `localStorage` under `kim.v5.selection.v1`.
- `src/components/variants/v5/SelectionBar.tsx` — floating bottom bar (only renders when `selected.length > 0`).
- `src/components/variants/v5/GalleryGrid.tsx` — uniform 3-col grid with per-card `+` button.
- `src/components/variants/v5/SingleItemView.tsx` — full-screen single-item view with breadcrumb, swipe, prev/next, keyboard, tap-to-toggle.
- `src/app/globals.css` — added `.scrollbar-hide` utility for the horizontal snap track.
- `src/components/Navigation.tsx:94-103` — new "Gallery" nav link.

### Signature

- **Multi-select is always visible.** The `+` button on every grid card
  becomes a brass-filled check when selected. The floating bar at the
  bottom of the viewport shows the count and a primary "WhatsApp →"
  action.
- **Single-item view overlays everything.** The global nav, footer,
  preloader, smooth-scroll wrapper, and cursor are all *behind* the
  full-screen view (it has `z-50` and the nav is `z-50` but appears
  after because of mount order — verified visually that the gallery
  covers them).
- **Tap toggles text, not the image.** First tap on the image shows a
  scrollable description panel from the bottom (60vh max). Second tap
  hides it. The image itself is always present and full-bleed.
- **Horizontal navigation is the spine.** `snap-x snap-mandatory` on
  the track. Swipe, prev/next buttons, and `←`/`→` keys all navigate
  by changing the URL (so deep-linking works).
- **Breadcrumb on the single-item view.** `← Gallery / Project Title`
  with the back arrow as the only escape hatch (plus `Esc`).

### Explicitly avoided

- No new fonts. v5 reuses Cormorant Garamond + DM Sans.
- No new dependencies. `localStorage` is browser-native; no third-party
  state library.
- No GSAP, no Lenis, no `gsap.context` — the variant is intentionally
  light on motion. The global `PageTransition` still runs on
  route change.
- No infinite loop, no auto-play carousel, no "infinite scroll" — the
  gallery wraps (last → first) so the user never gets stuck.

### How to extend v5

1. **Adding a new gallery action (e.g. "Email inquiry").** Add a
   builder next to `whatsappLink` in `SelectionContext.tsx` (e.g.
   `emailLink()` returning a `mailto:` URI), then add a button next to
   the WhatsApp button in `SelectionBar.tsx`. Keep the styling
   pattern: same `font-body text-[10px] tracking-[0.25em] uppercase`
   labels, brass-filled primary, bordered secondary.
2. **Adding a new field to the WhatsApp message.** Edit the
   `whatsappLink` callback only. The selected project list is
   re-evaluated via `selectedProjects` memo, so the message updates
   automatically.
3. **Adding a 3rd zoom level to the single-item view.** The image
   toggle is a single boolean. To add a "second tap" zoom-in, change
   the `onClick` handler to cycle `null → details → zoomed → null` and
   add a `transform: scale(2)` state with `transform-origin` set to
   the click coordinates.
4. **Persisting the scroll position on back-navigation.** Today the
   grid scrolls to the top on every visit. To preserve position, use
   `history.scrollRestoration = 'manual'` in a top-level effect and
   store/restore the scroll Y in a ref on route change.

### Verify

```bash
node scripts/verify-v5-gallery.mjs
```

The script asserts:
- 6 grid items on `/v5/gallery`
- 6 select buttons; selecting 3 shows the floating bar with the
  correct count and a `https://wa.me/?text=…` deep-link
- "Clear" button hides the bar
- Clicking a card navigates to `/v5/gallery/<slug>` and the
  `single-item-view` is present with a visible breadcrumb
- Tapping the image toggles `aria-expanded` from `false` to `true` to
  `false` (1st tap reveals, 2nd tap hides)
- "Next project" button, `ArrowRight` key, and breadcrumb back all
  change the URL correctly
- Back to the grid restores the 6-item layout

---

## Cross-Variant System, Dials & Cascading Changes

This section is the **system map**. It treats the four variants not as
four designs but as four *settings* of a small number of dials. An AI
tool that understands the dials can move between variants, identify
gaps, and reason about cascading changes.

### The mental model

There are **twelve dials** that distinguish the four variants. Every
component, every class, every layout decision can be traced back to a
position on one of these dials.

The dials are independent: a single variant is a tuple of twelve
values. The dials are not arbitrary: a small number of *combinations*
are coherent. The four existing variants are four coherent
combinations. A v5 should *either* take one of the four combinations
or define a *new* coherent combination — not pick a value off each
dial independently.

### The twelve dials

For each dial: the question, the positions the four variants take, the
*edges* of the dial (what each position looks like in isolation), and
the **cascading change rules** — what *must* change in the component
when this dial is flipped.

#### 1. Background

| Variant | Position |
|---|---|
| v1 | Light cream (`#f4f1ea`) |
| v2 | Light bone (same cream, used differently) |
| v3 | Dark navy (`#0d1b2a`) |
| v4 | Light cream (`#f4f1ea`) |

**Edges of the dial**: `#ffffff` (pure white) ↔ `#f4f1ea` (cream) ↔
`#0a1622` (deep navy) ↔ `#000000` (pure black). Each position has a
*temperature*: warm cream vs cool navy vs neutral black.

**Cascading change rules when flipping**:

- Background changes ⇒ **type color flips** (Dial 2).
- Background changes ⇒ **metadata/muted color must be re-tuned** (the
  `text-warm-gray`, `text-stone`, `text-foreground/60` style values
  were chosen to read on cream; they need new luminance stops on
  navy or black).
- Background changes ⇒ **hero image legibility veil inverts** (v1's
  `from-charcoal/…` becomes `from-cream/…`; v3's `bg-[#0d1b2a]/70`
  becomes `bg-[#e8d9b8]/70`).
- Background changes ⇒ **section-divider hairline color inverts**
  (v2's `border-[#0a0a0a]` becomes `border-[#f4f1ea]`; v3's
  `border-[#c8a85a]/30` stays gold but increases to `/50` for
  contrast).
- Background changes ⇒ **plate-page corner stamps invert** (v2 and
  v3 both use *inverted* corner stamps: dark label on light chip
  and light label on dark chip. Both chips must flip with the
  background).

#### 2. Foreground (type color)

| Variant | Position |
|---|---|
| v1 | Charcoal (`#0a0a0a` / `text-foreground`) |
| v2 | Black (`#0a0a0a` / explicit) |
| v3 | Parchment (`#e8d9b8`) |
| v4 | Charcoal (`#0a0a0a` / `text-foreground`) |

**Edges**: black ↔ charcoal ↔ neutral gray ↔ parchment ↔ cream ↔ white.
The position is *not* a function of the background — v3's parchment
on navy is a *warmer* choice than v1's charcoal on cream, even
though the contrast ratios are similar.

**Cascading change rules when flipping**:

- Foreground changes ⇒ **hover/active states must re-pass
  contrast** (the `hover:text-aged-brass` and
  `hover:border-aged-brass` choices were tuned for charcoal-on-cream;
  on navy, gold works; on black, gold still works; on white, gold
  fails).
- Foreground changes ⇒ **the overlap word's color must be checked**
  (v1's overlap word is `text-cream` over a charcoal photograph —
  fine. v3's overlap word is `text-cream` over a *navy* ground — also
  fine. v4's overlap word is `text-cream` over a charcoal photograph
  — fine. If a variant on a *light* ground used a light overlap word,
  it would disappear).

#### 3. Accent color

| Variant | Position |
|---|---|
| v1 | Aged brass (`text-aged-brass`) |
| v2 | **None** (monochrome) |
| v3 | Gold (`#c8a85a`) |
| v4 | Aged brass (links only) |

**Edges**: none ↔ warm brass ↔ saturated gold ↔ deep umber ↔ oxblood.
The accent's job is to be the *single hue that says "this is the
active or hovered thing"*. Adding a second accent breaks the role.

**Cascading change rules when flipping**:

- Accent added (v2 → v1/v3/v4) ⇒ **active link style gains
  `text-accent` and an underline**; previously it was `font-medium`
  or a hairline rule.
- Accent removed (v1/v3/v4 → v2) ⇒ **active state reverts to a
  weight or rule change**. Do not leave a `text-accent` style that
  no longer has a backing color.
- Accent saturation up (brass → saturated gold) ⇒ **the 30% opacity
  hairline (`accent/30`) becomes too loud; use `/40` or `/50`**.
- Accent saturation down (gold → umber) ⇒ **the 30% opacity hairline
  is too quiet; use `/20`**.

#### 4. Display font

| Variant | Position |
|---|---|
| v1 | Cormorant Garamond (loaded via `next/font`) |
| v2 | System sans-black |
| v3 | System serif light + italic |
| v4 | Cormorant Garamond (loaded via `next/font`, reused) |

**Edges**: serif ↔ sans-serif ↔ monospace ↔ slab. The display face
sets the *historical register* of the variant: a serif reads
classical; a sans reads modern; a mono reads technical; a slab reads
brutalist.

**Cascading change rules when flipping**:

- Display face changes ⇒ **the italic-accent-word rule is
  re-evaluated** (a serif with italic *accents inside roman headlines*
  is the v1 / v3 / v4 pattern; a sans with italic *accents* would
  read like a default Next.js template).
- Display face changes ⇒ **`leading` and `tracking` need re-tuning**
  (serifs need `leading-[0.85]`–`leading-[1.05]` and
  `tracking-[-0.04em]` to read as one object; sans-black needs
  `leading-[1]` and `tracking-tighter`; mono needs `leading-[1.1]`
  to avoid vertical collisions).
- Display face changes ⇒ **`font-light` may need to become
  `font-normal` or `font-bold`** (system serif is usually lighter
  than Cormorant; system sans-black is heavier; the
  weight-relationship to body must be preserved).

#### 5. Body / label font

| Variant | Position |
|---|---|
| v1 | DM Sans (loaded) |
| v2 | System mono |
| v3 | System sans |
| v4 | DM Sans (loaded) |

**Edges**: same as Dial 4, but at a different register.

**Cascading change rules when flipping**:

- Body face changes ⇒ **letter-spacing on labels re-tunes**
  (`tracking-[0.2em]` for mono; `tracking-[0.3em]`–`[0.4em]` for
  sans; never for serif at the same size — serif labels need *less*
  tracking or they look like a default Tailwind project).
- Body face changes ⇒ **`text-[10px]` may need to become
  `text-[11px]` or `text-xs`** (mono at 10px is illegible on
  Windows; sans at 10px is fine; serif at 10px is illegible
  anywhere).

#### 6. Italic usage

| Variant | Position |
|---|---|
| v1 | Subtitle accent (one italic word per headline) |
| v2 | **Never** |
| v3 | Gold accent words inside roman display |
| v4 | Overlap word + editor's note |

**Edges**: never ↔ subtitle ↔ accent ↔ primary-display. Each
position gives italic a different *role*.

**Cascading change rules when flipping**:

- Italic added (v2 → v1) ⇒ **every headline needs a place to put
  the italic word**; if the data doesn't support it (e.g. project
  titles without subtitles), italic becomes a *typography* feature
  without a *data* feature. Either add `subtitle` to every project
  (already done) or restrict italic to sections where a subtitle
  exists.
- Italic promoted to primary display (v1/v3 → v4) ⇒ **the overlap
  word must be the italic word**, and the section titles become
  roman. Reversing this (italic in section titles, roman overlap)
  reads as a typography mistake.
- Italic removed (any → v2) ⇒ **every italic class is stripped**
  from the variant's component. The grep test:
  `grep -i 'italic' src/components/variants/v2/*.tsx` should return
  zero matches.

#### 7. Layout primitive

| Variant | Position |
|---|---|
| v1 | 2-col photo mosaic (varied aspect) |
| v2 | 12-col table grid |
| v3 | 12-col generous sections (3/12 + 9/12) |
| v4 | 12-col, broken; three composition templates rotated |

**Edges**: table ↔ grid-of-cards ↔ full-bleed sections ↔ single
overlap-bleed hero. The primitive sets the *page metaphor*:
catalogue, magazine, gallery, or printed issue.

**Cascading change rules when flipping**:

- Layout primitive changes ⇒ **the metadata display changes
  shape** (a table column for category becomes a metadata strip in
  a full-bleed layout; a side caption in a magazine becomes a
  marginalia column in a table).
- Layout primitive changes ⇒ **the prev/next footer changes**
  shape (full-width typographic line vs 3-col prev/index/next vs
  5/2/5).
- Layout primitive changes ⇒ **the section padding rhythm
  changes** (tables want tight `p-4`; full-bleed sections want
  generous `py-24`; the overlap-bleed hero wants `pt-[18vw]` to
  follow the overlap word).

#### 8. Imagery framing

| Variant | Position |
|---|---|
| v1 | Soft gradient overlay (legibility veil) |
| v2 | Corner stamps |
| v3 | Translucent navy plate + corner stamps |
| v4 | Full-bleed / two-up offset / narrow + text |

**Edges**: raw ↔ overlay ↔ stamped ↔ paired-with-text. The framing
sets how the photograph is *presented to the reader*.

**Cascading change rules when flipping**:

- Imagery framing changes ⇒ **the corner-stamp content is
  re-evaluated**. v2 and v3 both use stamps; their stamps say
  different things (v2: `KIM-INT / SLUG`; v3: location + plate).
  Do not reuse the same stamps across variants.
- Imagery framing changes ⇒ **the SVG decoration budget is
  re-evaluated**. v4 has one inline `ArchitecturalSketch`; the
  other variants have zero inline SVG. If a new variant uses SVG
  decoration, the budget must be stated explicitly (see Dial 12).
- Imagery framing changes ⇒ **the aspect-ratio variety of the
  images is re-evaluated**. v1's varied aspects are part of the
  framing. v2 and v3 use uniform aspects. v4 rotates aspects
  per plate. The variation pattern belongs to the variant.

#### 9. Section markers

| Variant | Position |
|---|---|
| v1 | Spaced headings |
| v2 | "§ 01 / …" |
| v3 | "§ The Collection" + gold rules |
| v4 | "Issue 04 / Volume I", "Editor's note", "End of issue" |

**Edges**: headings ↔ numbered §§ ↔ named §§ ↔ editorial
issue markers. The markers set the *voice* of the page: instruction
manual (v2), gallery wall (v3), printed issue (v4), or magazine
feature (v1).

**Cascading change rules when flipping**:

- Section markers change ⇒ **the header strip is re-evaluated**
  (v2's "Doc / 2024 — 2026" header; v3's "Exhibit № III"; v4's
  "Issue 04 / Volume I"). The header copy is the same *register*
  as the section markers.
- Section markers change ⇒ **the prev/next footer is re-evaluated**
  (v2 uses "Prev / Index / Next"; v3 uses "← Previous / Next →";
  v4 uses "← Previous / Index / Next →"). The footer's voice must
  match the markers.
- Section markers change ⇒ **the metadata labels' tone is
  re-evaluated** (v2 uses "YEAR", "LOCATION"; v3 uses "Year",
  "Location" with italic display numerals; v4 uses
  `01 / 06 / Category / 2024`). The tone match matters.

#### 10. Motion budget

| Variant | Position |
|---|---|
| v1 | Heavy: ~8 GSAP animations, scroll-driven parallax |
| v2 | Zero |
| v3 | Zero (one CSS `transition-colors duration-500`) |
| v4 | Light: 6 GSAP animations, no parallax |

**Edges**: heavy ↔ medium ↔ light ↔ zero. Each level has a
*ceiling*; do not exceed it without a written reason.

**Cascading change rules when flipping**:

- Motion budget up (zero → light) ⇒ **the mount-time entrance for
  the hero/overlap word is added first**. A mount-time entrance is
  the cheapest "physical" moment and reads on any device.
- Motion budget up (light → heavy) ⇒ **scroll-driven reveals are
  added next**, with `ScrollTrigger.start: "top 85%"` or later
  (i.e. the reveal happens *as the section enters*, not before).
  Earlier triggers feel jumpy.
- Motion budget up (heavy → v1-parallax) ⇒ **only if the variant
  is the home page**. Parallax on a portfolio detail page reads as
  a SaaS template.
- Motion budget down (heavy → zero) ⇒ **the Preloader still works**
  (it's shared chrome), but the variant itself should not animate.
  This is the v2 / v3 path.
- Motion budget changes ⇒ **`prefers-reduced-motion` must be
  honored** at the *gate*, not after GSAP has registered. See v1's
  Gaps & Opportunities for the existing gap.

#### 11. Hover signature

| Variant | Position |
|---|---|
| v1 | Image scale 1.05 + "View Project" reveal |
| v2 | Row inverts + floating thumbnail |
| v3 | Title shifts to gold |
| v4 | Underline shifts to brass |

**Edges**: transform ↔ color-shift ↔ inversion ↔ reveal-thumbnail.
The hover signature is the *one* interaction a reader will
unconsciously remember.

**Cascading change rules when flipping**:

- Hover signature changes ⇒ **the underlying markup may need to
  change** (v2's floating thumbnail requires `absolute positioning
  inside a `relative` row; v3's color shift is a single class on
  the title; v4's underline shift is a `border-b` color
  transition).
- Hover signature changes ⇒ **the mobile path is re-evaluated**.
  v2's hover thumbnail is desktop-only; v3's color shift works
  on tap (mobile browsers honor `:hover` on first tap and then
  treat the second tap as a navigation). The mobile story
  matches the desktop story only if you *want* it to.

#### 12. Decoration budget

| Variant | Position |
|---|---|
| v1 | Low (gradient only) |
| v2 | None (rules only) |
| v3 | Gold rules |
| v4 | One inline SVG section sketch |

**Edges**: zero ↔ rules-only ↔ one SVG ↔ multiple SVGs ↔
illustration system. The decoration budget is the *most
sensitive* dial. A variant that over-decorates stops feeling
intentional.

**Cascading change rules when flipping**:

- Decoration budget up (zero → rules) ⇒ **every rule must be at
  the same opacity** (v2 uses `border-[#0a0a0a]` at 100%; v3
  uses `border-[#c8a85a]/30` at 30%). Mixed opacities read as
  "designer wasn't sure".
- Decoration budget up (rules → one SVG) ⇒ **the SVG must be
  repeatable, named, and stored as a component**
  (`<ArchitecturalSketch />`), not inlined per-section. A one-off
  SVG per section is decoration; a named component is a system.
- Decoration budget up (one SVG → multiple) ⇒ **revisit Dial 9**
  (section markers). A variant with multiple SVGs and `§` markers
  starts to feel like an architecture textbook, which is *not*
  the brief for any current variant.

### Dialing the system: a worked example

Suppose you want a **v5** that is "the same as v4 but on dark
ground". Walk the dials:

1. **Background** (Dial 1): light cream → dark navy. Apply
   cascading rules. Type flips (Dial 2 next), metadata re-tunes,
   hero veil inverts, hairline rules invert, corner stamps invert.
2. **Foreground** (Dial 2): charcoal → parchment. Apply cascading
   rules. Hover/active contrast re-tests pass with gold; the
   overlap word stays `text-cream` (it's still on a charcoal
   photograph, not the page background).
3. **Accent** (Dial 3): aged brass → gold. Apply cascading rules.
   The 30% opacity hairline moves to 40% for contrast.
4. **Display font** (Dial 4): unchanged (Cormorant Garamond).
5. **Body font** (Dial 5): unchanged (DM Sans).
6. **Italic usage** (Dial 6): unchanged (overlap word + editor's
   note). Italic gold accent words would now be available — the
   v3 pattern — but a v5 *should not* borrow the v3 pattern. If
   the overlap word becomes the italic-gold pattern, v5 collapses
   into v3.
7. **Layout primitive** (Dial 7): unchanged (12-col, broken;
   three composition templates rotated). The dark ground does
   not change the layout, only the materials.
8. **Imagery framing** (Dial 8): unchanged. The hero veil flips
   to `from-cream/…` and the legibility story inverts.
9. **Section markers** (Dial 9): unchanged ("Issue 04 / Volume I",
   "Editor's note", "End of issue"). They read fine on dark.
10. **Motion budget** (Dial 10): unchanged (six GSAP animations).
    The overlap fade-up still works; the `clipPath` reveal still
    works.
11. **Hover signature** (Dial 11): the underline shift moves from
    `aged-brass` to `gold`. Test contrast: `text-[#c8a85a]` on
    `bg-[#0d1b2a]` passes.
12. **Decoration budget** (Dial 12): unchanged. The one
    `<ArchitecturalSketch />` still works; its color moves from
    `text-foreground/25` (charcoal) to `text-parchment/30`
    (parchment).

Result: a coherent v5 = "v4 on dark navy, with parchment type and
gold underline". This is a valid new variant and is *not* v3,
because the layout, the section markers, the motion, the
imagery framing, and the SVG decoration are all still v4's.

### Dialing the system: an anti-example

Suppose you want "v4's overlap word on v1's mosaic grid, with v2's
table column split for the metadata, and v3's gold italic accent
on the section titles". Walk the dials:

- Dial 4 (display font) is "Cormorant Garamond" — borrowed from
  v4.
- Dial 6 (italic usage) is "section title accent" — borrowed from
  v3.
- Dial 7 (layout primitive) is "2-col mosaic" — borrowed from v1.
- Dial 7 sub-rule: the metadata display is "table column" — borrowed
  from v2.
- Dial 7 sub-rule: the metadata display *also* wants italic gold
  numerals — borrowed from v3.

This combination is incoherent: a 2-col mosaic cannot host a
table column; a table column cannot host italic gold display
numerals (the numerals are mono in v2 and roman in v3). The
dial settings contradict each other.

**If you find yourself combining two dial settings that are
mutually exclusive, you are designing a new variant — write a new
section in this document and walk the dials from scratch.**

### Gaps and opportunities (cross-variant)

These are gaps that span *all four* variants. A future
contributor should consider them.

1. **`prefers-reduced-motion` is not honored anywhere.** This is a
   real accessibility gap. v1 is the worst offender (eight
   animations). The fix is a single helper that returns
   `useRef(true)` if the user prefers reduced motion, and every
   `useEffect` that sets up a GSAP context gates on it.
2. **The "next/prev" loop wraps from the last project to the first.**
   Intentional with six projects, weird with sixty. A single
   source of truth for the loop boundary would help.
3. **The italic-accent-word is hardcoded per-page** ("crafted",
   "Selected", "viewing", "collision"). A future improvement is
   to source the accent word from the project data.
4. **The Preloader dismisses on `window.load`**, but a real
   user-perceived "load complete" is closer to "all images above
   the fold are decoded". v4 in particular has a large hero image
   that may decode after `window.load`. The current 2.5s safety
   timeout covers this; a future improvement would be to listen
   to the image's `onLoad` event.
5. **Variants are reachable only via the top nav.** A future
   addition could expose a `/variants` index page that lists the
   four variants side-by-side. The Playwright script in
   `scripts/verify-v2.mjs` already does this for verification;
   surfacing it as a route is a small change.
6. **Each variant has its own component directory but no shared
   `ProjectMeta` component.** A `ProjectMeta` component that
   accepts a `variant: "v1" | "v2" | "v3" | "v4"` prop and renders
   the per-variant metadata block would eliminate ~120 lines of
   duplication. Resist doing this if it would make any variant
   *less* legible — the duplication is currently a *feature*,
   because it forces the author to think about the per-variant
   shape.
7. **The `next/image` `sizes` warning we see in verification
   comes from v1's `ProjectsSection`.** It is not a v4
   regression. If a future contributor fixes it, the right
   fix is a `sizes` attribute that matches the grid's actual
   rendered widths, not a global `"100vw"`.

### How to use this section in 60 seconds

If you are an AI tool and you only have time for the highlights:

- There are **twelve dials** that distinguish the four variants.
  Every component decision maps to a dial.
- The dials are not independent: a small number of *combinations*
  are coherent. The four existing variants are four coherent
  combinations. v5 should be a *new* coherent combination, not
  a pick-and-mix.
- **Cascading change rules** tell you what *must* change when a
  single dial flips. The most common cascades: background flip
  → type flip; display face change → leading and tracking
  re-tune; layout primitive change → metadata display shape
  change.
- **Decoration budget** is the most sensitive dial. Keep it
  small and named.
- **Gaps**: `prefers-reduced-motion` is not honored; the next/prev
  loop wraps; the italic-accent-word is hardcoded; the Preloader
  dismisses before hero images decode.
- **Verify with Playwright** (`node scripts/verify-v2.mjs`) after
  any change. HTTP 200, zero page errors, zero failed requests.


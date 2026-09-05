# Winterior Design — Design Changelog

A running record of every design decision, big or small, made on this
project. Read this before opening a feedback thread so the same mistake
isn't made twice. Each entry explains **what changed**, **why**, and
**what compound effect it has** on the design as the project advances.

---

## 2026-09-05 — Plate pages: asymmetric → symmetric

### What
- `src/components/variants/v6/AtelierPlate.tsx` — the three asymmetric
  sections of the project plate page are now symmetric.

### Why
The original v6 plate used a deliberate 3-9 / 4-1-7 / 5-3-4 stagger
to create editorial tension. After multiple rounds of feedback and
several rounds of vocabulary-alignment (toward dotwooddesigns / woodkivu
/ crafty.ke), the asymmetric stagger was identified as fighting the
familiar reference feel those sites establish. Symmetric layouts
communicate **trust, clarity, craftsmanship** — exactly the brand
positioning of "serious interior architecture studio."

### Specific changes

1. **Brief section** — was `col-span-3 label | col-span-7 col-start-5 body`
   (3-1-8 staggered split). Now `col-span-6 | col-span-6` (symmetric
   6-6 split, both centered).
2. **Material palette** — was `col-span-4 label+heading | col-span-7
   col-start-6 list` (4-1-7 staggered). Now `col-span-6 | col-span-6`
   (symmetric 6-6).
3. **Additional views** — was a 3-template rotation (col-span-5, then
   col-span-4 col-start-7 md:mt-24, then col-span-3, with aspect ratios
   4/5, 3/2, 1/1 rotated). Now a uniform `grid-cols-1 sm:grid-cols-2
   lg:grid-cols-3 gap-6` of **4/5 portrait** tiles — same size, no
   vertical offsets, no aspect ratio rotation.
4. **Section headings** — `§ The brief`, `§ Material palette`, `§ The
   plate` — were all left-aligned at `col-span-3` or `col-span-4` with
   the body content offset to the right. Now centered above their
   content, with the eyebrow centered and the heading centered.
5. **Meta panel** — left untouched. It's a clean 3-3-3-3 horizontal row
   of small metadata chips (Location / Year / Discipline / Status),
   which is a *symmetric* grid by nature and was already working.
6. **Hero cover, full-bleed image, related plates, footer CTA** — left
   untouched. They were never asymmetric in the same way.

### Compound effect
- The plate page is now calmer to scroll. The eye settles at the
  center of each section rather than jumping from edge to edge.
- The site now reads more like **dotwooddesigns / woodkivu / crafty.ke**
  and less like a magazine layout — this is intentional and aligns with
  the client's "familiar feel" feedback.
- The 4/5 portrait grid on the additional views is the **same aspect
  ratio** the v6 index uses for its gallery tiles. Reading a project
  plate now feels like a continuation of the index, not a different
  design system.
- The v6 index still uses an asymmetric 3-template rotation in some
  places (marquee, services rows) — those are different kinds of
  asymmetry (typographic / non-grid) and don't conflict with the
  symmetric plate page.

### Verification
- `npm run build` — clean
- Vercel deployment READY
- Visual: each section on the plate page now has its content centered
  on a 6-6 split; the additional views grid is uniform
- Mobile: the symmetric grid degrades cleanly to single column

---

## Format for new entries

```
## YYYY-MM-DD — short title

### What
(file changes, in one or two sentences)

### Why
(rationale: what feedback, what reference site inspired it, what
    problem it solves)

### Specific changes
(numbered list of the exact changes)

### Compound effect
(how this interacts with previous changes)

### Verification
(how to confirm it worked)
```

Use this format for every design change going forward. Append new
entries at the **bottom** so the timeline reads top-to-bottom.

# Design Vocabulary Map — dotwooddesigns · woodkivu · crafty.ke → v6

**Purpose**: Give the studio (and any future AI) a shared *vocabulary* of
the design cogs/wheels/diction that the three reference sites share, and
map each one to **what v6 should adjust** vs **what v6 should keep**.
Goal: align the v6 feel with the references without throwing out the
edgier direction the client loves.

---

## How the references feel (one-line each)

- **dotwooddesigns** — Premium, confident, full-bleed photography with
  large centered editorial type. *Strong visual impact, simple nav,
  immediate CTA.* (Site currently in maintenance; reconstruction in
  progress per LinkedIn.)
- **woodkivu.co.ke** — Workmanlike, image-dense, project-led. 4 sliding
  full-bleed photos, then a 4-column value prop grid, then a tabbed
  project gallery (Mela Edge · Solid Wood · Spray Paint · Vacuum Press),
  then a 3-step process, then before/after, then footer. The personality
  is "skilled workshop that shows you everything they have made."
- **crafty.ke** — Calm, neutral, conversion-focused e-commerce for
  handcrafted Kenyan products. Plain typography, lots of whitespace,
  simple page list, product cards. Personality: "trustworthy shop."

---

## The 12 dials all three references share

Below is the **shared vocabulary** (the dials they all turn to the same
position) and what v6 should do for each.

### 1. **Project-first information architecture**

- **References**: Home → Projects (the visual heart) → About → Contact.
  woodkivu's hero is a sliding 4-photo montage of kitchens and
  **ENQUIRE** is the only CTA. crafty.ke's home is a product grid.
  dotwooddesigns leads with hero photography.
- **v6 status**: Already correct. Hero → projects → services → process →
  contact. **Keep.**

### 2. **Plain, clearly-named navigation**

- **References**: woodkivu = *About Us · Kitchens · Wardrobes · How we
  do it · Contact Us*. crafty.ke = *Homes · Shop · About · Blog · FAQs
  · Contact*. dotwooddesigns (cached) = *Home · About Us · Projects ·
  Contact*.
- **Common pattern**: 4–6 items, all single words or short noun phrases.
  No "Studio", no "Services", no clever branding-as-nav.
- **v6 status**: Currently *Home · Projects · About · Contact* (clean).
  **Keep.** Do not reintroduce abstract nav labels.

### 3. **Photography as the dominant content**

- **References**: Every reference treats photography as the primary
  content. No abstract illustrations, no stock placeholders, no
  decorative SVG.
- **v6 status**: Already correct (every section is photo-led).
  **Keep.** Do not add icons, badges, decorative shapes.

### 4. **Warm-neutral ground, single restrained accent**

- **References**:
  - woodkivu: white/cream ground, no strong brand color, deep charcoal
    text.
  - crafty.ke: cream/beige ground, charcoal text, occasional warm earth
    accent.
  - dotwooddesigns (cached screenshots): light ground, deep charcoal
    type, **aged brass / muted copper** as the only accent.
- **Common pattern**: Warm ivory/cream ground, near-black type, **one
  metal/earth accent** (brass, terracotta, copper, or none). No second
  accent. No SaaS gradients.
- **v6 status**: Already correct (`#F5F1E9` ground, `#171716` type,
  `#C66B3D` terracotta accent). **Keep.** The terracotta is a touch
  brighter than brass; if the client wants the brass reference feel,
  shift accent to `#A68A64` (the existing aged-brass token already in
  the v1 design system). This is a one-token swap, not a re-design.

### 5. **Serif display + clean sans body**

- **References**:
  - woodkivu uses a serif headline + sans body (looks like a workmanlike
    Playfair-ish or Lora-ish serif for the *ABOUT US · Wood Kivu
    Creative Solutions by Professional Designers* heading).
  - crafty.ke uses serif display ("Crafty KE" h1) + system sans body.
  - dotwooddesigns uses a large serif wordmark.
- **Common pattern**: Serif for *display* (the headlines that name
  things), sans for everything else. No monospace, no script, no
  decorative faces.
- **v6 status**: Cormorant Garamond + DM Sans. **Keep.** Do not add a
  third face.

### 6. **Generous vertical whitespace, no dead space**

- **References**:
  - woodkivu: vertical breathing room between the 4 hero slides, between
    the value-prop grid, between the tabbed gallery, between the 3-step
    process.
  - crafty.ke: lots of top/bottom padding on every page.
  - dotwooddesigns: editorial whitespace.
- **Common pattern**: Section padding of 80–120px on desktop, 48–64px on
  mobile. Sections rarely follow each other with zero gap.
- **v6 status**: Already strong (py-20 md:py-28). **Keep.**
- **Adjustment opportunity**: A few of v6's sub-sections (e.g. the
  inline intro under hero) feel like a wall of text. Add a 6–8 line
  vertical margin between hero/intro and intro/work for the same
  *page-turn* feel as woodkivu's hero→about transition.

### 7. **Tabbed or filtered gallery, with explicit category labels**

- **References**:
  - woodkivu: 4-tab project filter (*Mela Edge · Solid Wood · Spray
    Paint · Vacuum Press*) with all projects in each tab visible as a
    3-col grid.
  - crafty.ke: product grid with category filters.
  - dotwooddesigns: full project grid.
- **Common pattern**: Categories are **named in the customer's language**
  (material/finish names, not internal taxonomy). The filter is a row of
  chips/tabs at the top, not a sidebar.
- **v6 status**: We have a chip filter (*All Work · Kitchens ·
  Wardrobes · Bath Vanities · Shop Fit-Outs*). Categories are
  *disciplines* (correct for an interior design studio) but the wording
  could match woodkivu's finish-based labels. **Keep wording.** The
  current labels are clear and the v6 chips have a count badge (a small
  upgrade over the references, which the client liked).

### 8. **Process as a numbered 3–4 step list**

- **References**:
  - woodkivu: *Step 1 · Identifying client's needs · Step 2 · 3D
    design · Step 3 · Delivering envisioned products.* Three steps,
    numbered, with a short body line each.
  - crafty.ke: about page lists process.
- **Common pattern**: Process is **3–4 short numbered steps**, each with
  a title and one sentence. No icons, no large illustrations. The steps
  describe *what the client experiences*, not internal jargon.
- **v6 status**: We have 4 steps (*Consult · Design · Craft · Install*)
  with a 2-line body each. **Keep the structure** but tighten the body
  to one sentence per step (closer to woodkivu's terse, confident
  cadence).

### 9. **Visible, repeated "ENQUIRE" / WhatsApp / phone CTA**

- **References**:
  - woodkivu: every hero slide has an "ENQUIRE" button; footer has
    three phone numbers plus email; "WhatsApp Us" floating button bottom
    right.
  - crafty.ke: "Add to cart" on every product; "Contact" prominent.
  - dotwooddesigns (cached): "Get a quote" CTA in nav.
- **Common pattern**: One **persistent** conversion surface — a header
  CTA, a footer CTA, a floating WhatsApp pill, OR three phone numbers
  in the footer. Not all of them. The point: a visitor should never be
  more than one click from starting a conversation.
- **v6 status**: We have nav "Get a Quote" + contact section with two
  phone numbers + email + WhatsApp link. **Keep.** Do not add a
  floating WhatsApp pill on every page (the brief and feedback
  explicitly reject that pattern).

### 10. **Material-led value props**

- **References**:
  - woodkivu lists *kitchen Hood · Cabinets · Counter Tops · Draw Box
    and Glides* as a quick-link list.
  - crafty.ke tags every product with its material.
- **Common pattern**: Materials are **named explicitly and listed** as a
  short typographic strip — not a chip grid, not a card grid, not an
  icon. Just words.
- **v6 status**: We already render materials as a typographic list
  ("Natural Oak · Mahogany · Brushed Brass · Travertine · ...") on the
  index and on the plate page. **Keep.** This is one of v6's
  strongest alignments with the references.

### 11. **Simple, restrained footer**

- **References**:
  - woodkivu: 4-column footer (*About snippet · Quick Links ·
    Instagram · Get in touch with address + phones + email + social
    icons*).
  - crafty.ke: 3-column footer with site links + contact + social.
  - dotwooddesigns (cached): compact footer with logo + nav repeat.
- **Common pattern**: Footer is **3–4 columns**, all text, no big
  illustrations, includes address + phone + email + maybe one social
  icon. No newsletter signup (crafty.ke has one but the other two
  don't).
- **v6 status**: We have a 3-column footer (*Studio · Contact · Visit*).
  **Keep.** Could add a "Quick Links" column to match woodkivu's
  pattern.

### 12. **Single primary typeface for headings, no italic accents**

- **References**: woodkivu uses bold all-caps for section labels
  ("ABOUT US", "BEFORE & AFTER") but the *body* of headlines is roman
  serif. No italic words inside a roman headline. crafty.ke uses roman
  throughout. dotwooddesigns (cached) uses roman throughout.
- **Common pattern**: **No italic accent word inside a roman headline.**
  Italics in serif type on screen feel decorative and date the site.
  The references avoid them.
- **v6 status**: Already fixed in the last feedback round. **Keep**
  the all-roman headlines. Do not reintroduce the italic accent.

---

## The 5 dials where v6 should *diverge* (the "edgier" the client loves)

These are the dials where v6 is **intentionally edgier** than the
references. Keep them — they're the client's "forward-looking" stamp of
approval.

| Dial | Reference position | v6 position | Why we keep v6 here |
|---|---|---|---|
| **Hero motion** | woodkivu: simple slide carousel. crafty.ke: static grid. dotwooddesigns: full-bleed static. | v6: 4-photo auto-cycle with slow Ken Burns + animated photo-pagination dots on the right edge | A static hero reads as a 2018 design site. The slow cycle + pagination dots say "modern, considered, alive." |
| **Scroll-triggered reveals** | woodkivu: none visible. crafty.ke: none. | v6: GSAP `clipPath` image reveals, fade-up text blocks, slow Ken Burns | The references are image-only and don't *animate on scroll*. v6's subtle reveals are the "forward-looking" the client signed off on. |
| **Marquee strip** | References don't use a horizontal scrolling text band | v6: a single dark "Kitchens · Wardrobes · Bath Vanities · …" marquee between hero and intro | References feel "static." The marquee is a single, intentional lively moment. |
| **Single-item project overlay** | References use dedicated `/project/[slug]` routes | v6: in-page overlay with edge-tap, swipe, thumbnail strip, esc, URL-sync | The overlay is faster than a route change. Clients like the "instant" feel. |
| **Mobile scroll-snap gallery** | References use a stacked grid on mobile | v6: horizontal scroll-snap with focused-card scale + dim | The carousel is a stronger mobile experience. Keep. |

---

## The 7 micro-adjustments to bring v6 *closer* to the references

If the client wants the site to feel more like dotwood/woodkivu/crafty
*without* throwing out the edgier direction, these are the cogs to
turn. Each is small, reversible, and one-file.

| # | Dial | Current v6 | Reference-aligned adjustment | Effect |
|---|---|---|---|---|
| 1 | Accent color | `#C66B3D` (terracotta) | `#A68A64` (aged brass, already in v1 tokens) — one-line swap | Reads as "interior design industry" rather than "tech startup" |
| 2 | Hero sub paragraph | Backed by a dark plate for legibility | Drop the dark plate, let the cream italic sit on the photo veil alone | Closer to woodkivu's *plain overlay copy on photo* pattern |
| 3 | Process step body | 1–2 sentences each | Tighten to one short sentence each (closer to woodkivu's terse style) | Less "marketing" more "trade workshop" |
| 4 | Materials panel | Single dark surface with 9-item grid | Split into "Woods" / "Stones" / "Metals" sub-strips (closer to woodkivu's "Hood · Cabinets · Counter Tops" sub-grouping) | Reads as trade vocabulary, not feature list |
| 5 | Footer | 3 columns (Studio · Contact · Visit) | Add a "Quick Links" column (Projects · Services · Process · Journal) matching woodkivu | Familiar footer pattern visitors expect |
| 6 | WhatsApp | Single link in contact section | Add the WhatsApp link in the top nav utility strip (next to phone/email) | Mirrors woodkivu's "click-to-chat from anywhere" pattern |
| 7 | Project images | Already 4:5 portrait | Add a small `Material` line + `Year` line below each project title in the gallery tile (we already do this) | Already aligned — **keep** |

---

## What the three references do *not* have (and v6 should not add)

These are the dials the references leave at 0. Do not introduce them.

- **No custom cursor** (none of the three use one). v6 already has one
  via shared `CustomCursor`; this is part of the "edgier" direction the
  client approved. Keep.
- **No glassmorphism / blur surfaces** (none of the three use it).
- **No purple/blue SaaS gradients** (none of the three use it).
- **No 3D transforms / perspective** (none of the three use it).
- **No SVG path animations / Lottie** (none of the three use it).
- **No badge/icon grid in services** (all three use typographic lists).
- **No oversized rounded containers** (all three use sharp
  rectangles, not pills).
- **No hamburger on desktop** (all three show the full nav).
- **No scroll-jacking / hijacking** (all three use native scroll).

---

## The vocabulary in one paragraph (for the next AI)

**v6's brief is to read as a serious interior architecture studio that
happens to scroll, not as a SaaS template. The references (dotwood,
woodkivu, crafty) all share a *common vocabulary*: project-first IA,
plain 4-item nav, photography-dominant content, warm-neutral ground +
one restrained metal/earth accent, serif display + sans body, generous
whitespace, a tabbed/chip-filtered project gallery, a 3–4 step
typographic process list, an explicit materials strip, a simple
3–4-column footer with phone + email + address, and an "Enquire" /
"Get a quote" surface that is *always one click away*. None of them
use glassmorphism, gradients, custom cursors, italic accent words
inside roman headlines, or oversized rounded cards. v6 already speaks
this vocabulary. The edgier dials the client signed off on — 4-photo
cycling hero, GSAP clipPath reveals, slow Ken Burns, marquee strip,
single-item overlay, mobile scroll-snap carousel — are *additions* to
the shared vocabulary, not replacements. To move v6 toward the
references without throwing out the edge: swap the terracotta accent
to aged brass, drop the hero sub plate, tighten the process body, group
materials into Woods/Stones/Metals, add a Quick Links footer column,
and surface WhatsApp in the nav utility strip. Don't change anything
else.**

---

*End of vocabulary map. The next step is to pick which of the 7
micro-adjustments to ship first; my recommendation is 1, 3, 5, 6 — the
cheapest, highest-alignment dials.*

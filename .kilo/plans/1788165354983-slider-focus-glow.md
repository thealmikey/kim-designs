# Plan: Fix hero slider loading, stuck pagination, add focus glow

## Current behavior
- First slide image flashes blank because the slide is revealed by GSAP before the `Image onLoad` fires.
- Clicking pagination can appear "stuck" because the incoming slide becomes visible via GSAP while its image is still `opacity-0` (gated by the `loaded` state).
- No visual glow/focus indicator on the active slide.

## Root causes
1. `loaded` state gates image `opacity`. GSAP sets `autoAlpha: 1` on the slide container immediately, but the `<Image>` stays invisible until `onLoad` fires — blank slide reveal.
2. Lazy-loaded off-screen images (slides 2+) are not fetched until the slide is navigated to, so transitions land on an invisible slide.
3. No focus-state styling on the active slide.

## Proposed fix

### A. Remove image-load gating on slide visibility
- Delete the `loaded` state entirely.
- Remove the `onLoad` handler and the `bg-stone/30 animate-pulse` skeleton.
- Let GSAP control slide reveal; let `<Image>` handle its own decode opacity.
- Use `placeholder="blur"` with a 10×10 base64 cream-pixel SVG for every slide so the browser has something to paint immediately.

### B. Eager-load first 3 slides; preload adjacent on navigation
- `priority` / `fetchPriority="high"` / `loading="eager"` on slides 0, 1, 2 (instead of just 0, 1).
- On `index` change, set `<link rel="preload">` for the new slide's image and the next/prev slide's image via a `useEffect` that writes to `document.head`. This primes the browser cache so the transition lands on a decoded image.

### C. Fix "stuck" transition
- In the `useLayoutEffect` transition (line 138), the incoming slide's image container (`imgsRef.current[to]`) should start at `opacity: 0` and animate to `opacity: 1` over 0.6s alongside the clip-path reveal. This way, even if the image isn't fully decoded, the user sees the slide fade in smoothly rather than snapping to blank.
- Use `will-change: opacity` on the image container and let the `transition-opacity duration-700` CSS handle the image fade once it decodes.

### D. Active-slide glow
- When `isActive` is true, the slide wrapper gets:
  - `box-shadow: inset 0 0 0 1px rgba(166,138,100,0.25)` (brass border glow)
  - `box-shadow: 0 0 40px rgba(166,138,100,0.15)` (ambient glow)
- On mobile, also add a bottom `h-1 bg-aged-brass` bar under the active slide's image area.
- The glow should be CSS-only (no JS), applied via a conditional className.

### E. Mobile-specific focus cue
- On `md:` and below, the active thumbnail in the strip already has `border-aged-brass`. Enhance it with `shadow-[0_0_12px_rgba(166,138,100,0.4)]` and a slight scale-up (`scale-105`) so the active state is unmistakable on touch.

## Files changed
- `src/components/ProjectSlider.tsx` — single file, all changes contained.

## Validation
1. `npx tsc --noEmit` — zero errors.
2. `npm run build` — succeeds, 27 static pages generated.
3. Manual: open `/`, confirm first slide image appears within 300ms, click pagination dots rapidly — no blank/stuck frames, glow visible on active slide.
4. Mobile emulation: confirm glow bar + thumbnail glow are visible.

## Rollout
- Single commit: `git commit -m "Slider: fix first-load blank, add preloads, active glow"` then push + `vercel --prod --yes`.

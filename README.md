# Kim Interior Designs

The site for Kim Interior Designs — a bespoke interior design studio in
Nairobi. Built on Next.js, Tailwind, GSAP, and a custom multi-variant
gallery system.

The **default site is v5 (Gallery)**: a visual product gallery with
multi-select, WhatsApp share, and a full-screen single-item view with
a thumbnail strip. Three other variants (Archive, Viewing, Collision)
live in parallel and are reachable from the top nav.

See [`VARIANTS.md`](./VARIANTS.md) for the full variant system map and
[`DEPLOY.md`](./DEPLOY.md) for the Vercel deploy instructions.

## Local development

```bash
npm install
npm run dev
```

The dev server runs on <http://localhost:3000>.

Copy `.env.example` to `.env.local` and fill in the values if you want
the metadata to use the production site URL.

## Available routes

| Route | Variant | Description |
|---|---|---|
| `/` | v5 (Gallery) | The home page — visual product gallery |
| `/work` | v5 (Gallery) | All work, same gallery |
| `/projects/[slug]` | v5 (Gallery) | Single-item view with thumbnail strip |
| `/v2/work`, `/v2/work/[slug]` | v2 (Archive) | Brutalist specimen register |
| `/v3/work`, `/v3/work/[slug]` | v3 (Viewing) | Private gallery / luxury exhibit |
| `/v4/work`, `/v4/work/[slug]` | v4 (Collision) | Architecture/furniture editorial publication |
| `/v5/gallery`, `/v5/gallery/[slug]` | v5 (Gallery) | Alias routes for the home/work paths |
| `/studio`, `/services`, `/contact` | Static | Studio, services, contact pages |

## Scripts

- `npm run dev` — start the dev server with Turbopack
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Verifying the build

```bash
node scripts/verify-v2.mjs           # all 4 variants across viewports
node scripts/verify-v5-gallery.mjs   # v5: select, share, single-item, toggle
node scripts/verify-deploy.mjs       # v5 as default across all routes
node scripts/verify-work.mjs         # portfolio section across viewports
node scripts/verify-project-detail.mjs  # project detail at 1366x641
```

All scripts expect a dev server already running on
`http://localhost:3000`.

## Tech stack

- [Next.js 16.3.3](https://nextjs.org) (App Router, RSC, Turbopack)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [GSAP 3.15 + ScrollTrigger](https://gsap.com) for v1 motion
- [Lenis](https://lenis.darkroom.engineering/) for inertial scroll
- [next/image](https://nextjs.org/docs/app/api-reference/components/image)
  for all photography
- [Context7 MCP](https://context7.com) (dev-time only) for library docs

No new dependencies are required to add a fifth variant — see
[`VARIANTS.md`](./VARIANTS.md) for the extension guide.

## License

Proprietary. © 2026 Kim Interior Designs. All rights reserved.

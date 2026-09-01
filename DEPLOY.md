# Deploying to Vercel — winterior.vercel.app

## One-time setup (do this before the first deploy)

### 1. Create a Vercel account

Sign up at <https://vercel.com/signup> with the email
**thealmikey@gmail.com** (account name `thealmikey`).

### 2. Install the Vercel CLI locally (optional, but recommended)

```bash
npm i -g vercel
vercel login
```

The CLI will open a browser to authenticate. After that, you can run
`vercel` from the project root to deploy.

### 3. Link the project to a Vercel project

From the project root:

```bash
vercel link
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select **thealmikey's projects**
- Link to existing project? **N** (first time)
- Project name? `winterior` (this becomes the subdomain: `winterior.vercel.app`)

If the name `winterior` is taken, pick a different name; the alias
`winterior.vercel.app` only works if the project name matches.

### 4. Set environment variables

Vercel reads env vars at build time. The app uses:

| Variable | Required | Where it's used |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Metadata base URL, WhatsApp share link source |
| `NEXT_PUBLIC_SITE_NAME` | yes | Site name in metadata, OG tags |

Set them in **Vercel Dashboard → Project → Settings → Environment Variables**:

- `NEXT_PUBLIC_SITE_URL` = `https://winterior.vercel.app`
- `NEXT_PUBLIC_SITE_NAME` = `Kim Interior Designs`

Tick **Production**, **Preview**, and **Development** for both.

If you prefer the CLI:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# enter: https://winterior.vercel.app

vercel env add NEXT_PUBLIC_SITE_NAME production
# enter: Kim Interior Designs
```

Local development: copy `.env.example` to `.env.local` and fill in the
values. `.env.local` is gitignored, so it never leaves your machine.

### 5. Push to GitHub

If you haven't already, create a repo on GitHub under thealmikey's
account, then:

```bash
git init
git add .
git commit -m "Initial commit: v5 Gallery as the main site"
git branch -M main
git remote add origin git@github.com:thealmikey/winterior.git
git push -u origin main
```

`vercel.json` is committed; `.env*` is gitignored; `node_modules` is
gitignored. Nothing sensitive will be pushed.

### 6. Connect the repo to Vercel

In the Vercel dashboard:

1. **Add New Project → Import** the GitHub repo `thealmikey/winterior`.
2. Vercel auto-detects **Next.js** as the framework.
3. Click **Deploy**.

After the first deploy, every push to `main` triggers a production
deploy, and every PR gets a preview URL.

### 7. (Optional) Custom domain

To use `winterior.com` instead of `winterior.vercel.app`, buy the
domain, then in Vercel: **Project → Settings → Domains → Add** and
follow the DNS instructions. The `winterior.vercel.app` URL keeps
working as a fallback.

---

## What was changed for the v5-as-default launch

| Route | Before | After |
|---|---|---|
| `/` (home) | v1 hero + projects section + studio/services/contact | v5 Gallery grid with a short intro and links to /studio, /services, /contact |
| `/work` | v1 portfolio grid | v5 Gallery grid (same component as `/`) |
| `/projects/[slug]` | v1 detail (full hero, meta strip, image grid) | v5 SingleItemView (full-screen, thumbnail strip, breadcrumb, swipe, tap-to-toggle, +Select) |
| `/v2/work`, `/v3/work`, `/v4/work` | Variant pages (unchanged) | Variant pages (unchanged — links still reachable from the nav) |
| `/v5/gallery`, `/v5/gallery/[slug]` | v5 routes | v5 routes (kept as aliases for the canonical pages) |

The variant switcher in the top nav now shows **Archive / Viewing /
Collision** only (the "Gallery" link is gone — the gallery is the
home page now).

## Files added for the deploy

- `.env.example` — documents `NEXT_PUBLIC_SITE_URL` and
  `NEXT_PUBLIC_SITE_NAME`. No values, safe to commit.
- `vercel.json` — framework auto-detect, security headers, immutable
  caching for `/_next/static/`, build region `fra1` (Frankfurt, closer
  to Kenya than the default `iad1`).

## Security notes

- **Never** commit `.env.local`, Vercel tokens, GitHub tokens, or
  passwords. The `.gitignore` already excludes `.env*`.
- Set Vercel env vars in the dashboard, not in `vercel.json`.
- Rotate the email password for `thealmikey@gmail.com` if you haven't
  enabled 2FA yet, and enable 2FA.
- Rotate the Context7 API key (it was shared in chat) by editing
  `~/.config/kilo/kilo.json` on your local machine.

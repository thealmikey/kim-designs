# Push and Deploy — Run These From Your Local Terminal

I have **committed** the project to a fresh local Git repo
(`main` branch, commit `8e764a6`, 116 files, 14,268 insertions).
I have **not pushed** and **not deployed** — those steps require
your credentials, and the only safe place for those credentials is
in your own shell, never in mine.

## One-time prerequisites

```bash
# Install the GitHub and Vercel CLIs (if you haven't already)
npm install -g gh vercel

# Authenticate (a browser will open)
gh auth login                  # GitHub
vercel login                   # Vercel
```

Both will redirect to a browser to authorize. Use the same
`thealmikey@gmail.com` account that owns `thealmikey/winterior`.

## 1. Create the GitHub repo and push

If you don't have a repo yet, create one (private) at
<https://github.com/new> with the name **`winterior`** and **do not**
initialize it with a README / .gitignore / license (the local repo
already has those). Then:

```bash
cd "C:\Users\user\Desktop\projects\kim-designs"

gh repo create thealmikey/winterior --private --source=. --remote=origin --push
```

`gh` will create the repo on GitHub, add it as the `origin` remote,
and push `main`. If the repo already exists, use this instead:

```bash
git remote add origin git@github.com:thealmikey/winterior.git
git push -u origin main
```

Verify on GitHub: <https://github.com/thealmikey/winterior> should show
the initial commit.

## 2. Deploy to Vercel

```bash
cd "C:\Users\user\Desktop\projects\kim-designs"

vercel link --yes
# follow the prompts:
#   Set up and deploy? Y
#   Which scope? thealmikey's projects
#   Link to existing project? N
#   Project name? winterior   <-- must be 'winterior' for winterior.vercel.app

# Set the two env vars the app reads at build time
vercel env add NEXT_PUBLIC_SITE_URL production
# when prompted, type: https://winterior.vercel.app
vercel env add NEXT_PUBLIC_SITE_NAME production
# when prompted, type: Kim Interior Designs

# Deploy to production
vercel --prod
```

The first `vercel --prod` after a fresh link will create a
production deploy and a preview URL. The production URL will be
`https://winterior.vercel.app` because the project is named
`winterior`.

Verify: open <https://winterior.vercel.app> — you should see the v5
Gallery as the home page.

## 3. After the first deploy

- **Continuous deploys**: from now on, every `git push origin main`
  triggers a Vercel production deploy automatically.
- **Preview deploys**: every PR gets a unique preview URL.
- **Custom domain** (optional, to use `winterior.com` instead of
  `winterior.vercel.app`): buy the domain, then in Vercel go to
  *Project → Settings → Domains → Add*, and follow the DNS
  instructions.

## Security — important

**Before you push**, please do these two things (the tokens are now
in our chat history and are at risk):

1. **Rotate the GitHub personal access token** at
   <https://github.com/settings/tokens> — revoke the old one
   (`ghp_…`) and generate a new one with the scopes you need (likely
   `repo` only).
2. **Rotate the Vercel token** at
   <https://vercel.com/account/tokens> — revoke `vcp_…` and
   generate a new one.

When you run `vercel login`, it will open a browser to your Vercel
account and use OAuth — your *new* token never has to be pasted into
the terminal. Same for `gh auth login`. The PATs in the project's
`.env` are now obsolete; you can leave them (they're gitignored) or
delete them.

The `.env` file is gitignored, so the tokens will never be committed.
But because they were pasted in chat, treat them as compromised.

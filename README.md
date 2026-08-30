# sidequests

I'm Milana. This is where I track every side project I start — from the ones that took off to the ones that stalled halfway through — because I think the mess of trying things is more useful to look at than the highlight reel. If you've ever had ten ideas going at once and wondered if that was a problem, it's not, and this site is proof.

**Live:** [milanaunbound.github.io/sidequests](https://milanaunbound.github.io/sidequests/)

## Add a sidequest

All sidequest data lives in code. There is no admin panel or database.

1. Open `src/App.tsx`
2. Add a new object to the `SEED_QUESTS` array (title, description, status, progress, startDate, tags, media)
3. Commit and push to `main`
4. GitHub Actions rebuilds and redeploys automatically — live in a minute or two

## Local development

```bash
pnpm install
pnpm dev
```

The site is served at [http://localhost:5173/sidequests/](http://localhost:5173/sidequests/) because GitHub Pages hosts it under the repo name.

## Deploy

Every push to `main` runs `vite build` and publishes `dist/` to GitHub Pages.

First-time setup: in the GitHub repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

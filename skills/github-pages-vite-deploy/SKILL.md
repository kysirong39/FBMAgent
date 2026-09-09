---
name: github-pages-vite-deploy
description: >
  Comprehensive guide and architectural patterns for deploying Vite + React web
  applications to GitHub Pages without errors. Fixes blank white screens,
  'Failed to load resource: 404 main.tsx', asset path resolution issues,
  and deployment setting mismatches between GitHub Actions and branch deployments.
---

# GitHub Pages Vite + React Deployment Skill

This skill provides a standardized, fail-safe architecture to ensure Vite + React
web applications build and run reliably on GitHub Pages (`username.github.io/repo-name/`)
under all deployment modes.

---

## 1. Problem Anatomy & Root Cause Analysis

When users export or push a Vite + React project to GitHub and enable GitHub Pages, they
frequently encounter a **blank white screen** with the following browser console error:

```
Failed to load resource: the server responded with a status of 404 () main.tsx:1
Failed to load resource: the server responded with a status of 404 () favicon.ico:1
```

### Why this happens:
1. **Uncompiled Source Served from Root**:
   In GitHub repository **Settings -> Pages**, GitHub defaults to:
   `Source: Deploy from a branch` -> Branch: `main` (or `master`), Folder: `/ (root)`.
   GitHub Pages is a simple static file host—it has no Node.js runtime and cannot execute
   or bundle Vite/TypeScript files on the fly.
   When GitHub Pages serves the repository root `index.html`, that file contains:
   `<script type="module" src="/src/main.tsx"></script>`.
   Browsers cannot execute raw `.tsx` and the path `/src/main.tsx` attempts to load
   from `https://username.github.io/src/main.tsx` (the domain root), returning **404 Not Found**.

2. **The Output Directory Mismatch**:
   Production builds are placed in `dist/`, which is normally in `.gitignore` and not
   committed to `main`. Unless GitHub Actions builds the project or a compiled folder is
   committed, GitHub Pages serves raw development source code.

3. **Subpath Asset Resolution**:
   GitHub Pages hosts project sites under a subfolder: `https://<username>.github.io/<repo-name>/`.
   If `base` is `/` instead of `./`, compiled assets try to load from `https://<username>.github.io/assets/...`
   instead of `https://<username>.github.io/<repo-name>/assets/...`, causing 404s.

4. **Missing `.nojekyll`**:
   GitHub Pages runs Jekyll by default, which ignores folders starting with `_` or symbols.
   A `.nojekyll` file is mandatory in the root of the deployed artifact.

---

## 2. The "Triple-Shield" Architecture (Never-Fail Strategy)

To guarantee that the web application works regardless of which setting the user chooses in
GitHub Pages, implement the **Triple-Shield Pattern**:

```
                              User visits GitHub Pages URL
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                ▼                                                     ▼
     Source = GitHub Actions                                Source = Deploy from a branch
   (Automated workflow builds                             (Serves committed branch files)
    & deploys ./dist artifact)                                         │
                │                                    ┌─────────────────┴─────────────────┐
                │                                    ▼                                   ▼
                │                          Branch = gh-pages                 Branch = main
                │                      (Action auto-pushed ./dist)                     │
                │                                    │                    ┌────────────┴────────────┐
                │                                    │                    ▼                         ▼
                │                                    │             Folder = /docs           Folder = /(root)
                │                                    │           (Pre-built bundle)    (Raw uncompiled index.html)
                │                                    │                    │                         │
                │                                    │                    │             [Root Fallback Shield]
                │                                    │                    │         Inline script auto-redirects
                │                                    │                    │               to ./docs/
                │                                    │                    │                         │
                ▼                                    ▼                    ▼                         ▼
       Loads dist/index.html               Loads dist/index.html   Loads docs/index.html   Redirects to docs/index.html
       =====================               =====================   =====================   ============================
                            >>> APP RENDERS PERFECTLY IN ALL CASES <<<
```

### Shield 1: Self-Healing Root Fallback (`index.html`)
Tag the development entry point with `id="vite-raw-dev-entry"`:
```html
<script id="vite-raw-dev-entry" type="module" src="/src/main.tsx"></script>
<script>
  /* GitHub Pages Root Fallback Shield:
   * When deployed from raw repo root (main branch), browsers cannot load uncompiled /src/main.tsx.
   * If #vite-raw-dev-entry is present on github.io, immediately route to /docs/ where the compiled bundle is ready.
   */
  (function() {
    var rawEntry = document.getElementById('vite-raw-dev-entry');
    var isGitHubPages = window.location.hostname.endsWith('github.io');
    if (rawEntry && isGitHubPages) {
      var path = window.location.pathname;
      if (!path.includes('/docs') && !path.includes('/dist')) {
        var target = path.endsWith('/') ? path + 'docs/' : path + '/docs/';
        window.location.replace(window.location.origin + target + window.location.search + window.location.hash);
      }
    }
  })();
</script>
```
*Why this works:* During `vite build`, Vite completely deletes `<script type="module" src="/src/main.tsx"></script>`
and replaces it with bundled `<script type="module" crossorigin src="./assets/index.js"></script>`.
Therefore, in production builds, `document.getElementById('vite-raw-dev-entry')` is `null` and no redirect occurs.
Only if GitHub Pages mistakenly serves the raw, uncompiled file will the redirect fire, seamlessly routing the user to `/docs/`!

### Shield 2: Dual Build Output (`dist/` + `docs/`)
In `package.json`, configure the build script to generate:
1. `dist/` (used by full-stack Node server & GitHub Actions)
2. `docs/` (tracked in git, ready for immediate `Deploy from a branch -> main /docs`)

```json
"scripts": {
  "build": "vite build && vite build --outDir docs && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
  "build:client": "vite build && vite build --outDir docs",
  "build:docs": "vite build --outDir docs"
}
```

Ensure `.gitignore` does **NOT** ignore `docs/`.

### Shield 3: Multi-Target GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Create a workflow that deploys via official `actions/deploy-pages@v4` AND auto-pushes to the `gh-pages` branch via `peaceiris/actions-gh-pages@v4`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Ensure .nojekyll and 404.html in dist and docs
        run: |
          touch ./dist/.nojekyll
          touch ./docs/.nojekyll
          cp ./public/404.html ./dist/404.html 2>/dev/null || true
          cp ./public/404.html ./docs/404.html 2>/dev/null || true

      - name: Deploy to gh-pages branch (supports 'Deploy from a branch')
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          keep_files: false

      - name: Setup GitHub Pages (supports 'GitHub Actions')
        uses: actions/configure-pages@v4

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        continue-on-error: true
```

---

## 3. Configuration Checklist

### A. Relative Base in `vite.config.ts`
```ts
export default defineConfig(() => {
  return {
    base: './', // CRITICAL: Ensures assets use relative paths (./assets/...)
    plugins: [react(), tailwindcss()],
    // ...
  };
});
```

### B. Favicon Guard
Provide explicit SVG favicon data URI or files in `public/`:
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
```
Create `public/favicon.svg` and `public/favicon.ico`.

### C. Client-Side Fallback for Full-Stack Features
Since GitHub Pages is purely static and cannot run Express/Node endpoints (`/api/*`):
- Any frontend component that calls `/api/*` MUST have a client-side fallback (try-catch block that executes pure client logic if the server returns 404 or fails to fetch).
- This ensures the UI remains fully functional even on static hosting.

---

## 4. GitHub Repository Settings Quick Guide

When setting up GitHub Pages in repository **Settings -> Pages -> Build and deployment**:

- **Recommended Option 1 (Zero-maintenance)**:
  - Source: **GitHub Actions**
  - Result: Every `git push` automatically runs `.github/workflows/deploy.yml` and publishes `./dist`.

- **Option 2 (Branch deployment - gh-pages)**:
  - Source: **Deploy from a branch**
  - Branch: **`gh-pages`**, Folder: **`/ (root)`**
  - Result: GitHub Actions keeps `gh-pages` updated with compiled code.

- **Option 3 (Branch deployment - main docs)**:
  - Source: **Deploy from a branch**
  - Branch: **`main`**, Folder: **`/docs`**
  - Result: GitHub Pages serves the committed `docs/` folder.

- **Even if the user mistakenly chooses `main` + `/ (root)`**:
  - The Root Fallback Shield instantly routes them to `/docs/`, preventing any 404 error or blank screen.

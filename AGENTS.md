# Project Rules & Persistent Instructions

## GitHub Pages Deployment Standards (Vite + React)
To prevent recurring deployment failures (such as blank white screens, `Failed to load resource: 404 main.tsx`, or incorrect asset path resolutions):

1. **Triple-Shield Deployment Pattern**:
   - **Vite Configuration**: Always keep `base: './'` in `vite.config.ts`.
   - **Root Fallback Shield in `index.html`**: The development entry script tag MUST have `id="vite-raw-dev-entry"`. An inline self-healing script follows it to detect if raw uncompiled `index.html` is served on `github.io`, automatically redirecting to `./docs/` where compiled assets reside.
   - **Dual Build Output**: `npm run build` must compile to both `dist/` (for production container and GitHub Actions) and `docs/` (committed to git for static branch deployment).
   - **Git Tracking**: Ensure `docs/` is NOT ignored in `.gitignore`.
   - **Multi-Mode Actions Workflow**: `.github/workflows/deploy.yml` must support both `Source: GitHub Actions` and auto-pushing `dist/` to the `gh-pages` branch for `Source: Deploy from a branch -> gh-pages`.
   - **Static Assets**: Always ensure `.nojekyll`, `404.html`, and valid favicon links/files exist so no 404 errors occur in browser DevTools.

2. **Client-Side Fallback for Full-Stack Endpoints**:
   - For any feature calling Express `/api/*` endpoints (such as URL extraction or AI generation), ensure a graceful client-side fallback is executed if the endpoint returns 404 or cannot be reached (e.g. when hosted as a static site on GitHub Pages).

3. **Domain & Category Integrity**:
   - Always ensure marketing copy, CTA, and media prompts match the detected sport category (e.g. swimming goggles must never reference rackets/vợt).

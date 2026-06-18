# Show Tools — Site Architecture

Living map of the Show Tools marketing website. Keep this accurate when structure changes.

## Stack
- Static site: **plain HTML + CSS + vanilla JavaScript**. No framework, no build step, no bundler, no package manager. Files are served exactly as written.

## Deploy pipeline
- `main` branch → **Cloudflare Pages**, which **auto-deploys on every push to `main`** (~30s).
- No manual deploy, no build command. **Pushing to `main` IS the deploy.** Do not add a build system or change Cloudflare/deploy config.
- Git: remote `origin`, branch `main`. Windows (PowerShell). Never force-push or rewrite history.

## Pages (all in repo root)
| File | Purpose |
|------|---------|
| `index.html` | Homepage. Hero → BLOOPER showcase (`#featured`, the star) → compact BLOOPER highlights → Resolume HUD "More in the Toolkit" card → compact ResHUD highlights → About → CTA → Email signup. |
| `products.html` | Lists both products as cards (BLOOPER first, Resolume HUD second). |
| `blooper.html` | BLOOPER product detail (gallery with looping demo video, features, install, parameters, download sidebar). |
| `resolume-hud.html` | Resolume HUD product detail. |
| `downloads.html` | Collapsible download panels for both products, Buy Me A Beer support card, Resolume HUD changelog, review form. |
| `about.html`, `contact.html`, `404.html` | Supporting pages. |

## Shared assets
- `css/style.css` — ALL styling for the whole site (single stylesheet).
- `js/main.js` — ALL shared behavior, loaded on every page.
- `js/donation.js` — loaded ONLY on `downloads.html`; star-rating review form → Web3Forms; Stripe thank-you banner.
- `assets/` — images (`blooper-main.jpg`, `blooper-params.png`, `screenshot-both.jpg`, logo SVGs), `resolume-hud-guide.pdf`.
- Favicons + `st-logo.png` in root.

## js/main.js — key functions (init* run on DOMContentLoaded)
`initPageLoader`, `initCanvas` (animated bg), `initCustomCursor`, `initScrollReveal` (`.reveal` fade-in), `initMobileNav`, `initNavActiveState`, `initTerminalTyping`, `initPageTransitions` (ST-logo overlay between pages), `initChangelog` (single changelog accordion), `initAccordions` (general handler for `.download-panel` accordions), `switchGallery`, `initSlideshow`, `countRepoDownloads(repo, targetIds)` + `fetchDownloadCount` (GitHub download counters).
- **bfcache recovery:** a top-level `pageshow` listener detects `event.persisted` (back/forward-cache restore) and resets `page-blurring` + `#pageTransition` to the post-load resting state so the back button never freezes on the transition overlay.

## External connections (do NOT break)
- **GitHub release downloads:**
  - BLOOPER: `https://github.com/kermitarmstrong/BLOOPER/releases/latest/download/BLOOPER.zip`
  - Resolume HUD: `https://github.com/kermitarmstrong/resolume-hud/releases/latest/download/ResolumeHud.exe`
- **GitHub API counters:** `api.github.com/repos/kermitarmstrong/BLOOPER/releases` and `.../resolume-hud/releases` via `countRepoDownloads()`.
- **Stripe (Buy Me A Beer):** `https://donate.stripe.com/dRm7sD9wfdgF6CV99V8g002`
- **Web3Forms (reviews):** `https://api.web3forms.com/submit` (key in `donation.js`).
- **Instagram:** `https://www.instagram.com/showtoolsofficial/`
- **YouTube:** BLOOPER demo `yvfiCFw885E`, BLOOPER tutorial `5DLjDBEYCxg`, ResHUD tutorial `qduGUrsTPW4`.
- Note: BLOOPER and resolume-hud are SEPARATE product repos. This is the *website* repo only.

## Critical element IDs / anchors (JS or cross-page links depend on these)
- Download counters: `homeBlooperCount`, `blooperDlCount`, `blooperDetailCount` (BLOOPER); `homeDownloadCount`, `dlPageCount`, `detailDownloadCount` (Resolume HUD). Counter logic skips any that are absent.
- Anchors on `downloads.html`: `id="blooper"` and `id="resolume-hud"` (linked as `downloads.html#blooper` / `#resolume-hud`).
- Review form IDs (downloads.html, used by donation.js): `starRating`, `reviewName`, `reviewText`, `submitReview`, `reviewNote`.

## Design tokens (css/style.css :root — use these, never hardcode)
- Colors: `--accent` (#00f0ff), `--accent-dim`, `--accent-glow`, `--accent-secondary` (#7b61ff), `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-card`, `--bg-glass`, `--border-subtle`, `--border-glow`, `--text-primary`, `--text-secondary`, `--text-dim`, `--white`, `--success`, `--danger`.
- Type: `--font-display` (Syne), `--font-body` (Outfit), `--font-mono` (JetBrains Mono).
- Spacing/motion: `--space-xs/sm/md/lg/xl/2xl`, `--duration-fast/med/slow`, `--ease-out`, `--ease-in-out`, `--nav-height` (80px), `--max-width` (1400px).

## Reusable component classes
`.section`, `.section-tight`, `.section-inner`, `.section-header`, `.section-label`, `.section-title`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-lg`, `.tag`, `.tag-free`, `.tag-downloads`, `.feature-card`, `.features-grid`, `.product-card`, `.product-showcase`, `.download-section`, `.download-item`, `.support-card`, `.changelog` (accordion), `.reveal` / `.reveal-delay-1..4`.
- `.highlight-strip` / `.highlight-item` / `.highlight-icon` / `.highlight-text` — compact homepage highlight strip (lighter than `.feature-card`); used for both BLOOPER and Resolume HUD highlights.
- `.download-panel` / `-header` / `-title` / `-tags` / `-actions` / `-toggle` / `-toggle-icon` / `-body` / `-body-inner` — collapsible accordion panels on downloads.html (toggled by `initAccordions` via the `open` class).

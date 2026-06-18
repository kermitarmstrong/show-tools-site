# Master Log

Chronological record of Claude Code work sessions on the Show Tools website.

---

## 2026-06-18 — Layout rebalance, download accordions, back-button bfcache fix

**Goal:** Three changes without breaking existing functionality, plus living docs.
1. Fix browser Back-button freeze (bfcache stuck on ST-logo transition overlay).
2. Rebalance homepage — shrink "Why BLOOPER?" to a compact strip, pull Resolume HUD up, add a matching ResHUD strip.
3. Downloads page — stacked collapsible product panels with quick-download + chevron; Buy Me A Beer reachable sooner.

### Results
- **Phase 0:** Confirmed architecture matches reality (static HTML/CSS/vanilla JS, Cloudflare auto-deploy on push to `main`). Git clean at start. Created `SITE-ARCHITECTURE.md` and this log.

- **Task 1 — bfcache fix (`js/main.js`):** Added a top-level `pageshow` listener. On `event.persisted === true` (back/forward-cache restore, where scripts don't re-run) it removes `page-blurring` from `<body>`, clears the `entering` class and inline opacity on `#pageTransition`, and adds `exiting` — the same resting state a normal page load leaves behind. Forward-navigation transition behavior untouched.

- **Task 2 — homepage rebalance (`index.html`, `css/style.css`):** Replaced the full 6-card "Why BLOOPER?" `.features-grid` with a compact `.highlight-strip` (4 items: Bump to Fire, Stack Up to 16, BPM & Bar Sync, True Circles Any Canvas). Moved the Resolume HUD "More in the Toolkit" `.product-card` up directly beneath it, then added a matching compact "Why Resolume HUD" strip (Custom Widget Builder, Real-Time OSC + REST, Show Mode Compatible, Lightweight & Fast). New `.highlight-strip` component added to CSS using existing tokens — deliberately lighter/smaller than `.feature-card`. About / CTA / Email unchanged.

- **Task 3 — downloads accordions (`downloads.html`, `css/style.css`, `js/main.js`):** Converted both product blocks into collapsible `.download-panel` accordions. Each has an always-visible header (name + version/FREE/live-count tags + quick Download button linking straight to the GitHub latest-release asset + chevron) and a collapsible body with the full details (description, video/PDF links, quick install, system requirements). Both default collapsed. Consolidated the two update banners into one compact banner above the panels. Moved "Buy Me A Beer" `.support-card` out of the ResHUD section so it sits once below both panels; changelog relabeled "Resolume HUD — Changelog"; review section unchanged. Added `initAccordions()` (querySelectorAll over `.download-panel-header`, toggles `open` per panel, leaves the download link clickable, and auto-opens a panel when reached via `#hash`). `initChangelog()` left intact.

- **Verify:** Parser-based HTML tag-balance check passed for `index.html` and `downloads.html` (both balanced). `node --check` passed for `js/main.js` and `js/donation.js`. All critical IDs/anchors present: `blooper`, `resolume-hud`, `blooperDlCount`, `dlPageCount`, `starRating`, `reviewName`, `reviewText`, `submitReview`, `reviewNote` (downloads), `homeBlooperCount` (home — `homeDownloadCount` was never on the homepage, so no regression). New CSS uses only existing custom properties — no new colors/fonts.

**Decisions on ambiguous points:**
- Both download panels default collapsed (compactness, per preferred option).
- Update banners consolidated into one tidy banner.
- Added a small enhancement: a `#hash`-targeted panel auto-expands so cross-page `#blooper`/`#resolume-hud` links still reveal content.

**What to eyeball on the live site after deploy:**
- Home → Products → Back no longer freezes on the ST-logo overlay.
- Homepage: compact BLOOPER strip → ResHUD card high up → matching ResHUD strip.
- Downloads: two collapsed panels, working quick-download + expanders, Buy Me A Beer reachable quickly.

# Video Prompt Lab V2.3 Growth Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Video Prompt Lab easier to discover, try, understand, and share by adding GitHub Pages deployment, three flagship compiler cases, launch assets, and release-ready documentation without changing the V2.2 compiler core.

**Architecture:** Keep `demo/` as the only frontend source and publish it through a Pages workflow that assembles a small `_site/` artifact with the canonical router/dataset JSON at the same relative paths the demo already expects. Treat examples and launch copy as documentation-only growth surfaces, while repository validation enforces their presence and key claims.

**Tech Stack:** Static HTML/CSS/JS, JSON, Python stdlib validator/evals, Node built-in test runner, GitHub Actions, GitHub Pages.

## Global Constraints

- No paid API keys.
- No second frontend stack.
- No generated popularity metrics.
- No permanent "best model" ranking.
- No claim that deterministic tests measure stochastic video quality.
- No change to the V2.2 compiler architecture unless a concrete deployment bug requires it.
- Prefer one source of truth: router, cases, failures, compiler logic remain canonical.
- Pages workflow uses current official GitHub actions: `actions/checkout@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`.

---

### Task 1: Make growth artifacts required before creating them

**Files:**
- Modify: `scripts/validate_repo.py`

**Interfaces:**
- Consumes: repository filesystem.
- Produces: non-zero validation exit when growth-layer files or README live-demo markers are absent.

- [ ] Add the following required files to `REQUIRED`: `.github/workflows/pages.yml`, `examples/cases/product-rain-shoe.md`, `examples/cases/dialogue-cafe-key.md`, `examples/cases/i2v-portrait-reaction.md`, `launch/README.md`.
- [ ] Add README invariants requiring `https://jupiterx0910.github.io/video-prompt-lab/`, `Flagship cases`, and `v2.2.0`.
- [ ] Push validator-only change and verify the branch CI fails because the new artifacts do not yet exist.

### Task 2: Add GitHub Pages deployment

**Files:**
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `demo/**`, `router/models.json`, `dataset/cases.json`, `dataset/failures.json`.
- Produces: Pages artifact whose root serves the demo and preserves `/router/models.json`, `/dataset/cases.json`, `/dataset/failures.json` relative paths.

- [ ] Create a build job on pushes to `main` and manual dispatch.
- [ ] Checkout with `actions/checkout@v6`, configure Pages with `actions/configure-pages@v6`.
- [ ] Assemble `_site/` by copying `demo/*` to `_site/`, router data to `_site/router/`, dataset data to `_site/dataset/`.
- [ ] Upload with `actions/upload-pages-artifact@v5`.
- [ ] Deploy from a dependent job to the `github-pages` environment with `pages: write` and `id-token: write` using `actions/deploy-pages@v5`.

### Task 3: Add three flagship end-to-end compiler cases

**Files:**
- Create: `examples/cases/product-rain-shoe.md`
- Create: `examples/cases/dialogue-cafe-key.md`
- Create: `examples/cases/i2v-portrait-reaction.md`

**Interfaces:**
- Consumes: canonical cases from `dataset/cases.json`, router capability vocabulary from `router/models.json`, failure taxonomy from `dataset/failures.json`.
- Produces: human-readable end-to-end examples with raw idea → Video IR → capability inference → route → compiled prompt → preflight → likely failures → minimal repair.

- [ ] Write Product / Rain Shoe Hero around object state, material response, and logo/shape continuity.
- [ ] Write Dialogue / Café Key Exchange around speaker attribution, sound sync, and emotional timing.
- [ ] Write Image-to-Video / Portrait Reaction around identity preservation, restrained motion, and input-image discipline.
- [ ] Do not include fabricated render scores, success rates, or leaderboard claims.

### Task 4: Upgrade README discovery and launch surfaces

**Files:**
- Modify: `README.md`
- Modify: `README_EN.md`
- Create: `launch/README.md`

**Interfaces:**
- Consumes: live Pages URL, three flagship case paths, current install command.
- Produces: above-the-fold live-demo CTA, compact flagship-case section, release/version visibility, reusable channel-specific launch copy.

- [ ] Add live demo CTA: `https://jupiterx0910.github.io/video-prompt-lab/`.
- [ ] Add a compact `Flagship cases` section linking the three cases.
- [ ] Add `v2.2.0` release visibility without inventing adoption metrics.
- [ ] Add launch drafts for GitHub, Show HN, Reddit, X, and a short Chinese announcement.
- [ ] Keep the core message: production specification + controlled iteration, not adjective collection.

### Task 5: Reach green CI and merge

**Files:**
- Modify only if needed to fix a verified validation/deployment issue.

**Interfaces:**
- Consumes: all files from Tasks 1–4.
- Produces: green PR CI and a merged `main` commit.

- [ ] Verify `python scripts/validate_repo.py` through CI.
- [ ] Verify `python evals/run_evals.py` through CI.
- [ ] Verify `node --test demo/compiler.test.mjs` through CI.
- [ ] Verify `node --check demo/app.js` through CI.
- [ ] Open a PR from `growth/v2-3-distribution` to `main`, confirm mergeable and all checks green, then squash merge.

### Task 6: Verify Pages and publish release-compatible metadata

**Files:**
- No source changes unless deployment reveals a concrete bug.

**Interfaces:**
- Consumes: merged `main` and GitHub Pages deployment.
- Produces: verified live site and a release-ready project state.

- [ ] Confirm the `main` Pages workflow completes successfully.
- [ ] Fetch `https://jupiterx0910.github.io/video-prompt-lab/` and verify the demo shell loads.
- [ ] Fetch the deployed router/case/failure JSON endpoints and verify they are reachable.
- [ ] If the connected GitHub surface exposes release/metadata writes, publish tag/release `v2.2.0`, repository description, and focused topics directly.
- [ ] If those write capabilities are not exposed, keep exact release notes and metadata recommendations in `launch/README.md` and report that limitation precisely rather than inventing completion.

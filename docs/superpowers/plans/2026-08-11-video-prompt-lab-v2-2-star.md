# Video Prompt Lab v2.2 Star Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency interactive demo that makes the V2.1 compiler, router and failure-diagnosis loop understandable and usable in under 30 seconds, while keeping canonical data and CI regression gates authoritative.

**Architecture:** Keep canonical model, example and failure data in JSON outside the UI. Put pure deterministic compiler logic in `demo/compiler.mjs`, test it with Node's built-in test runner, and let `demo/app.js` render the browser experience. Extend the existing Python validation and GitHub Actions workflow so demo/data drift fails CI.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Node built-in `node:test`, Python 3.11 zero-dependency validation, GitHub Actions.

## Global Constraints

- No npm dependencies or build step.
- No commercial video API calls, backend, authentication or analytics.
- Explicit model selection wins over automatic routing.
- Automatic routing is capability-match based, never a global model ranking.
- Canonical data remains in `router/models.json`, `dataset/cases.json`, and `dataset/failures.json`.
- The demo must not silently fall back to fake data if canonical files fail to load.
- No external fonts, JS/CSS frameworks, icon kits or CDNs.
- Rapidly changing prices, UI limits, durations and resolutions must not be hard-coded into core demo logic.
- Existing V2.1 evals must stay green.

---

### Task 1: Structured failure taxonomy

**Files:**
- Create: `dataset/failures.json`
- Modify: `docs/failure-diagnosis.md`
- Modify: `scripts/validate_repo.py`

**Interfaces:**
- Consumes: existing failure categories and `risk_tags` conventions from `dataset/cases.json`.
- Produces: `dataset/failures.json` with top-level `schema_version` and `failures`; every failure has `id`, `symptom`, `root_cause`, `fix`, `change_only`, `risk_tags`.

- [ ] **Step 1: Extend validation first**

Add requirements that `dataset/failures.json` exists, parses as JSON, has at least six unique failure IDs, and each failure contains all required non-empty fields.

- [ ] **Step 2: Run validation and verify RED**

Run:

```bash
python scripts/validate_repo.py
```

Expected: FAIL because `dataset/failures.json` does not exist.

- [ ] **Step 3: Add the structured taxonomy**

Create at least these failure IDs with specific repair instructions:

```text
identity-drift
motion-without-cause
camera-conflict
synthetic-render-look
object-state-reset
time-static
speaker-audio-swap
overmotion-i2v
```

- [ ] **Step 4: Point the human-readable diagnosis doc to the canonical JSON**

Keep the concise table, but state that `dataset/failures.json` is the machine-readable source used by the demo and evals.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
python scripts/validate_repo.py
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add dataset/failures.json docs/failure-diagnosis.md scripts/validate_repo.py
git commit -m "feat: add structured failure taxonomy"
```

---

### Task 2: Pure compiler module with tests

**Files:**
- Create: `demo/compiler.mjs`
- Create: `demo/compiler.test.mjs`

**Interfaces:**
- Consumes: parsed router object, case object, and form state.
- Produces exact exported functions:
  - `normalizeIR(state) -> object`
  - `inferCapabilities(state) -> string[]`
  - `routeModels(models, capabilities, explicitModelId) -> { selected, alternatives, matched, warning }`
  - `compilePrompt(state, ir, route) -> string`
  - `preflight(state, ir, route) -> string[]`
  - `buildBeforeAfter(caseRecord, models) -> { weak, diagnosis, improved }`

- [ ] **Step 1: Write failing Node tests**

Tests must assert:
- image-to-video infers `image_to_video`;
- dialogue infers `dialogue_audio` and `sound_sync`;
- explicit `kling` remains selected even when automatic score favors another model;
- auto routing returns a selected model and alternatives without a global rank claim;
- missing action produces a preflight warning;
- compilation contains subject, action and continuity when provided;
- Before/After output identifies at least one missing control dimension.

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test demo/compiler.test.mjs
```

Expected: FAIL because `demo/compiler.mjs` does not exist.

- [ ] **Step 3: Implement minimal pure compiler logic**

Rules:
- Normalize strings with trimming only; do not hallucinate missing scene facts.
- Infer capabilities from `mode`, `useCase`, dialogue/sound presence, and continuity requirement.
- Score each model by the count of matching `strengths`; preserve explicit-model precedence.
- Generate prompt sections in this order: task, subject/environment, trigger-action-consequence, camera, light, sound, continuity, avoid.
- Preflight warns on missing subject/action, contradictory or absent model capability, and image-to-video over-description risk when applicable.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
node --test demo/compiler.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add demo/compiler.mjs demo/compiler.test.mjs
git commit -m "feat: add deterministic browser prompt compiler"
```

---

### Task 3: Interactive static application

**Files:**
- Create: `demo/index.html`
- Create: `demo/styles.css`
- Create: `demo/app.js`

**Interfaces:**
- Consumes:
  - `../router/models.json`
  - `../dataset/cases.json`
  - `../dataset/failures.json`
  - exports from `./compiler.mjs`
- Produces one no-build browser application with four sections: Builder, Router, Before/After, Failure Playground.

- [ ] **Step 1: Add structural validation before UI files**

Extend `scripts/validate_repo.py` so CI expects all three demo files and checks that `demo/app.js` contains the three canonical JSON paths and imports `./compiler.mjs`.

- [ ] **Step 2: Run validation and verify RED**

Run:

```bash
python scripts/validate_repo.py
```

Expected: FAIL because the demo files are absent.

- [ ] **Step 3: Build semantic HTML shell**

Required controls:
- mode, use case, target model, duration, aspect ratio;
- subject, environment, trigger, action, consequence;
- camera, light, sound, continuity, avoid.

Required output regions:
- capability chips;
- router recommendation + alternatives + evidence/cautions;
- Video IR code block;
- compiled prompt;
- preflight warnings;
- example selector with weak/diagnosis/improved columns;
- failure selector with symptom/root cause/minimal fix/change-only guidance.

- [ ] **Step 4: Implement data loading and rendering**

`app.js` must:
- fetch all three JSON files with `Promise.all`;
- never embed fallback model/case/failure data;
- show an explicit HTTP-server instruction on load failure;
- update compiler outputs on form input;
- provide Copy Prompt and Load Example controls using browser APIs with graceful text fallback.

- [ ] **Step 5: Apply responsive technical-instrument styling**

Use CSS custom properties, system fonts, one accent, monospace output blocks, responsive grid, visible focus states, and `prefers-reduced-motion` support. No external resources.

- [ ] **Step 6: Verify static integrity and JS syntax**

Run:

```bash
python scripts/validate_repo.py
node --check demo/app.js
node --test demo/compiler.test.mjs
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add demo/index.html demo/styles.css demo/app.js scripts/validate_repo.py
git commit -m "feat: add interactive prompt compiler demo"
```

---

### Task 4: README conversion surface and visual asset

**Files:**
- Create: `docs/assets/compiler-demo.svg`
- Modify: `README.md`
- Modify: `README_EN.md`

**Interfaces:**
- Consumes: demo paths and verified Skills CLI command.
- Produces README entry points that send visitors to install, try or understand the project immediately.

- [ ] **Step 1: Extend README invariants in deterministic evals**

Modify `evals/run_evals.py` to require:

```text
npx skills add jupiterx0910/video-prompt-lab
python -m http.server
compiler-demo.svg
demo/index.html
```

in both relevant README onboarding surfaces (English can use the same commands).

- [ ] **Step 2: Run evals and verify RED**

Run:

```bash
python evals/run_evals.py
```

Expected: FAIL until README content and asset exist.

- [ ] **Step 3: Add a lightweight SVG hero/demo asset**

The SVG must visually show:

```text
Idea → Video IR → Capability Router → Prompt → Preflight → Repair
```

and include a compact sample of input, routed model, and output prompt. It must be repository-authored SVG with no external image references.

- [ ] **Step 4: Rewrite the README first screen**

Chinese and English README tops must include:
- compiler positioning;
- validation badge;
- skills.sh badge;
- one-command install;
- demo asset;
- three choices: Try Demo / Install Skill / Read Architecture.

Add a compact Before/After section and local demo command:

```bash
python -m http.server 8000
# open /demo/
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
python evals/run_evals.py
python scripts/validate_repo.py
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add docs/assets/compiler-demo.svg README.md README_EN.md evals/run_evals.py
git commit -m "docs: make compiler demo and install path visible"
```

---

### Task 5: CI gate for demo logic

**Files:**
- Modify: `.github/workflows/validate.yml`

**Interfaces:**
- Consumes: `demo/compiler.test.mjs` and existing Python validation/evals.
- Produces: a single validation job that rejects structural or compiler regressions.

- [ ] **Step 1: Add the test command to CI**

After Python validation/evals, run:

```bash
node --test demo/compiler.test.mjs
node --check demo/app.js
```

No npm install step.

- [ ] **Step 2: Push and inspect GitHub Actions**

Expected job steps:
- Validate repository: success;
- Run deterministic evals: success;
- Test demo compiler: success;
- Check demo browser JS: success.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/validate.yml
git commit -m "ci: test interactive demo compiler"
```

---

### Task 6: PR-level verification and presentation

**Files:**
- Modify: PR #1 metadata only after all repository checks pass.

**Interfaces:**
- Consumes: final branch head and GitHub Actions result.
- Produces: accurate PR title/body describing V2.1 + V2.2 without claiming rendered-video quality.

- [ ] **Step 1: Run complete verification**

```bash
python scripts/validate_repo.py
python evals/run_evals.py
node --test demo/compiler.test.mjs
node --check demo/app.js
```

Expected: zero failures.

- [ ] **Step 2: Compare branch to `main`**

Check changed file count, additions/deletions, and ensure no unrelated files were modified.

- [ ] **Step 3: Verify PR merge-ref GitHub Actions**

Require conclusion `success` on the latest run for the final head.

- [ ] **Step 4: Update PR**

Use a title centered on the compiler + interactive demo and a body that includes:
- V2.1 engineering system;
- V2.2 interactive experience;
- verified install command;
- exact test outputs;
- explicit non-goals.

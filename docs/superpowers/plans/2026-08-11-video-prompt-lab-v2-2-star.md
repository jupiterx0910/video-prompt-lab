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

## Completed implementation

### Task 1: Structured failure taxonomy — complete

- Added `dataset/failures.json` with eight distinct failures and repair-only guidance.
- Updated `docs/failure-diagnosis.md` and `dataset/README.md` to point to the machine-readable taxonomy.
- Added schema, required-field, unique-ID and risk-tag validation.
- TDD evidence: validation failed while the file was absent, then passed after the canonical taxonomy was added.

### Task 2: Pure compiler module with tests — complete

Implemented and exported:

```text
normalizeIR(state)
inferCapabilities(state)
routeModels(models, capabilities, explicitModelId)
compilePrompt(state, ir, route)
preflight(state, ir, route)
buildBeforeAfter(caseRecord, models)
```

`demo/compiler.test.mjs` verifies:

- image-to-video capability inference;
- dialogue/audio capability inference;
- explicit model precedence;
- automatic capability routing;
- missing-action preflight warning;
- subject/action/continuity preservation in compiled output;
- Before/After control-dimension diagnosis.

TDD evidence: the Node suite first failed because `demo/compiler.mjs` did not exist, then passed after the minimal implementation.

### Task 3: Interactive static application — complete

Added:

```text
demo/index.html
demo/styles.css
demo/app.js
```

The browser app consumes:

```text
../router/models.json
../dataset/cases.json
../dataset/failures.json
./compiler.mjs
```

Implemented:

- Prompt Builder;
- inferred capability chips;
- explainable model recommendation + alternatives + cautions;
- Video IR preview;
- copy-ready prompt;
- preflight output;
- canonical Before/After explorer;
- Failure Playground;
- copy controls;
- explicit HTTP-server error when opened in an unsupported `file://` context.

The final visual system is a dark technical-instrument layout with responsive mobile behavior, system fonts, one accent family and no external resources.

Browser QA was performed through a temporary Chrome/Chromium GitHub Actions workflow. Desktop, mobile and tall full-page screenshots were inspected; the temporary workflow was removed afterward.

### Task 4: README conversion surface — complete

Added `docs/assets/compiler-demo.svg` and rewrote Chinese and English README onboarding around:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

and the zero-dependency demo launch:

```bash
python -m http.server 8000
# open http://localhost:8000/demo/
```

README now leads with:

- Prompt Compiler positioning;
- CI + skills.sh badges;
- one-command Skill install;
- compiler visual;
- Interactive Demo / Skill / Architecture entry points;
- Before/After explanation;
- Router, Failure taxonomy, Dataset and CI differentiation.

TDD evidence: deterministic evals failed until the install command, demo path, launch command and visual asset were present.

### Task 5: CI gate — complete

`.github/workflows/validate.yml` runs:

```bash
python scripts/validate_repo.py
python evals/run_evals.py
node --test demo/compiler.test.mjs
node --check demo/app.js
```

No npm install or paid API key is required.

### Task 6: Final verification — complete

Latest PR merge-ref verification on 2026-08-11:

```text
Validation passed: 34 required files, 27 Markdown files, JSON parsed successfully.
Eval passed: 5 model profiles, 17 capability tags, dataset coverage, Skill and README invariants valid.
Node tests: 7 passed, 0 failed.
Browser JavaScript syntax check: passed.
```

The feature branch is based on `main` and contains only the V2.1/V2.2 prompt-compiler, data, demo, eval, docs and CI work described in the approved designs.

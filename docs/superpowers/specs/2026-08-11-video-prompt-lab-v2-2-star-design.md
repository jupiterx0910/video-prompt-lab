# Video Prompt Lab v2.2 — Star & Experience Design

Date: 2026-08-11
Branch: `agent/v2-compiler-evals`
Status: approved direction from the prior V2.2 proposal and user continuation

## Goal

Turn the V2.1 prompt compiler from an engineering system that is mostly read into a project that can be understood and experienced in under 30 seconds.

The V2.2 success criterion is not "more prompts". It is:

1. a visitor immediately understands the compiler idea;
2. a visitor can interact with the Video IR / router / prompt pipeline without installing dependencies;
3. the README shows concrete before/after and failure-repair value;
4. installation of the Agent Skill is one command;
5. the demo cannot silently drift away from the canonical router and dataset.

## Approaches considered

### A. Zero-dependency static web app — selected

Create a small `demo/` application using HTML, CSS and vanilla JavaScript. It reads the existing canonical JSON files at runtime.

Pros:
- no Node dependency or build step;
- easy to inspect and fork;
- works with `python -m http.server` and static hosting;
- keeps the repository's engineering-first character;
- CI can validate its references without browser tooling.

Cons:
- less component ergonomics than React;
- visual effects must remain intentionally simple.

### B. React/Vite product demo

Pros: faster UI composition, richer interactions.

Rejected for V2.2 because it adds a package manager, dependency updates and a build artifact to a repository whose core value is prompt engineering rather than frontend infrastructure.

### C. README-only visual refresh

Pros: cheapest and easiest to maintain.

Rejected because it explains the compiler but does not let visitors experience the routing and diagnosis loop.

## Architecture

```text
router/models.json ───────┐
                          ├──> demo/index.html + app.js
 dataset/cases.json ──────┤       |
                          │       ├── Prompt Builder
 dataset/failures.json ───┘       ├── Model Router
                                  ├── Video IR preview
                                  ├── Before / After
                                  └── Failure Playground
```

Canonical content remains outside the demo. The demo is a consumer, not a second source of truth.

## Components

### 1. Interactive Prompt Builder

Inputs:
- generation mode: text-to-video / image-to-video;
- use case: product / cinematic / social / documentary / dialogue / multi-shot;
- optional target model: Auto, Seedance, Veo, Sora, Kling, Runway;
- duration and aspect ratio;
- subject;
- environment;
- trigger / action / consequence;
- camera;
- light;
- sound;
- continuity / avoid constraints.

Outputs:
- normalized Video IR;
- inferred capability tags;
- model recommendation with a concise explanation;
- model-aware copy-ready prompt;
- targeted negatives / continuity line;
- preflight warnings.

The browser compiler is deliberately transparent and deterministic. It does not pretend to be an LLM. It demonstrates the repository's reasoning pipeline.

### 2. Model Router

Routing uses the same `strengths` tags from `router/models.json`.

Rules:
- an explicit model selection wins;
- Auto mode derives capability tags from mode and use case;
- candidates are scored by matched capability tags;
- ties are shown as alternatives rather than false precision;
- caveats and evidence labels are surfaced;
- no global "best model" claim.

### 3. Before / After

Use canonical tasks from `dataset/cases.json`.

For each example show:
- weak prompt: an intentionally underspecified version;
- compiler reasoning: missing IR fields / failure risks;
- improved prompt: a deterministic reconstruction aligned with the case requirements.

The purpose is to make the value proposition visible: the improvement is causal structure and controllability, not more adjectives.

### 4. Failure Playground

Add `dataset/failures.json` as the canonical structured failure taxonomy.

Each failure record contains:
- `id`;
- `symptom`;
- `root_cause`;
- `fix`;
- `change_only`;
- `risk_tags`.

The UI lets a visitor select a symptom and immediately see what layer to change and what *not* to rewrite.

`docs/failure-diagnosis.md` will point to the structured source instead of becoming a divergent second taxonomy.

### 5. README conversion surface

Top-of-page additions:
- stronger one-line positioning;
- CI badge;
- skills.sh install badge;
- `npx skills add jupiterx0910/video-prompt-lab` one-command install;
- Demo section with a compact screenshot-like SVG / diagram checked into `docs/assets/`;
- explicit "Try the interactive demo locally" command;
- Before/After snippet;
- architecture diagram showing Idea → IR → Router → Compiler → Preflight → Diagnosis.

The README must avoid vanity metrics that the repository cannot substantiate.

### 6. Demo visual design

The visual style should feel like a technical instrument, not a generic AI landing page:
- dark graphite / light neutral surfaces using system colors;
- high information density but clear hierarchy;
- monospace for IR / prompt blocks, sans-serif for controls;
- one accent color only;
- cards with subtle borders, no glassmorphism dependency;
- desktop-first but fully usable on narrow screens;
- no external fonts, icon kits or CDNs.

## Data flow

1. On load, `app.js` fetches `../router/models.json`, `../dataset/cases.json`, and `../dataset/failures.json`.
2. If loading fails, the UI shows a clear instruction to serve the repository over HTTP instead of opening `file://` directly.
3. Form changes update a plain JS state object.
4. The state is normalized into Video IR.
5. Capability tags are inferred.
6. Router candidates are scored.
7. Prompt text and preflight warnings are generated.
8. No data leaves the browser.

## Error handling

- Missing canonical JSON: visible load error, no fake fallback data.
- Empty subject/action: preflight warning and incomplete prompt marker.
- Explicit model with mismatched capabilities: preserve the user's choice and show a caution.
- Unsupported arbitrary model string: do not invent a profile; use platform-neutral compilation.
- Local `file://` access: explain the one-command local server.

## Testing and regression gates

Extend deterministic CI to validate:
- `dataset/failures.json` schema and unique IDs;
- every failure `risk_tag` is a non-empty string;
- demo files exist and exceed minimum useful size;
- `demo/app.js` references canonical JSON paths;
- demo references all five router model IDs;
- README contains the verified one-command skill install and demo launch command;
- no external JS/CSS/font CDN is introduced;
- existing V2.1 evals remain green.

No browser automation is required for V2.2; the demo has no framework-specific runtime and all core routing logic remains small and deterministic.

## Installation

Use the official Skills CLI form:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

Also show agent-specific examples only when they improve onboarding; avoid maintaining a large matrix in this repo because the Skills CLI itself owns agent compatibility.

## Scope boundaries

V2.2 does not:
- call commercial video APIs;
- render videos;
- claim empirical model rankings;
- add authentication, analytics or a backend;
- add npm dependencies;
- duplicate rapidly changing model limits into the demo.

## Definition of done

V2.2 is complete when:
- the static demo consumes all three canonical data sources;
- Builder, Router, Before/After and Failure Playground are usable;
- README leads with the compiler + demo + one-command install;
- CI validates both V2.1 and V2.2 invariants;
- the PR merge ref is green.

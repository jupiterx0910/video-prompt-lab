# Video Prompt Lab v2.2.0 — Prompt Compiler + Interactive Demo

Video Prompt Lab v2.2.0 turns the repository from a prompt reference library into an engineering-oriented **AI video prompt compiler**.

The central idea is simple:

> Treat AI video prompts as compiled production specifications, not adjective collections.

## What ships in v2.2.0

### Video IR

Ideas are normalized into a small intermediate representation before prose is generated:

- subject and persistent state;
- environment and props;
- trigger → action → visible consequence;
- camera and endpoint;
- physical/material behavior;
- sound attribution;
- continuity locks;
- shot-specific constraints.

### Capability-based model router

`router/models.json` maps task requirements to model-family capability profiles instead of maintaining a permanent “best model” leaderboard.

The current repository profiles cover Seedance, Veo, Sora, Kling and Runway families. Fast-changing availability, pricing, duration, resolution and product-surface limits are intentionally not hard-coded as timeless facts.

### Canonical datasets

- `dataset/cases.json` — seven canonical task shapes spanning product, cinematic action, social/UGC, documentary, image-to-video, dialogue/audio and multi-shot continuity.
- `dataset/failures.json` — machine-readable failure taxonomy for identity drift, object resets, motion causality, camera conflict, synthetic render look, time-static clips, speaker/audio swaps and I2V overmotion.

### Interactive Prompt Builder

The zero-dependency static demo under `demo/` exposes the compiler chain directly:

- structured Prompt Builder;
- Video IR preview;
- explainable model routing;
- compiled prompt output;
- preflight warnings;
- Before / After comparison;
- Failure Playground.

The demo runs locally in the browser and does not require a commercial video API.

### Deterministic evals + CI

The repository now protects structural behavior with zero-cost regression gates:

```bash
python scripts/validate_repo.py
python evals/run_evals.py
node --test demo/compiler.test.mjs
node --check demo/app.js
```

These checks validate schemas, routing fixtures, Skill invariants and deterministic compiler behavior. They are **not** claims about stochastic rendered-video quality.

### Agent Skill install

```bash
npx skills add jupiterx0910/video-prompt-lab
```

The Skill workflow follows:

```text
Resolve Task
→ Build Video IR
→ Infer Capabilities
→ Route / Honor Target Model
→ Compile Prompt
→ Preflight
→ Output
→ Diagnose & Iterate
```

## Why this release matters

Most prompt collections optimize surface wording. Video generation failures often happen one level deeper: unstable identity, undefined object state, missing causality, conflicting camera instructions, weak time progression, or ambiguous sound ownership.

v2.2.0 makes those control layers explicit so a failed generation can be diagnosed and repaired with a **small controlled change** instead of a full prompt rewrite.

## Limits

- No prompt can guarantee a successful stochastic render.
- Router profiles are task-oriented heuristics and documented capability knowledge, not a global ranking.
- Model features and availability change; verify the selected current model surface at generation time.
- No benchmark, success-rate or quality score is claimed without actual rendered evidence.

## Install / try

Install the Agent Skill:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

Clone and run the static demo:

```bash
git clone https://github.com/jupiterx0910/video-prompt-lab.git
cd video-prompt-lab
python -m http.server 8000
# open http://localhost:8000/demo/
```

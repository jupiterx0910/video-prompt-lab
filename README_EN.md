# Video Prompt Lab — AI Video Prompt Compiler

> **Compile an idea into a controllable, diagnosable production specification instead of stacking cinematic adjectives.**

[![CI](https://img.shields.io/github/actions/workflow/status/jupiterx0910/video-prompt-lab/validate.yml?branch=main&label=validation)](.github/workflows/validate.yml)
[![skills.sh](https://skills.sh/b/jupiterx0910/video-prompt-lab)](https://skills.sh/jupiterx0910/video-prompt-lab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Router](https://img.shields.io/badge/Router-Seedance%20·%20Veo%20·%20Sora%20·%20Kling%20·%20Runway-7657ff)](router/models.json)
[![中文](https://img.shields.io/badge/README-中文-blue)](README.md)

Video Prompt Lab is an open prompt compiler for **text-to-video, image-to-video, and agent workflows**. It normalizes creative intent into a **Video IR**, infers capability requirements, explains model routing, compiles a model-aware prompt, runs preflight, and diagnoses the failed layer before you rewrite anything.

```bash
npx skills add jupiterx0910/video-prompt-lab
```

**Start here:** [Try the interactive demo](demo/index.html) · [Install the Agent Skill](SKILL.md) · [Read the compiler architecture](docs/prompt-compiler-v2.md)

![Video Prompt Lab compiler demo](docs/assets/compiler-demo.svg)

## Understand it in 30 seconds

```text
Idea
 ↓
Video IR: subject / world state / causality / camera / time / physics / audio / continuity
 ↓
Capabilities: I2V? dialogue audio? multi-shot? complex motion? product continuity?
 ↓
Model Router: capability match, not a permanent leaderboard
 ↓
Model-aware prompt compiler
 ↓
Preflight: conflicts, continuity, physics, audio, capability gaps
 ↓
Generate → diagnose → change 1–2 variables → iterate
```

Most prompt collections answer **“what words should I use?”** Video Prompt Lab asks **“what must happen over time, what must remain stable, and which layer should I repair when the render fails?”**

| Typical prompt collection | Video Prompt Lab |
|---|---|
| Starts with descriptive prose | Starts with Video IR |
| Uses permanent model rankings | Matches capabilities and explains the route |
| Expresses emotion with adjectives | Converts emotion into observable behavior, composition, light, and sound |
| Describes action as an outcome | Uses `trigger → action/response → visible consequence` |
| Stacks camera vocabulary | Uses one dominant camera movement and a clear endpoint |
| Rewrites everything after failure | Diagnoses identity, object state, motion, camera, time, physics, audio, or model fit first |
| Improves by intuition only | Uses deterministic evals and GitHub Actions regression gates |

This does **not** guarantee a good render. Video generation remains stochastic. The engineering value is knowing what you controlled, what failed, and what to change next.

## V2.2: experience the compiler directly

V2.2 adds a **zero-dependency static demo**. It is not a chatbot wrapper and it does not call a commercial video API. Everything runs locally in the browser and reads canonical repository data:

- `router/models.json` — capability profiles, evidence labels, cautions;
- `dataset/cases.json` — canonical task shapes;
- `dataset/failures.json` — structured failure taxonomy;
- `demo/compiler.mjs` — deterministic, tested compiler logic.

From the repository root:

```bash
git clone https://github.com/jupiterx0910/video-prompt-lab.git
cd video-prompt-lab
python -m http.server 8000
# open http://localhost:8000/demo/
```

Demo entry point: [demo/index.html](demo/index.html)

The interface exposes four things at once:

1. **Prompt Builder** — subject, world state, trigger, action, consequence, camera, light, sound, continuity;
2. **Model Router** — capability matching plus evidence and cautions;
3. **Before / After** — the same brief as weak prose versus a controllable production specification;
4. **Failure Playground** — visible symptom → root cause → minimal repair → “change only” guidance.

## Before / After: the difference is not prompt length

**Before**

```text
Make a premium cinematic running-shoe ad on a wet surface with dramatic water splashes and a cool camera move, 8K.
```

The problem is not brevity. It lacks state, causality, a camera endpoint, and continuity.

**After**

```text
8 seconds, 16:9, product shot.
Subject: the same charcoal running shoe; white logo position, sole geometry, laces, color, and material remain unchanged.
Environment: wet black stone after rain with a shallow water film.
Action causality: the shoe drops into frame → lands heel-first and compresses slightly → water pushes outward → droplets settle and the shoe stops in a clean three-quarter hero angle.
Camera: low close three-quarter shot, restrained 50mm feel, one short push-in ending locked on the logo.
Light: large soft source from camera-left; wet reflections stay controlled.
Sound: rubber impact, water displacement, droplets on stone, quiet exterior ambience, synchronized to visible events.
Continuity: logo, sole, color, material, and final orientation never change.
Avoid: logo drift, sole deformation, floating water, duplicate shoe, unmotivated slow motion, camera orbit.
```

The added value is **testable constraints**, not prestige vocabulary.

## Core compiler

See [docs/prompt-compiler-v2.md](docs/prompt-compiler-v2.md).

A compact Video IR can include:

```yaml
intent: purpose and viewer effect
state:
  subject: persistent identity
  environment: spatial state
  props: object state
  continuity_locks: facts that must not drift
motion:
  trigger: why change starts
  action: what happens
  consequence: visible end state
camera:
  framing: shot size and angle
  movement: one dominant move
  endpoint: final composition
physics:
  light: source and change
  material: physical response
  sound: source and synchronization
constraints:
  avoid: shot-specific failures
```

The same director intent can then be compiled into different model dialects without rebuilding the concept from scratch.

## Explainable Model Router

[router/models.json](router/models.json) is deliberately **not** a permanent leaderboard.

Routing logic:

1. an explicitly requested model takes precedence;
2. otherwise infer task capabilities;
3. match them against model-family `strengths`, `cautions`, and `prompt_emphasis`;
4. show a small candidate set and the reason for the match;
5. verify current official availability/specifications before making volatile version-specific claims.

The family-level profiles cover Seedance, Veo, Sora, Kling, and Runway. Exact product limits change quickly, so volatile pricing, duration, resolution, quota, and UI details stay out of core routing logic.

## Failure Playground: diagnose first

Human-readable guide: [docs/failure-diagnosis.md](docs/failure-diagnosis.md)  
Machine-readable taxonomy: [dataset/failures.json](dataset/failures.json)

| Symptom | Likely root cause | First repair |
|---|---|---|
| Face / wardrobe / logo changes | identity/state | reduce ornamental detail; strengthen a few persistent anchors |
| Prop resets or changes shape | object state | define before → event → after and lock the after-state |
| Motion floats | causality | add trigger, response/force, and visible consequence |
| Camera behaves chaotically | camera conflict | keep one dominant move, speed, and endpoint |
| Shot looks like generic CG | capture / physics | replace style adjectives with capture origin, materials, light, exposure, and restrained imperfections |
| Clip barely changes | time spine | add 2–4 beats that change action, information, framing, or sound |
| Dialogue swaps speakers | audio attribution | shorten lines and bind every line/sound to a clear source |
| I2V face deforms under motion | overmotion | prioritize one subject motion and one subtle secondary motion |

The core iteration discipline is simple: **change only one or two variables per round.**

## Canonical dataset

[dataset/cases.json](dataset/cases.json) is a compact benchmark-oriented set of task shapes, not a scraped prompt dump. It covers product video, cinematic action, UGC/social, documentary realism, image-to-video, dialogue/audio, and multi-shot continuity.

Cases record required IR fields, risk tags, and capability requirements. **No real generation evidence means no fabricated render score.**

## Evals + CI: prove the project was not silently degraded

No paid API key is required for the structural regression gates:

```bash
python scripts/validate_repo.py
python evals/run_evals.py
node --test demo/compiler.test.mjs
node --check demo/app.js
```

GitHub Actions checks:

- Router schema, IDs, evidence labels, and capability references;
- canonical task and failure taxonomy structure;
- route fixtures and core Skill invariants;
- explicit-model precedence, compiler output, and preflight behavior;
- that the demo reads canonical JSON rather than embedding a hidden fallback dataset;
- browser JS syntax;
- that README onboarding still exposes install and demo paths.

A green structural eval is **not** a video-quality benchmark. See [evals/scoring.md](evals/scoring.md).

## Agent Skill — one command

The root [SKILL.md](SKILL.md) is the Agent Skill entry point:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

The Skill follows:

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

Default output remains practical and copy-ready: creative judgment, optional model recommendation, main prompt, continuity lock, targeted constraints, and iteration knobs.

## Navigation

- [Interactive demo](demo/index.html)
- [Prompt compiler architecture](docs/prompt-compiler-v2.md)
- [Agent Skill](SKILL.md)
- [Model router](router/models.json)
- [Canonical task dataset](dataset/cases.json)
- [Failure dataset](dataset/failures.json)
- [Prompt engineering foundations](docs/prompt-engineering.md)
- [Model adaptation](docs/model-adaptation.md)
- [Text-to-video template](templates/text-to-video.md)
- [Image-to-video template](templates/image-to-video.md)
- [Multi-shot template](templates/multi-shot-story.md)
- [Social/UGC template](templates/social-video.md)
- [Product-film template](templates/product-film.md)
- [Camera language](references/camera-language.md)
- [Motion and continuity](references/motion-continuity.md)
- [Lighting and color](references/lighting-color.md)
- [Sound design](references/sound-design.md)
- [Failure diagnosis](docs/failure-diagnosis.md)
- [Eval system](evals/README.md)

## Principles

- Do not turn one successful prompt into a universal rule.
- Do not use camera-brand vocabulary as a substitute for cinematography.
- Do not use `8K`, `masterpiece`, or `best quality` as substitutes for physical description.
- Do not hard-code fast-changing price, duration, resolution, quota, or UI details in core routing logic.
- Do not fabricate benchmark scores, star counts, success rates, or model grades.
- Design fully first; compress for the target model second.
- Do not let the demo become a second source of truth; router, task dataset, and failure taxonomy stay canonical.

The project was initially inspired by the “design believable source footage” idea in [zhouwei713/seedance-prompt](https://github.com/zhouwei713/seedance-prompt). The current compiler architecture, routing system, datasets, evals, demo, Skill workflow, and documentation are independently designed and written.

## License

[MIT](LICENSE)

# Video Prompt Lab

> **Treat AI video prompts as compiled production specifications, not adjective collections.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-18a957)](https://agentskills.io)
[![CI](https://img.shields.io/github/actions/workflow/status/jupiterx0910/video-prompt-lab/validate.yml?branch=main&label=validation)](.github/workflows/validate.yml)
[![中文](https://img.shields.io/badge/README-中文-blue)](README.md)

Video Prompt Lab is an engineering-oriented toolkit for text-to-video, image-to-video, and agent workflows. Instead of jumping directly from an idea to prose, it normalizes creative intent into a compact **Video IR**, infers production capabilities, routes to an appropriate model family when needed, compiles a model-aware prompt, runs a preflight check, and diagnoses failures before rewriting.

```text
Idea
 ↓
Video IR: state + causality + camera + time + physics + audio + continuity
 ↓
Capability requirements
 ↓
Explainable model router
 ↓
Model-aware prompt compiler
 ↓
Preflight
 ↓
Generate → diagnose → change 1–2 variables → iterate
```

## Why this is different

Most prompt collections answer “what words should I use?” Video Prompt Lab asks “what must happen over time, what must remain stable, and why should the camera/model interpret it that way?”

| Typical prompt collection | Video Prompt Lab |
|---|---|
| Starts with descriptive prose | Starts with Video IR |
| Uses permanent model rankings | Matches task capabilities and explains the match |
| Expresses emotion with adjectives | Converts emotion into observable behavior, composition, light and sound |
| Describes an action as an outcome | Uses `trigger → action/response → visible consequence` |
| Stacks camera vocabulary | Uses one dominant camera movement per shot |
| Rewrites everything after failure | Diagnoses identity, motion, camera, time, physics, audio or model fit first |
| Improves by intuition only | Adds deterministic evals and GitHub Actions regression gates |

This does not guarantee a good render. Video generation remains stochastic. The goal is to make iteration legible and controllable.

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
2. otherwise infer the capabilities the task requires;
3. match those requirements against model-family strengths and cautions;
4. return a small candidate set with reasons;
5. verify current official availability/specifications before making volatile version-specific claims.

The current family-level profiles cover Seedance, Veo, Sora, Kling and Runway. Model availability and exact feature limits change quickly, so the router keeps volatile product specifications out of core logic.

## Diagnosis-first iteration

See [docs/failure-diagnosis.md](docs/failure-diagnosis.md).

When a generation fails, first classify the layer:

- identity/state drift;
- motion/causality failure;
- camera conflict;
- weak time progression;
- physical/look mismatch;
- audio/speaker synchronization problem;
- model-fit problem.

Then change only one or two variables while preserving constraints that already worked.

## Canonical dataset

[dataset/cases.json](dataset/cases.json) contains a small benchmark-oriented set of task shapes rather than a large scraped prompt dump. The initial corpus covers:

- product video;
- cinematic action;
- social/UGC;
- documentary realism;
- image-to-video;
- dialogue and synchronized audio;
- multi-shot continuity.

It records required IR fields, risk tags, and capability requirements. It does not fabricate render scores.

## Deterministic evals and CI

Run:

```bash
python scripts/validate_repo.py
python evals/run_evals.py
```

The zero-dependency gate validates model profiles, dataset coverage, capability references, route fixtures, prompt fixtures, local links, JSON syntax, and core Skill invariants.

A passing structural eval is **not** a video-quality benchmark. See [evals/scoring.md](evals/scoring.md) for the distinction between deterministic gates, future semantic judges, and render evaluation.

## Agent Skill

The root [SKILL.md](SKILL.md) follows this flow:

```text
Resolve Task
→ Build Video IR
→ Infer Capabilities
→ Route/Honor Target Model
→ Compile Prompt
→ Preflight
→ Output
→ Diagnose & Iterate
```

Default output remains practical and copy-ready: creative judgment, optional model recommendation, main prompt, continuity lock, targeted constraints, and iteration knobs.

Install:

```bash
git clone https://github.com/jupiterx0910/video-prompt-lab.git
```

Then place the repository or `SKILL.md` in the skill directory used by your agent environment.

## Navigation

- [Prompt compiler architecture](docs/prompt-compiler-v2.md)
- [Prompt engineering foundations](docs/prompt-engineering.md)
- [Model adaptation](docs/model-adaptation.md)
- [Model router](router/models.json)
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
- [Canonical dataset](dataset/cases.json)
- [Eval system](evals/README.md)

## Principles

- Do not turn a one-off successful prompt into a universal rule.
- Do not use camera-brand vocabulary as a substitute for cinematography.
- Do not use `8K`, `masterpiece`, or `best quality` as substitutes for physical description.
- Do not hard-code fast-changing price, duration, resolution, quota, or UI details in core routing logic.
- Do not fabricate benchmark scores.
- Design fully first; compress for the target model second.

The project was initially inspired by the “design believable source footage” idea in [zhouwei713/seedance-prompt](https://github.com/zhouwei713/seedance-prompt). The current compiler architecture, routing system, dataset, evals, Skill workflow, and documentation are independently designed and written.

## License

[MIT](LICENSE)

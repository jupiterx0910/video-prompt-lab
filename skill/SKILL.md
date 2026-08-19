---
name: video-prompt-compiler
description: Compile video ideas into model-aware, controllable production prompts using Video IR, model routing, preflight checks, and failure diagnosis.
version: 2.4.0
---

# Video Prompt Compiler

Turn an underspecified video idea into a production-ready video specification and model-aware prompt.

## Workflow

1. Parse the user's intent and constraints.
2. Build a compact Video IR: subject, world state, action causality, camera, time, physics, audio, continuity, and constraints.
3. Infer required capabilities and route to a suitable video model unless the user explicitly specifies one.
4. Compile the Video IR into a model-aware prompt.
5. Run preflight checks before returning the prompt.
6. If a render fails, diagnose the failure category and make the smallest useful change.

## Output contract

Return, when relevant:
- selected model and why it fits;
- Video IR summary;
- final prompt;
- negative constraints only where they address plausible failure modes;
- preflight findings;
- iteration delta when refining a failed render.

## Progressive disclosure

Read only the reference needed for the task:
- `references/video-ir.md` for IR construction.
- `references/model-router.md` for model selection.
- `references/failure-diagnosis.md` for render debugging.
- `references/prompt-patterns.md` for reusable construction patterns.

Canonical examples live in `examples/`.

## Guardrails

- Do not invent measured model benchmarks.
- Do not treat style adjectives as a substitute for physical or temporal specification.
- Prefer one dominant camera motion and explicit action causality.
- Preserve continuity-critical state across shots.
- When the user names a model, respect that model and optimize for it rather than silently rerouting.

# Prompt Quality Evals

Video Prompt Lab uses deterministic regression gates to prevent the repository from drifting back into an unstructured prompt collection.

## Run locally

```bash
python scripts/validate_repo.py
python evals/run_evals.py
node --test demo/compiler.test.mjs
node --check demo/app.js
```

No paid API key or third-party runtime package is required for these gates.

## What is checked

- `router/models.json` has valid, unique model-family profiles, evidence labels, cautions, and capability references.
- `dataset/cases.json` covers the canonical task set and references known capability / IR tags.
- `dataset/failures.json` provides a structured failure taxonomy with unique IDs and actionable repair guidance.
- routing fixtures have at least one expected model candidate that satisfies their required capabilities.
- prompt fixtures preserve causal action, camera / continuity language and targeted constraints while avoiding empty quality-word patterns.
- `SKILL.md` preserves the compiler invariants: Video IR, model routing, explicit-model precedence, preflight, and diagnosis-first iteration.
- README onboarding preserves the interactive demo, local launch command, one-command Skill install, and demo visual.
- `demo/compiler.test.mjs` verifies capability inference, explicit-model precedence, auto routing, prompt compilation, preflight, and Before / After behavior.
- `demo/app.js` passes a browser-JavaScript syntax check and references the canonical JSON sources instead of embedding a hidden fallback dataset.

## What it does not check

A green run does **not** prove that a stochastic video model will obey the prompt or that one model is globally better than another. Structural tests protect engineering invariants; actual render quality still requires model-specific generation and evaluation.

See [scoring.md](scoring.md) for the three-tier evaluation model.

## Add a regression case

Use `evals/cases.json`:

- `type: route` tests capability-to-model configuration;
- `type: prompt` tests a canonical compiled prompt fixture for required and forbidden concepts.

Add a canonical task to `dataset/cases.json` only when it introduces a distinct production requirement or failure surface. Add a failure to `dataset/failures.json` only when its visible symptom and minimal repair are meaningfully distinct from existing records.

Keep the suite small and diagnostic. Add a test when it protects a real invariant, not just to increase the case count.

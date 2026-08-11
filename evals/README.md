# Prompt Quality Evals

The eval system prevents **structural regressions** without pretending that static checks can judge final video quality.

## Run

```bash
python evals/run_evals.py
```

No API key and no third-party package are required.

## What it checks

- `router/models.json` has valid, unique model-family profiles and preserves explicit model choice.
- `dataset/cases.json` covers the canonical task set and references known capability/IR tags.
- routing fixtures have at least one expected model candidate that satisfies their required capabilities.
- prompt fixtures preserve causal action, camera/continuity language and targeted constraints while avoiding empty quality-word patterns.
- `SKILL.md` preserves the V2.1 compiler invariants: Video IR, model routing, explicit-model precedence, preflight and diagnosis-first iteration.

## What it does not check

A passing run does not prove that a video model will obey a prompt. Render quality is stochastic, model/version dependent and cannot be honestly reduced to these static checks.

See [scoring.md](scoring.md) for the three-tier evaluation model.

## Add a regression case

Use `evals/cases.json`:

- `type: route` tests capability-to-model configuration;
- `type: prompt` tests a canonical compiled prompt fixture for required and forbidden concepts.

Keep the suite small and diagnostic. Add a case when it protects a real invariant or failure mode, not just to increase the case count.

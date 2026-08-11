# Evaluation Model

Video Prompt Lab separates **deterministic structural gates** from **subjective render evaluation**.

## Tier 1 — deterministic CI gate

`python evals/run_evals.py` checks things that can be verified without generating a video:

- model router schema and unique IDs;
- capability tags referenced by the canonical dataset;
- minimum task coverage;
- route fixtures whose expected candidates actually satisfy required capabilities;
- reference prompt fixtures for required/forbidden concepts;
- required compiler invariants in `SKILL.md`.

Tier 1 is a regression detector. Passing it does **not** mean a prompt will produce a good video.

## Tier 2 — future semantic judge

An optional LLM judge may score the compiled prompt on:

1. intent clarity;
2. subject/state lock;
3. action causality;
4. camera coherence;
5. time structure;
6. physical specificity;
7. audio synchronization design;
8. model fit;
9. targeted constraints;
10. iteration usefulness.

Any LLM judge must publish its rubric, model/version, cases and threshold. A score without those details is not a benchmark.

## Tier 3 — render evaluation

The strongest evidence is generated video assessed against the original request. Future render evals should record model/version, generation settings, seed when available, prompt, output, date, and evaluator rubric.

Do not mix Tier 1 structural pass/fail results with Tier 2 or Tier 3 quality scores.

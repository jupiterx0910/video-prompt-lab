# Video Prompt Lab v2.1 — Compiler, Router, Dataset & Eval Design

Date: 2026-08-11
Branch: `agent/v2-compiler-evals`
Status: approved

## 1. Goal

Upgrade Video Prompt Lab from a prompt knowledge base into an engineering-oriented prompt compiler that can:

1. normalize a creative request into a stable intermediate representation (Video IR);
2. route by task requirements instead of blindly preferring one model;
3. compile the same director intent into model-aware prompt variants;
4. diagnose failures by layer and recommend minimal repairs;
5. validate repository structure and prompt fixtures without paid APIs;
6. provide a small structured dataset that can grow into a benchmark corpus.

The project should remain lightweight and readable. It should not become a giant unverified prompt dump.

## 2. Design principle

The core abstraction is:

```text
Idea → Video IR → Task profile → Model route → Model-aware prompt → Evaluation → Repair
```

`Video IR` is the source of truth. Model-specific prompts are compiled views of that intent.

This separates three concerns that are often mixed together:

- **creative intent** — what the video must communicate;
- **production specification** — state, action, camera, time, sound, continuity;
- **model dialect** — how much and what form of information a target model should receive.

## 3. Model Router

Create `router/models.json` as a human-readable, machine-readable routing table.

Each model profile contains:

- stable model family name, not brittle SKU claims;
- strengths such as `dialogue_audio`, `image_to_video`, `cinematic_narrative`, `product`, `social`, `continuity`;
- cautions;
- preferred prompt emphasis;
- evidence status (`heuristic`, `official-doc-informed`, or `field-tested`).

Routing must be explainable. The skill should recommend a model because of the request requirements, not because of a static global ranking.

If the user explicitly names a model, honor it and only warn when the request conflicts with that model profile.

## 4. Structured dataset

Create `dataset/cases.json` with a deliberately small set of canonical fixtures. Each record contains:

```json
{
  "id": "product-rain-shoe",
  "task": "product",
  "mode": "text-to-video",
  "input": "...",
  "required_ir": ["subject", "action", "camera", "continuity"],
  "risk_tags": ["logo_drift", "object_state"],
  "preferred_capabilities": ["product", "continuity"]
}
```

The initial corpus should cover product, cinematic action, social/UGC, documentary realism, image-to-video, dialogue/audio, and multi-shot continuity.

Do not store fabricated render scores. Scores belong only to observed or reproducible evaluations.

## 5. Deterministic evals

V2.1 uses zero-dependency deterministic checks. It does not pretend static text rules can judge final video quality.

Create:

- `evals/cases.json` — prompt fixtures used by structural checks;
- `evals/run_evals.py` — validates model profiles, dataset schema, fixture coverage, required Skill concepts, and obvious prompt anti-patterns;
- `evals/scoring.md` — distinguishes deterministic structural gates from optional future LLM/video judges.

The deterministic gate fails on malformed data, missing required coverage, contradictory configuration, broken required concepts, and obvious regression signals.

A future optional evaluator may use an LLM or generated video, but V2.1 CI must require no API key.

## 6. Skill behavior

Update `SKILL.md` so the workflow becomes:

1. resolve task and generation mode;
2. build a compact Video IR;
3. infer required capabilities;
4. route or honor the requested model;
5. compile a model-aware prompt;
6. run a preflight self-check;
7. output targeted iteration knobs;
8. when the user reports a bad generation, diagnose before rewriting.

Default output stays copy-ready and concise. The IR is shown only when useful or requested; it should guide reasoning even when hidden from the user-facing output.

## 7. CI and repository validation

Add `.github/workflows/validate.yml` running on pushes and pull requests that affect Skill, router, dataset, eval, template, reference, docs, or validation files.

CI runs:

```bash
python scripts/validate_repo.py
python evals/run_evals.py
```

Extend `scripts/validate_repo.py` so the new architecture files are required and JSON files parse successfully.

## 8. README positioning

Update README around one defensible differentiator:

> Video Prompt Lab treats prompts as compiled production specifications, not adjective collections.

README should show the compiler pipeline, routing idea, deterministic eval command, and correct clone URL.

Do not use inflated claims such as “best”, “SOTA”, “guaranteed”, or unverified model rankings.

## 9. Non-goals

V2.1 will not:

- call commercial video APIs;
- claim automatic router recommendations are objective rankings;
- add hundreds of scraped prompts;
- require PyYAML or other dependencies;
- fabricate benchmark scores;
- maintain exact rapidly changing model limits in core logic.

## 10. Acceptance criteria

V2.1 is complete when:

- model profiles are machine-readable and explainable;
- the dataset contains at least seven task-diverse canonical cases;
- deterministic evals run with Python standard library only;
- repository validation checks the new architecture;
- SKILL.md routes through IR → capability → model → compiler → preflight;
- README explains the architecture and uses the correct repository clone URL;
- CI invokes both validation commands;
- all deterministic checks pass locally on a reconstructed working tree.

# Video Prompt Lab v2.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an explainable Video IR → capability → model routing → prompt compilation workflow with a small benchmark dataset, deterministic regression gates, CI, and updated Skill/README documentation.

**Architecture:** Keep `SKILL.md` as the agent dispatcher and use standard-library JSON files as machine-readable configuration/fixtures. Deterministic Python checks validate schema and invariant coverage; they do not claim to evaluate final rendered video quality.

**Tech Stack:** Markdown, JSON, Python 3 standard library, GitHub Actions.

## Global Constraints

- Zero runtime dependencies for validation/evals.
- No fabricated render scores or unverified global model ranking.
- Core routing uses model families and capabilities, not volatile exact SKU limits.
- User-selected target model takes precedence over automatic routing.
- Keep outputs copy-ready; expose Video IR only when useful or requested.

---

### Task 1: Model routing profiles

**Files:**
- Create: `router/models.json`
- Create: `router/README.md`

**Interfaces:**
- Produces: a JSON object with `schema_version` and `models[]`; every model has `id`, `family`, `strengths`, `cautions`, `prompt_emphasis`, `evidence`.

- [ ] Define five model-family profiles: Seedance, Veo, Sora, Kling, Runway.
- [ ] Ensure capabilities use reusable tags such as `dialogue_audio`, `image_to_video`, `cinematic_narrative`, `product`, `social`, `continuity`.
- [ ] Document explainable routing and explicit-model precedence.
- [ ] Validate JSON with `python -m json.tool router/models.json`.

### Task 2: Canonical dataset

**Files:**
- Create: `dataset/cases.json`
- Create: `dataset/README.md`

**Interfaces:**
- Produces: `cases[]`, each with `id`, `task`, `mode`, `input`, `required_ir`, `risk_tags`, `preferred_capabilities`.

- [ ] Add at least seven task-diverse cases covering product, cinematic action, social/UGC, documentary, I2V, dialogue/audio, and multi-shot continuity.
- [ ] Do not include subjective scores unless sourced from an actual evaluation.
- [ ] Validate JSON with `python -m json.tool dataset/cases.json`.

### Task 3: Deterministic eval gate

**Files:**
- Create: `evals/cases.json`
- Create: `evals/run_evals.py`
- Create: `evals/scoring.md`
- Modify: `evals/README.md`

**Interfaces:**
- `run_evals.py` exits 0 on pass and 1 on any regression.
- It validates router schema, dataset schema/coverage, eval fixtures, SKILL concepts, and obvious anti-patterns.

- [ ] Define prompt fixtures with expected required/forbidden concepts.
- [ ] Implement standard-library JSON loading and accumulated error reporting.
- [ ] Check router uniqueness and required fields.
- [ ] Check dataset IDs, task coverage, modes, required IR fields, and capability tags.
- [ ] Check `SKILL.md` contains IR/routing/preflight/diagnosis invariants.
- [ ] Check fixtures include causal action, continuity, camera, targeted negatives, and avoid generic-only quality-word regressions.
- [ ] Run `python evals/run_evals.py` and require PASS.

### Task 4: Repository validator and CI

**Files:**
- Modify: `scripts/validate_repo.py`
- Create: `.github/workflows/validate.yml`

**Interfaces:**
- `scripts/validate_repo.py` still validates required files and local Markdown links; additionally parses required JSON files.
- CI runs both validator and deterministic evals.

- [ ] Add router/dataset/eval/spec/plan files to required file list where appropriate.
- [ ] Parse every JSON under `router/`, `dataset/`, and `evals/` and report malformed JSON.
- [ ] Add a Python 3.11 GitHub Actions workflow for push/PR/manual dispatch.
- [ ] Run both validation commands locally on the reconstructed tree.

### Task 5: Integrate compiler behavior into SKILL

**Files:**
- Modify: `SKILL.md`

**Interfaces:**
- Workflow: resolve task → Video IR → capability inference → model route/override → compile → preflight → output → diagnosis/iteration.

- [ ] Add compact Video IR fields without forcing them into every user-facing answer.
- [ ] Add explicit model precedence and router lookup instructions.
- [ ] Add capability inference rules.
- [ ] Add preflight checklist tied to causality, camera conflicts, continuity, physics, audio, duration, negatives.
- [ ] Add failure-diagnosis-first iteration path.
- [ ] Preserve copy-ready output sections.

### Task 6: README and discoverability

**Files:**
- Modify: `README.md`
- Modify: `README_EN.md`

**Interfaces:**
- README exposes compiler pipeline, router, evals, dataset, install, and positioning.

- [ ] Fix clone URL to `jupiterx0910/video-prompt-lab`.
- [ ] Add a concise “why this is different” compiler explanation.
- [ ] Add links to router, dataset, failure diagnosis, evals, and compiler architecture.
- [ ] Add validation commands.
- [ ] Keep claims conservative and verifiable.

### Task 7: Final verification and PR cleanup

**Files:** all changed files.

- [ ] Run `python scripts/validate_repo.py`.
- [ ] Run `python evals/run_evals.py`.
- [ ] Inspect `main...agent/v2-compiler-evals` for accidental changes.
- [ ] Update draft PR title/body with completed scope and verification evidence.
- [ ] Mark PR ready for review only after checks pass.

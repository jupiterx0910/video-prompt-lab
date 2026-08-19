# Agent Skill Package Implementation Plan

> **For agentic workers:** Use the execution workflow to implement this plan task-by-task.

**Goal:** Make Video Prompt Lab installable as a progressive-disclosure Agent Skill while preserving the existing root SKILL.md compatibility entry.

**Architecture:** A small `skill/` package contains the primary instruction file, machine-readable manifest, focused references, and examples. A deterministic validator checks manifest integrity and referenced files; GitHub Actions runs it whenever the package changes.

**Tech Stack:** Markdown, JSON, Python standard library, GitHub Actions.

**Spec:** Approved in chat on 2026-08-19.

## Global Constraints

- Preserve the existing root `SKILL.md` compatibility entry.
- Keep the installable package dependency-free.
- Use progressive disclosure for detailed references.
- Do not claim measured model benchmarks.
- Explicit user-selected models take precedence over routing heuristics.

### Task 1: Skill package core

**Files:**
- Create: `skill/SKILL.md`
- Create: `skill/manifest.json`

- [x] Add the skill entrypoint and machine-readable metadata.
- [x] Declare capabilities, supported model targets, and reference paths.

### Task 2: Progressive references and examples

**Files:**
- Create: `skill/references/video-ir.md`
- Create: `skill/references/model-router.md`
- Create: `skill/references/failure-diagnosis.md`
- Create: `skill/references/prompt-patterns.md`
- Create: `skill/examples/product.md`
- Create: `skill/examples/dialogue.md`
- Create: `skill/examples/i2v.md`

- [x] Keep each reference focused on one concern.
- [x] Add three representative examples.

### Task 3: Deterministic validation and CI

**Files:**
- Create: `scripts/validate_skill.py`
- Create: `.github/workflows/skill-validation.yml`

- [x] Validate manifest version, entrypoint, references, capabilities, and model count.
- [x] Run validation on package changes in GitHub Actions.

### Task 4: Documentation and release integration

**Files:**
- Modify: `README.md`
- Modify: `README_EN.md`

- [ ] Add the installable skill path and progressive-disclosure explanation.
- [ ] Run repository and skill validation.
- [ ] Open a PR and merge only after checks pass.

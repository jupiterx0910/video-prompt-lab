# Canonical Datasets

Video Prompt Lab keeps task shapes and failure diagnosis in machine-readable files so the Skill, evals, and interactive demo can share the same source of truth.

## `cases.json` — canonical task dataset

`cases.json` is a small benchmark-oriented corpus. It is intentionally **not** a dump of viral prompts. Each case exists to exercise a distinct production requirement or failure surface.

| Field | Meaning |
|---|---|
| `id` | Stable case identifier |
| `task` | Production intent such as product, documentary or dialogue |
| `mode` | `text-to-video` or `image-to-video` |
| `input` | Natural user request |
| `required_ir` | Video IR concepts that should survive compilation |
| `risk_tags` | Likely generation failures worth guarding against |
| `preferred_capabilities` | Router capabilities that matter for the request |

## `failures.json` — canonical failure taxonomy

`failures.json` drives the Failure Playground and diagnosis-oriented validation.

| Field | Meaning |
|---|---|
| `id` | Stable failure identifier |
| `symptom` | What the user can observe in the generated video |
| `root_cause` | The prompt/control layer most likely responsible |
| `fix` | Minimal repair to try next |
| `change_only` | Variables to change while preserving everything else |
| `risk_tags` | Failure tags that connect diagnosis to task cases |

Human-readable guidance lives in [`docs/failure-diagnosis.md`](../docs/failure-diagnosis.md), but this JSON file is the canonical machine-readable source.

## Contribution rule

Add a task case only when it introduces a new task shape, risk surface, or regression test. Add a failure mode only when the symptom can be distinguished from existing records and the repair is meaningfully different.

Do not add subjective `score` fields unless they come from a documented evaluation protocol and reproducible outputs.

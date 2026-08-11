# Canonical Task Dataset

`cases.json` is a small benchmark-oriented corpus for Video Prompt Lab.

It is intentionally **not** a dump of viral prompts. Each case exists to exercise a distinct production requirement or failure surface.

## Fields

| Field | Meaning |
|---|---|
| `id` | Stable case identifier |
| `task` | Production intent such as product, documentary or dialogue |
| `mode` | `text-to-video` or `image-to-video` |
| `input` | Natural user request |
| `required_ir` | Video IR concepts that should survive compilation |
| `risk_tags` | Likely generation failures worth guarding against |
| `preferred_capabilities` | Router capabilities that matter for the request |

## Contribution rule

Add a case only when it introduces a new task shape, risk surface, or regression test. Do not add subjective `score` fields unless they come from a documented evaluation protocol and reproducible outputs.

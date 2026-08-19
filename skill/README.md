# Agent Skill Package

This directory is the progressive-disclosure Agent Skill package for Video Prompt Lab.

## Install

From the repository root:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

The repository keeps the root `SKILL.md` as the compatibility entrypoint. The package in this directory provides a focused manifest, references, and examples for agents that support directory-based skills.

## Entry

- `SKILL.md` — core behavior and output contract.
- `manifest.json` — machine-readable metadata.
- `references/` — load-on-demand domain knowledge.
- `examples/` — compact canonical examples.

## Agent behavior

The skill should build Video IR before prose, route by capability when the model is not specified, run preflight before returning a prompt, and diagnose failures before rewriting. Explicit user model choices take precedence.

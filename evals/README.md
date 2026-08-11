# Prompt Quality Evals

## Why

A prompt library should prevent quality regression.

## Evaluation dimensions

Each generated prompt is scored 0-10:

| Dimension | Question |
|---|---|
| Intent clarity | Is the video goal obvious? |
| Subject lock | Can the subject remain consistent? |
| Action causality | Does motion have trigger and result? |
| Camera control | Is the camera physically possible? |
| Time structure | Does something evolve over time? |
| Physics | Do light/material/sound follow reality? |
| Model fit | Is the prompt adapted to the target model? |
| Negative constraints | Are failure modes targeted? |
| Economy | Are useless adjectives removed? |
| Iteration quality | Does it suggest useful next changes? |

## Initial benchmark cases

Recommended cases:

- character consistency across shots
- product commercial
- image-to-video animation
- documentary realism
- cinematic action

Future versions can add LLM judge evaluation and GitHub Actions regression checks.

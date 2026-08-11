# AI Video Failure Diagnosis

## Diagnose before rewriting

Most failed generations are not solved by adding more adjectives. First identify the failed layer, then change the smallest useful set of variables.

The machine-readable source used by the interactive demo and deterministic validation is [`dataset/failures.json`](../dataset/failures.json). This page stays intentionally concise; the JSON file is the canonical taxonomy.

| Symptom | Root cause | Minimal fix |
|---|---|---|
| Face / wardrobe / logo changes | weak identity anchor | reduce ornamental details; restate persistent anchors |
| Motion looks fake | missing physical cause | write trigger → response → visible consequence |
| Camera is chaotic | conflicting camera commands | keep one main movement, speed, and endpoint |
| Scene feels like a game render | generic style words | specify capture origin, materials, light sources, restrained imperfections |
| Objects teleport or reset | missing state transition | define before state → change event → after state and lock it |
| Video feels static | no time progression | add 2–3 beats that change action, framing, sound, or state |
| Dialogue / audio swaps | weak speaker and source attribution | tie each line and sound event to a visible or off-screen source |
| I2V deforms under motion | too many simultaneous changes | prioritize one subject motion and one subtle secondary motion |

## Repair loop

1. Classify the failure.
2. Read the corresponding `change_only` guidance in `dataset/failures.json`.
3. Change only one or two variables.
4. Generate a comparison.
5. Keep successful constraints as reusable knowledge.

The objective is controlled iteration: preserve what already works instead of rewriting the whole prompt after every bad render.

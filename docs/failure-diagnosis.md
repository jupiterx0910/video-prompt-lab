# AI Video Failure Diagnosis

## Diagnose before rewriting

Most failed generations are not solved by adding more adjectives.

| Symptom | Root cause | Fix |
|---|---|---|
| Face changes | weak identity anchor | reduce unnecessary details, strengthen persistent traits |
| Motion looks fake | missing physical cause | add trigger, force, reaction, consequence |
| Camera is chaotic | conflicting camera commands | keep one main movement |
| Scene feels like a game render | generic style words | describe materials, light sources, capture origin |
| Objects teleport | missing state transition | define before/after states |
| Video feels static | no time progression | add event beats |

## Repair loop

1. Identify the failed layer.
2. Change only one or two variables.
3. Compare outputs.
4. Keep successful constraints as reusable knowledge.

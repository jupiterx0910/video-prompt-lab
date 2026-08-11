# Model Router

The router is an **explainable capability matcher**, not a permanent leaderboard.

## Routing order

1. If the user names a model, use it unless the request is impossible or materially conflicts with the selected surface.
2. Otherwise infer required capabilities from the task.
3. Match those capabilities against `models.json`.
4. Prefer the smallest set of models that satisfy the important requirements.
5. Explain the recommendation with the matched capabilities and relevant cautions.
6. Verify current official availability/specs before making a version-specific claim.

## Example

Request:

```text
Create a realistic two-person café scene with short spoken dialogue and synchronized cup sounds.
```

Capability profile:

```text
dialogue_audio + sound_sync + cinematic_narrative
```

The router should favor a family whose current surface supports native audio/dialogue. It should not select a model merely because it is globally popular.

## Evidence levels

- `official-doc-informed`: family-level profile is based on current official documentation, while volatile limits remain outside core logic.
- `field-tested`: backed by repeatable project observations. Add this only with reproducible notes.
- `heuristic`: conservative workflow guidance that must not be presented as an official product guarantee.

## Maintenance rule

Do not encode fast-changing duration, resolution, pricing, quota, or UI details in this file unless the repository also establishes a refresh mechanism. Put volatile facts in model-specific notes or link users to current official documentation instead.

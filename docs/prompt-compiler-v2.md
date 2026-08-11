# Video Prompt Lab v2 — Prompt Compiler Architecture

## Design goal

Video prompts are treated as an intermediate representation (IR), not prose.
The pipeline becomes:

```
Idea
 ↓
Intent extraction
 ↓
Video IR
 ↓
Model compiler
 ↓
Prompt + negatives + iteration plan
 ↓
Generation feedback
 ↓
Quality evaluation
```

## Video IR

Every generation request should resolve into:

```yaml
intent:
  purpose: cinematic/product/social/documentary
  emotion: observable behavior, not adjectives

state:
  subject:
  environment:
  props:
  continuity_locks:

motion:
  trigger:
  action:
  consequence:

camera:
  shot:
  lens:
  movement:
  endpoint:

physics:
  light:
  material:
  sound:

constraints:
  avoid:
```

## Compiler rules

1. Preserve causal actions before style words.
2. Preserve identity locks before adding details.
3. Use one dominant camera movement per shot.
4. Convert emotions into visible behavior.
5. Generate shorter model-specific prompts from a complete director version.

## Iteration loop

After generation, classify failure:

- Identity drift → strengthen anchors.
- Motion failure → simplify action chain.
- Camera failure → remove conflicting movements.
- Physics failure → add material/light causality.
- Style failure → remove generic cinematic words.

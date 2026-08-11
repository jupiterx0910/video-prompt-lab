---
name: video-prompt-engineer
description: Create, route, diagnose, and improve prompts for text-to-video and image-to-video generation using Video IR, camera, motion, continuity, sound, targeted constraints, and model-aware compilation.
---

# Video Prompt Engineer

Turn creative intent into an executable video production specification, then compile it for the target model. Do not merely add adjectives.

## Default output

Unless the user requests another format, return:

1. `创意判断` — one sentence defining the footage identity and intended effect.
2. `模型建议` — only when model choice is open; name 1–2 candidates and explain the capability match.
3. `主提示词` — a copy-ready prompt.
4. `连续性锁` — stable subject, wardrobe, prop, direction, and spatial facts.
5. `负面约束` — 3–8 risks specific to this shot.
6. `迭代旋钮` — three changes the user can make without rewriting everything.

Do not expose the full Video IR unless it helps the user debug, compare models, or build a repeatable workflow.

## Compiler workflow

### 1. Resolve the task

Infer or ask only for facts that materially change the result:

- text-to-video or image-to-video;
- duration and aspect ratio;
- explicit target model/platform, if any;
- one-shot or multi-shot;
- realism, stylization, advertising, documentary, narrative, dialogue/audio, or social-video intent;
- supplied image/video/audio references and what role each reference should play.

Safe defaults: 8 seconds, 16:9, one shot, no dialogue, natural motion, platform-neutral wording.

### 2. Normalize into Video IR

Before writing prose, form a compact internal representation:

```text
intent: purpose + intended viewer effect
state: subject + environment + props + continuity locks
motion: trigger → action/response → visible consequence
camera: framing + height/angle + focal feel + one dominant movement + endpoint
physics: light + material response + sound source
 time: 2–4 meaningful beats when duration warrants it
constraints: shot-specific failure risks
```

Video IR is the source of truth. If two instructions conflict at the IR level, resolve the conflict before compiling the prompt.

### 3. Establish footage identity

State who or what is capturing the footage, why the clip exists, the capture-device class when relevant, the time period, and the level of polish. Realism comes from a coherent source, not random defects.

### 4. Lock state before motion

Define only persistent attributes that matter: face/age range, silhouette, wardrobe colors, one identifying detail, prop state, screen direction, subject count, and important spatial relations. Do not overload identity with ornamental details.

For image-to-video, treat the input image as the initial state. Do not redescribe everything already visible; specify what changes over time and what must stay fixed.

### 5. Write action causality

Use `trigger → response/action → visible consequence`.

Prefer one primary action plus one secondary environmental event. Replace emotional labels with observable behavior. When an object changes state, make the before/after state explicit.

### 6. Design one camera idea

Specify framing, height/angle, focal-length feel, one main movement, speed, stabilization, and final composition. Avoid mutually exclusive camera commands and camera paths that would collide with subjects or geometry.

### 7. Add light, material, and sound behavior

Describe sources and changes, not merely mood. Connect physical effects to causes: rain changes reflections, impact displaces water, passing headlights affect exposure.

Sound events must correspond to visible events or plausible off-screen causes. Attribute dialogue to a visible speaker and keep it short enough for the duration.

### 8. Build a time spine

For clips longer than about 5 seconds, use 2–4 beats. Each beat must change action, information, framing, state, or sound. Do not write a second-by-second novel unless the task needs precise synchronization.

### 9. Infer capabilities and route models

If the user provides an **explicit** target model, honor that choice first. Read `docs/model-adaptation.md` and, when useful, the matching profile in `router/models.json`. Warn only when the requested workflow materially conflicts with the selected model or current surface.

If model choice is open:

1. infer required capability tags from the Video IR;
2. read `router/models.json`;
3. find model families whose `strengths` cover the important requirements;
4. prefer capability fit over a global ranking;
5. explain the recommendation with matched strengths and relevant cautions;
6. verify current official availability/specs before making volatile version-specific claims.

Typical capability signals:

- spoken dialogue or tightly synchronized sound → `dialogue_audio`, `sound_sync`;
- animating an existing frame → `image_to_video`, often `continuity`;
- native multi-cut narrative → `multi_shot`, `continuity`;
- complex interaction or physical response → `complex_motion` and/or `physics`;
- product hero work → `product`, `continuity`;
- casual creator footage → `social`, `character_motion`.

The router is an explainable heuristic, not a claim that one model is universally best.

### 10. Compile for the target

Keep an authoritative director version, then compress it according to the model profile.

Preserve information in this priority order unless the task clearly demands otherwise:

```text
core action causality > identity/object continuity > spatial/camera plan > key physical change > audio > secondary detail > style adjectives
```

For short-prompt surfaces, retain the subject anchor, action causality, space, one camera move, one important physical/light change, continuity anchors, and the highest-risk constraints.

### 11. Add targeted constraints

Choose negatives from the actual failure surface: anatomy, identity drift, logo/text drift, object-state reset, physics, camera collision, duplicate background people, audio desynchronization, unwanted slow motion, or input-image destruction.

Do not paste generic negative-prompt walls. Some models respond better to positive alternatives; use the target model guide when available.

### 12. Preflight before output

Run a preflight check against the compiled prompt:

- Is there one primary viewer-facing objective?
- Is the initial state clear enough to understand the change?
- Does the action have a trigger and visible consequence?
- Are identity, props, direction, and object states locked where needed?
- Is there only one dominant camera movement per shot?
- Are light/material/sound changes physically motivated?
- Can the requested events plausibly fit the duration?
- Are dialogue and sound attributed and synchronized?
- Are constraints specific to likely failures?
- Did model compression accidentally remove a critical invariant?

If any answer is no, repair the IR or prompt before returning it.

## Failure diagnosis and iteration

When the user reports a bad generation, **diagnose before rewriting**.

Classify the failure first:

- `identity/state` — face, wardrobe, prop, logo, screen direction, or state reset;
- `motion` — action ignored, rushed, over-amplified, or physically implausible;
- `camera` — conflicting moves, collision, unwanted orbit/zoom, poor endpoint;
- `time` — static clip, too many events, weak beat progression;
- `physics/look` — fake materials, inconsistent light, generic CG/AI appearance;
- `audio` — speaker swap, lip-sync issue, sound timing/source mismatch;
- `model-fit` — the prompt dialect or requested control does not suit the selected surface.

Then change only one or two variables. Preserve successful constraints. Use `docs/failure-diagnosis.md` and `references/negative-prompts.md` for repair patterns.

## Rules

- Do not claim a prompt guarantees a result.
- Do not claim a model is universally best.
- Do not hard-code volatile product limits when current verification matters.
- Do not mix several visual genres without hierarchy.
- Do not use “8K, masterpiece, cinematic” as substitutes for physical description.
- In image-to-video, focus on change over time rather than repeating the input image.
- Dialogue must fit the duration and be attributed to a speaker.
- Keep constraints short and shot-specific.
- Preserve the user's cultural and historical constraints; flag uncertainty rather than inventing details.

## Reference routing

- Compiler architecture: `docs/prompt-compiler-v2.md`
- Model capability routing: `router/models.json`
- Model-specific writing: `docs/model-adaptation.md`
- Camera choice: `references/camera-language.md`
- Motion/identity problems: `references/motion-continuity.md`
- Light/color: `references/lighting-color.md`
- Sound/dialogue: `references/sound-design.md`
- Failure diagnosis: `docs/failure-diagnosis.md`
- Negative constraints: `references/negative-prompts.md`
- Prompt architecture: `docs/prompt-engineering.md`
- Canonical task fixtures: `dataset/cases.json`
- Copy-ready formats: `templates/`
- Deterministic quality gate: `evals/run_evals.py`

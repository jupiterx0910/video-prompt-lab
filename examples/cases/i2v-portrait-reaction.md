# Flagship Case — Image-to-Video / Portrait Reaction

This case demonstrates why image-to-video prompting should describe **what changes from the source image**, not re-invent the image in prose.

## Raw idea

> Animate an existing portrait. The subject hears something off-screen, moves her eyes first, then turns her head slightly. A curtain behind her moves in a small draft. Preserve her face, clothes and framing.

## 1. Resolve the task

- **Mode:** image-to-video
- **Use case:** restrained portrait reaction
- **Target duration:** 6 seconds
- **Aspect ratio:** inherited from source image
- **Hard constraints:** preserve identity, clothing, composition and environment; small motion only
- **Primary risk:** face deformation caused by too much simultaneous motion or by re-describing the source image

The source image already defines appearance, composition, lighting and much of the scene. The prompt should spend its budget on temporal change.

## 2. Video IR

```yaml
task:
  mode: image-to-video
  use_case: portrait reaction
  duration: 6s
  aspect_ratio: inherit source

state:
  source_image: authoritative for face, hair, wardrobe, framing, background and light
  subject:
    locks:
      - exact facial identity
      - hair shape and color
      - clothing
      - body position
  environment:
    lock: preserve room and curtain position from source

motion:
  trigger: subject hears a quiet off-screen sound to camera-right
  beat_1: eyes shift toward the sound first
  beat_2: brief pause
  beat_3: head turns only slightly in the same direction
  secondary_motion: curtain moves subtly from a small draft
  consequence: subject holds the new gaze; no larger body movement

camera:
  framing: inherit source image
  movement: none
  endpoint: same composition with only the restrained reaction completed

physics:
  sound: optional quiet off-screen cue if the target model surface supports audio
  environment: curtain movement remains low amplitude and does not change the room

continuity:
  - face and skin features do not morph
  - clothing and hair do not redesign
  - camera does not reframe or orbit
  - background geometry remains fixed

constraints:
  avoid:
    - overmotion
    - input_redescription
    - identity_drift
    - camera_motion
    - body_turn
    - background_transformation
```

## 3. Infer capabilities

The task asks for:

- `image_to_video`
- `continuity`
- `character_motion`

These are the minimum capabilities. There is no reason to add multi-shot or large camera choreography to this fixture.

## 4. Route the model family

**Router result: Kling family** for this fixture because the current repository profile covers image-to-video, continuity and character motion together.

This is a capability-overlap recommendation, not a permanent ranking. Specific Kling release names and controls change; verify the exact current version before relying on a product-specific option.

## 5. Compile the prompt

```text
Task: 6s image-to-video portrait reaction. Treat the input image as authoritative for identity, clothing, hair, framing, room geometry and lighting.

Animate only these changes:
1. The subject hears a quiet off-screen cue from camera-right.
2. Her eyes shift toward camera-right first.
3. Hold a brief natural pause.
4. She turns her head only a few degrees in the same direction, then holds the new gaze.
5. The curtain behind her moves subtly once from a small draft.

Camera: locked. Preserve the exact source-image framing and perspective. No push-in, orbit, handheld drift or reframing.

Continuity: preserve the exact face, facial proportions, skin details, hair, clothing, pose, room and curtain design. The reaction must not redesign the source image.

Motion amplitude: restrained. Eyes are the primary movement; the head turn is secondary; curtain motion is subtle. No full-body turn.

Avoid: identity drift, face stretching, mouth movement without cause, exaggerated head rotation, camera movement, background transformation, re-description-driven redesign, simultaneous large subject and environment motion.

Model adaptation: Kling family — prioritize the subject anchor, what changes from the input image and restrained motion amplitude. Verify the selected current model version before generation.
```

## 6. Preflight

- **Source authority:** appearance and composition are inherited rather than re-described.
- **Primary motion:** eye shift is explicitly first.
- **Motion hierarchy:** head and curtain are secondary and low amplitude.
- **Camera:** locked, so model capacity is not split between identity and choreography.
- **Endpoint:** the final gaze state is defined.
- **Continuity:** face, clothes and room are explicit locks.

No deterministic test can prove that a stochastic model will preserve the face perfectly; these checks only confirm that the prompt does not structurally fight that goal.

## 7. Expected failure surfaces

### Failure A — face stretches during the head turn

Maps to `overmotion-i2v` and `identity-drift`.

Next comparison changes only:

- reduce head rotation further;
- keep eye motion as the dominant event;
- remove curtain motion for one control render.

### Failure B — camera drifts even though the source composition is good

Maps to `camera-conflict`.

Next comparison changes only:

- restate “locked camera / exact source framing” once;
- remove any lens or camera-style language that could imply movement.

### Failure C — room or wardrobe gets redesigned

Maps to `identity-drift` / input-redescription risk.

Next comparison changes only:

- delete decorative descriptions of the source image;
- state that source pixels are authoritative for appearance;
- describe only the reaction sequence.

## 8. Minimal repair discipline

For I2V, reducing instructions is often more useful than adding them. When identity fails, first reduce motion and re-description before changing style, lighting or camera.

## What this case teaches

A strong image-to-video prompt often follows:

**source image = state → trigger → one primary motion → one restrained secondary motion → hold final state.**

The prompt's job is temporal delta, not visual reconstruction.

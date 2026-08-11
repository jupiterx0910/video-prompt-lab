# Flagship Case — Dialogue / Café Key Exchange

This case demonstrates why short dialogue video is an **attribution + timing + reaction-state** problem. Adding more cinematic vocabulary does not solve speaker swaps or audio drift.

## Raw idea

> Two friends sit in a quiet café. One slides a key across the table and says, “You keep it.” The other pauses, then replies, “Are you sure?” Keep the room and cup sounds synchronized.

## 1. Resolve the task

- **Mode:** text-to-video
- **Use case:** dialogue
- **Target duration:** 10 seconds
- **Aspect ratio:** 16:9
- **Hard constraints:** two stable people, exactly two short lines, correct speaker attribution, key remains on the table after the handoff
- **Primary risks:** speaker swap, lip-sync drift, emotional beats happening too quickly, prop reset

The scene should be simple enough that the model can spend capacity on faces, timing and audio rather than choreography.

## 2. Video IR

```yaml
task:
  mode: text-to-video
  use_case: dialogue
  duration: 10s
  aspect_ratio: 16:9

state:
  subject_a:
    role: person on camera-left
    lock: same face, dark jacket, calm restrained expression
  subject_b:
    role: person on camera-right
    lock: same face, light sweater, initially uncertain expression
  props:
    key:
      before: held by subject_a
      after: lying between them on the table, closer to subject_b
    cups: one cup in front of each person, positions unchanged
  environment: quiet café booth with soft background activity

motion:
  beat_1:
    trigger: subject_a decides to hand over the key
    action: slides the key across the table toward subject_b
    consequence: key stops near subject_b
  beat_2:
    speaker: subject_a
    line: You keep it.
  beat_3:
    action: subject_b looks at the key, pauses, then looks back at subject_a
  beat_4:
    speaker: subject_b
    line: Are you sure?
  end_state: neither person reaches for the key before the clip ends

camera:
  framing: stable two-shot at table height
  movement: very slow restrained push-in or locked-off if stability is weak
  endpoint: both faces and the key remain readable

physics:
  sound:
    dialogue:
      - subject_a: You keep it.
      - subject_b: Are you sure?
    foley:
      - key sliding lightly on wood
      - subtle cup contact and room tone
    sync: every sound belongs to a visible or clearly off-screen source

continuity:
  - speaker identities never swap
  - key stays in its after-state position
  - cup positions remain stable
  - wardrobe and seating sides remain unchanged

constraints:
  avoid:
    - speaker_swap
    - lip_sync
    - audio_desync
    - prop_reset
    - reaction_before_trigger
    - unnecessary_camera_motion
```

## 3. Infer capabilities

The task asks for:

- `text_to_video`
- `dialogue_audio`
- `sound_sync`
- `cinematic_narrative`

The audio capabilities are not optional decoration here; they are part of the task definition.

## 4. Route the model family

**Router result: Veo family** for this fixture because the repository profile covers dialogue audio, sound synchronization, cinematic narrative and text-to-video.

That route means “best overlap for this task in the current repository profile,” not “best model overall.” Verify the exact current Veo model ID and product surface before relying on specific audio controls.

## 5. Compile the prompt

```text
Task: 10s, 16:9, two-person dialogue scene in a quiet café.

Subject lock: Person A sits camera-left in a dark jacket. Person B sits camera-right in a light sweater. Preserve both faces, wardrobes and seating sides for the entire shot.

World state: one key begins in Person A's hand. One cup stays in front of each person. The café background remains quiet and secondary.

Time and action:
0–2s: Person A slides the key across the wooden table toward Person B. The key stops near Person B and remains there.
2–4s: Person A, visibly speaking, says: “You keep it.”
4–7s: Person B looks down at the key, pauses for a beat, then looks back at Person A. Do not start the reply before this reaction is visible.
7–9s: Person B, visibly speaking, says: “Are you sure?”
9–10s: hold the unresolved two-shot; neither person touches the key.

Camera: stable table-height two-shot. Prefer a locked camera or one extremely slow push-in. Keep both faces and the key readable; no cuts or orbiting movement.

Sound attribution: Person A speaks only “You keep it.” Person B speaks only “Are you sure?” Synchronize mouth movement to the assigned speaker. Add a light key-on-wood slide, restrained cup/room sounds and café ambience only from plausible sources.

Continuity: speaker identities never swap. The key remains in its post-slide position. Cups, seating sides, faces and wardrobe remain unchanged.

Avoid: speaker swap, cross-assigned lip movement, overlapping lines, audio drift, key teleport/reset, premature emotional reaction, extra dialogue, unnecessary camera motion.

Model adaptation: Veo family — prioritize explicit speaker attribution, source-linked sound and clear beginning/middle/end timing. Verify the current model surface before generation.
```

## 6. Preflight

- **Speaker ownership:** every line has exactly one named visible speaker.
- **Reaction timing:** Person B's pause occurs after the key and first line, not simultaneously.
- **Prop state:** the key has a before state, transition and persistent after state.
- **Audio source:** dialogue and foley are tied to people/objects rather than listed as generic ambience.
- **Camera load:** the scene uses a stable two-shot so facial/audio consistency remains the priority.
- **Line count:** no improvised dialogue is requested.

No render score is assigned without an actual rendered result.

## 7. Expected failure surfaces

### Failure A — the wrong person speaks a line

Maps to `speaker-audio-swap`.

Next comparison changes only:

- shorten speaker labels to “Person A / Person B”;
- put each line immediately after its named speaker;
- remove any overlapping movement during the line.

### Failure B — Person B reacts before Person A finishes

This is a time-spine problem.

Next comparison changes only:

- increase the silent pause between beats;
- explicitly order `look at key → pause → look up → reply`.

### Failure C — the key disappears or returns to Person A

Maps to `object-state-reset`.

Next comparison changes only:

- strengthen the key's after state;
- repeat “key remains near Person B until the end” once in continuity.

## 8. Minimal repair discipline

If audio attribution fails, do not also redesign lighting and camera. If the key resets, do not rewrite the dialogue. Preserve everything that worked and isolate the failed layer.

## What this case teaches

Dialogue prompting becomes more controllable when you compile it as:

**speaker identity → prop event → reaction beat → named line → source-linked sound → persistent state.**

The main lever is temporal ownership, not cinematic adjectives.

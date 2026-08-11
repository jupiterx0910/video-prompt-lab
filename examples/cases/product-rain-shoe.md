# Flagship Case — Product / Rain Shoe Hero

This case demonstrates why product video prompting is mostly an **object-state + material-response + continuity** problem, not a style-keyword problem.

## Raw idea

> A premium running shoe lands on wet black stone after rain. Show water displacement and material detail, then finish on a clean hero frame. The logo and sole shape must not change.

## 1. Resolve the task

- **Mode:** text-to-video
- **Use case:** product
- **Target duration:** 8 seconds
- **Aspect ratio:** 16:9
- **Hard constraints:** same shoe, same logo geometry, same sole geometry, no duplicate product, no unexplained slow motion
- **Primary risk:** the product changes while the scene becomes more visually complex

The important decision is to make the product state more important than decorative atmosphere.

## 2. Video IR

```yaml
task:
  mode: text-to-video
  use_case: product
  duration: 8s
  aspect_ratio: 16:9

state:
  subject:
    identity: one dark graphite running shoe
    locks:
      - white side logo position and shape
      - sole geometry and tread silhouette
      - lace pattern
      - upper material and color
  environment:
    surface: black stone with a shallow rain-water film
    background: dark neutral studio-like exterior, no competing products

motion:
  trigger: shoe drops a short distance into frame
  action:
    - heel contacts first
    - sole compresses slightly under impact
    - shallow water is displaced outward
  consequence:
    - droplets fall back to the stone
    - shoe settles into a three-quarter hero angle
    - product geometry remains unchanged

camera:
  framing: low close product shot
  lens_feel: about 50mm
  movement: one short controlled push-in
  endpoint: locked hero frame with logo readable in silhouette

physics:
  material:
    - rubber sole compresses subtly on impact
    - water moves away from the contact point rather than floating
  light: large soft key from camera-left with controlled wet-surface reflection
  sound:
    - rubber impact
    - shallow water displacement
    - droplets returning to stone

continuity:
  - logo never moves or changes shape
  - sole does not morph
  - no second shoe appears
  - final orientation persists after the landing

constraints:
  avoid:
    - logo_drift
    - object_state
    - unmotivated_slow_motion
    - duplicate_product
    - orbit_camera
```

## 3. Infer capabilities

The task asks for:

- `text_to_video`
- `product`
- `continuity`
- `complex_motion`

These capability tags come from the repository router vocabulary rather than a permanent model leaderboard.

## 4. Route the model family

**Router result: Seedance family** for this fixture because the current repository profile covers product work, continuity, complex motion, and text-to-video in one capability set.

Why this is useful:

- the route is explained by task overlap;
- it is not a claim that Seedance is globally “the best” video model;
- exact product surface, version, duration, resolution, and availability must still be checked at generation time.

The creative specification remains platform-neutral enough to recompile for another model family without rewriting the idea.

## 5. Compile the prompt

```text
Task: 8s, 16:9, text-to-video product shot.

Subject: one dark graphite premium running shoe. Preserve the white side-logo position and shape, sole geometry and tread silhouette, lace pattern, upper material and color for the entire clip.

Environment: black stone after rain with only a shallow water film. Keep the background dark and neutral so no second product competes with the hero shoe.

Action causality: the shoe drops a short distance into frame → the heel contacts first and the sole compresses slightly → shallow water is pushed outward from the contact point → droplets fall back → the shoe settles into a stable three-quarter hero angle.

Camera: low close product framing, about a 50mm lens feel. Use one short controlled push-in only. End on a locked hero composition with the side logo clearly readable in silhouette.

Light and material response: large soft key from camera-left. Wet-stone reflection stays physically connected to the surface. Rubber compresses only subtly. Water moves outward and falls back under gravity; no floating splash shapes.

Sound: rubber impact, shallow water displacement and droplets landing on stone, synchronized to the visible events.

Continuity: the same single shoe persists. Logo, sole, laces, material, color and final orientation do not change after impact.

Avoid: logo drift, sole morphing, duplicated shoes, repaired/reset object state, unexplained slow motion, floating water, orbiting camera, unnecessary secondary motion.

Model adaptation: Seedance family — prioritize time order, action causality and product/reference continuity. Verify the exact current model surface before generation.
```

## 6. Preflight

Before spending a generation, check:

- **Identity/state:** logo, sole and lace geometry are named as persistent locks.
- **Causality:** impact causes compression and water displacement; the action has a visible end state.
- **Camera:** only one dominant move exists.
- **Physics:** water and rubber have plausible responses rather than decorative effects.
- **Endpoint:** the shot has a defined hero composition instead of “keep moving cinematically.”
- **Model fit:** the route explains capability overlap but does not assume current limits or availability.

No synthetic quality score is assigned. This repository's deterministic checks validate structure, not stochastic render quality.

## 7. Expected failure surfaces

### Failure A — logo or sole changes

Maps to `identity-drift` / `object-state-reset`.

**Do not** rewrite the lighting and camera at the same time.

Next comparison changes only:

- shorten the product description;
- move logo + sole geometry into the first continuity sentence;
- repeat the final object state once at the end.

### Failure B — splash looks like floating glass

Maps to `motion-without-cause`.

Next comparison changes only:

- reduce splash amplitude;
- restate contact point → outward displacement → gravity-driven fall-back.

### Failure C — camera hides the product

Maps to `camera-conflict`.

Next comparison changes only:

- remove all secondary movement;
- keep the low frame and short push-in;
- preserve the same final hero endpoint.

## 8. Minimal repair discipline

Change **one or two variables per iteration**. If identity failed, do not simultaneously change lens, light, timing and splash style. Otherwise you cannot learn which instruction improved the result.

## What this case teaches

A stronger product prompt is not simply longer. It defines:

**stable object state → physical trigger → visible material response → camera endpoint → preserved final state.**

That chain is the reusable asset. The adjectives are optional.

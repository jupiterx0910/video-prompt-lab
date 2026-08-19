# Video IR

Video IR is the compact intermediate representation between an idea and a model-specific prompt.

## Required fields

- `subject`: identity, appearance, wardrobe, object state.
- `world_state`: location, lighting, environment, starting state.
- `action`: trigger → movement → reaction → result.
- `camera`: framing, lens language, camera position, dominant motion.
- `time`: duration, beat order, pacing, transitions.
- `physics`: gravity, inertia, collisions, deformation, material response.
- `audio`: dialogue, ambience, effects, music, timing.
- `continuity`: state that must persist across shots.
- `constraints`: exclusions and failure-specific negative constraints.

Do not over-specify fields that do not matter to the requested shot.

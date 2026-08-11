# Video Prompt Lab V2.3 Growth Layer Design

## Goal

Turn Video Prompt Lab V2.2 from a strong repository into a repository that is easier to discover, understand, try, cite, and share without weakening the engineering core.

The growth layer must increase distribution surface area while preserving the project's current positioning:

> Treat AI video prompts as compiled production specifications, not adjective collections.

## Success criteria

V2.3 is successful when a new visitor can:

1. understand the project difference in under 30 seconds;
2. open a live demo without cloning the repository;
3. install the Agent Skill with one command;
4. inspect three representative end-to-end cases;
5. see an explicit tagged release and changelog-quality release notes;
6. discover the repository through accurate GitHub description and topics;
7. reuse launch-ready copy for GitHub, Hacker News, Reddit, and X without invented metrics or claims.

## Scope

### 1. Repository discoverability

Update repository metadata with a concise description and focused topics. Topics should map to real project capabilities rather than generic AI keywords.

Recommended description:

> Open-source AI video prompt compiler with Video IR, capability-based model routing, preflight checks, failure diagnosis, deterministic evals, and Agent Skill support.

Recommended topic set:

- ai-video
- prompt-engineering
- agent-skills
- video-generation
- text-to-video
- image-to-video
- prompt-compiler
- llm-tools
- ai-agents
- seedance
- veo
- sora
- kling
- runway

The final set may be trimmed if GitHub metadata constraints require it.

### 2. Live demo through GitHub Pages

Publish the existing zero-dependency `demo/` as a public GitHub Pages site.

Architecture:

- keep `demo/` as the only source of demo UI;
- deploy from `main` using GitHub Actions;
- copy only the runtime files the demo needs into a Pages artifact;
- include canonical data from `router/models.json`, `dataset/cases.json`, and `dataset/failures.json` so relative fetches continue to work;
- avoid rebuilding the demo in a second framework;
- use current official GitHub Pages actions and required permissions.

Expected public URL shape:

`https://jupiterx0910.github.io/video-prompt-lab/`

The README should link to the live site only after deployment is verified.

### 3. Three flagship cases

Create three case-study documents under `examples/cases/` that demonstrate the compiler chain end to end rather than presenting prompt dumps.

Each case must contain:

- raw idea;
- task type and constraints;
- Video IR;
- inferred capabilities;
- selected model family and why;
- compiled prompt;
- preflight findings;
- expected failure surfaces;
- minimal repair strategy;
- what the example teaches.

Cases:

1. **Product / Rain Shoe Hero** — object state, material response, logo/shape continuity.
2. **Dialogue / Café Key Exchange** — speaker attribution, sound sync, emotional timing.
3. **Image-to-Video / Portrait Reaction** — identity preservation, restrained motion, input-image discipline.

No rendered-video quality score may be claimed unless an actual rendered result is supplied and evaluated.

### 4. Release V2.2

Create a formal GitHub Release tagged `v2.2.0` at the current `main` commit.

Release notes must cover:

- Video IR;
- model router;
- canonical datasets;
- failure taxonomy;
- deterministic evals;
- interactive Prompt Builder;
- Before/After and Failure Playground;
- one-command Skill install;
- live demo if Pages is verified before publishing the release.

Do not fabricate download counts, adoption, benchmark superiority, or generated-video success rates.

### 5. Launch pack

Create `launch/README.md` containing channel-specific launch drafts:

- GitHub repository announcement;
- Hacker News / Show HN title + body;
- Reddit post for relevant AI/video communities;
- X post/thread;
- short Chinese announcement.

The messaging hierarchy should be:

1. problem: prompt libraries optimize wording, not controllability;
2. insight: video generation is a state/time/causality problem;
3. solution: Video IR → capability routing → compiler → preflight → diagnosis;
4. proof: interactive local/static demo + deterministic tests + canonical datasets;
5. action: try demo / install Skill / inspect cases.

All copy must avoid fake popularity signals, fake Star counts, fake benchmarks, or unsupported claims about being the best.

## README changes

Keep the V2.2 README architecture. V2.3 should make only high-leverage additions:

- replace local-only demo emphasis with a verified live-demo CTA;
- add a compact "3 flagship cases" section near the interactive demo area;
- add release/version visibility;
- avoid turning the README into a long marketing page.

## Testing and verification

### Repository validation

Extend validation so the following become required:

- `.github/workflows/pages.yml`;
- `examples/cases/product-rain-shoe.md`;
- `examples/cases/dialogue-cafe-key.md`;
- `examples/cases/i2v-portrait-reaction.md`;
- `launch/README.md`.

### Pages workflow

The Pages workflow must:

- trigger on pushes to `main` and allow manual dispatch;
- use current official GitHub Pages actions;
- request only the permissions required for Pages deployment;
- produce a Pages artifact that preserves the relative paths expected by the demo;
- deploy to the `github-pages` environment.

### Post-deploy verification

Before calling V2.3 complete:

- confirm the Pages workflow succeeds on `main`;
- open/fetch the deployed URL and verify the demo shell is served;
- verify canonical JSON assets are reachable from the deployed site;
- verify README links point to the working URL;
- confirm the release exists and targets the intended commit;
- confirm repository description/topics reflect actual project capabilities.

## Constraints

- No paid API keys.
- No second frontend stack.
- No generated popularity metrics.
- No permanent "best model" ranking.
- No claim that deterministic tests measure stochastic video quality.
- No change to the V2.2 compiler architecture unless a concrete deployment bug requires it.
- Prefer one source of truth: router, cases, failures, compiler logic remain canonical.

## Rollout order

1. metadata + Pages deployment plumbing;
2. flagship cases;
3. README live-demo updates;
4. launch pack;
5. CI validation;
6. merge to `main` after checks pass;
7. verify Pages on `main`;
8. publish `v2.2.0` release with the verified live-demo URL.

This order prevents publishing a release or launch link that points to an unverified demo.
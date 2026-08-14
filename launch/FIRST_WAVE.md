# Video Prompt Lab — First-Wave Launch Playbook

This is the short execution layer for turning the repository into a discoverable project. It intentionally avoids fake Stars, reciprocal-Star schemes, paid-Star tactics, fabricated benchmark claims, or copy-pasting the same self-promotion post into every community.

## 1. GitHub metadata — do this before external distribution

The repository currently has a live Pages demo, but GitHub repository metadata still needs to be populated in the repository UI.

### Description

Use this exact description:

```text
Open-source AI video prompt compiler: Video IR → model routing → preflight → failure diagnosis. Interactive demo + Agent Skill.
```

Why this version:

- starts with the searchable category: `AI video prompt compiler`;
- explains the differentiator in one chain;
- exposes the two strongest conversion surfaces: interactive demo + Agent Skill;
- avoids volatile model claims and marketing superlatives.

### Homepage

```text
https://jupiterx0910.github.io/video-prompt-lab/
```

The homepage should point to the live experience, not back to the repository itself.

### Topics

Recommended set:

```text
ai-video
prompt-engineering
video-generation
text-to-video
image-to-video
prompt-compiler
agent-skills
ai-agents
generative-ai
seedance
veo
sora
kling
runway
```

The first nine describe the product category and architecture. Model-family topics are secondary discovery surfaces and should be removed before category topics if the list is shortened.

## 2. The message hierarchy

Every launch post should preserve this order:

1. **Problem** — prompt libraries optimize words, while video failures often happen in state/time/causality/camera/audio/continuity.
2. **New abstraction** — compile the idea into Video IR before prose.
3. **Proof of product** — live demo, router, preflight, failure diagnosis, deterministic tests.
4. **Boundaries** — no fake render benchmark and no permanent “best model” leaderboard.
5. **Action** — try the demo, inspect a flagship case, install the Skill, or contribute a failure case.

Do not lead with a feature list. Lead with the conceptual jump.

## 3. Short launch post — X / short-form social

```text
Most AI video prompt libraries optimize words.

But failed renders are often failures of state, time, causality, camera, physics, sound, or continuity.

I open-sourced Video Prompt Lab — an AI video prompt compiler:

Idea → Video IR → Model Router → Prompt → Preflight → Diagnose

Live demo: https://jupiterx0910.github.io/video-prompt-lab/
GitHub: https://github.com/jupiterx0910/video-prompt-lab
```

Optional follow-up:

```text
The key rule: after a failed render, do not rewrite everything. Diagnose the failing layer and change only 1–2 variables.

The repo includes 3 full walkthroughs: product continuity, dialogue/audio attribution, and restrained image-to-video motion.
```

## 4. Show HN

### Title

```text
Show HN: Video Prompt Lab – a compiler and debugger for AI video prompts
```

### Body

```text
I built Video Prompt Lab after noticing that many AI video prompt guides optimize wording, while a lot of failed generations are really failures of state, time, causality, camera choreography, audio attribution, or continuity.

The project treats a video prompt more like a small compiler pipeline:

Idea → Video IR → Capability Inference → Model Router → Model-aware Prompt → Preflight → Generate → Failure Diagnosis → Minimal Iteration

Instead of asking only “what cinematic words should I add?”, the IR asks what must stay stable, what triggers motion, what the visible consequence is, where the camera must end, who owns each sound, and which failure classes should be checked before generation.

There is a zero-dependency browser demo, canonical task/failure datasets, capability routing for several video-model families, deterministic regression tests, and an installable Agent Skill.

Live demo: https://jupiterx0910.github.io/video-prompt-lab/
Repo: https://github.com/jupiterx0910/video-prompt-lab

One deliberate boundary: the deterministic tests are not presented as rendered-video quality scores, and the router is not a permanent “best model” leaderboard. I would especially value feedback on the IR and failure taxonomy.
```

## 5. Reddit / technical community post

### Title

```text
I open-sourced an AI video prompt compiler: Video IR → model routing → preflight → failure diagnosis
```

### Body

```text
I kept running into the same problem with AI video prompting: when a render fails, most advice tells you to rewrite or add more style words, but that makes it hard to know what actually fixed the result.

Video Prompt Lab uses a different workflow:

1. normalize the idea into Video IR;
2. infer task capabilities;
3. route by capability overlap rather than a permanent model ranking;
4. compile a model-aware prompt;
5. run preflight checks;
6. diagnose the visible failure;
7. change only 1–2 variables for the next iteration.

The failure taxonomy currently covers identity drift, object-state resets, motion without causality, camera conflicts, synthetic-render look, weak time progression, dialogue/audio attribution, and I2V overmotion.

The repository also has a zero-dependency interactive demo and three full walkthroughs showing Idea → IR → Router → Prompt → Preflight → Failure → Minimal Fix.

Live demo: https://jupiterx0910.github.io/video-prompt-lab/
GitHub: https://github.com/jupiterx0910/video-prompt-lab

The regression tests validate deterministic structure and routing logic — they are not claims about stochastic render quality.

Concrete counterexamples and missing failure classes are welcome.
```

Adapt wording and flair to each community's current self-promotion rules before posting.

## 6. 中文社区短帖

```text
我把 AI 视频 Prompt 做成了一个“编译器”。

因为我越来越觉得：很多 AI 视频失败，不是因为 Prompt 不够华丽，而是因为你根本没定义清楚——

人物什么不能变？
动作为什么发生？
镜头最后停在哪里？
物体状态怎么延续？
声音是谁发出的？
失败后究竟应该改哪一层？

所以 Video Prompt Lab 的链条是：

Idea
→ Video IR
→ 能力推断
→ Model Router
→ Prompt
→ Preflight
→ 失败诊断
→ 每轮只改 1–2 个变量

不是收藏“神级 Prompt”，而是把 Prompt 变成一个能调试的制作系统。

在线 Demo：
https://jupiterx0910.github.io/video-prompt-lab/

GitHub：
https://github.com/jupiterx0910/video-prompt-lab
```

## 7. First-wave order

Recommended sequence:

```text
GitHub metadata
→ README hero
→ verify live demo
→ one short-form post
→ one technical-community post
→ answer comments with a relevant flagship case
→ collect concrete failure examples
→ turn repeated failure reports into dataset / docs PRs
```

Do not publish every channel with identical copy at once. The objective of the first wave is not raw impressions; it is to discover which framing makes technically serious users open the demo, inspect a case, and contribute evidence.

## 8. What to measure

Track only observable, non-fabricated signals:

- repository Stars and forks;
- live-demo visits if a privacy-respecting analytics layer is intentionally added later;
- Skill installs only if the relevant platform exposes trustworthy counts;
- issue / PR quality;
- repeated failure classes reported by users;
- which flagship case attracts discussion.

Do not optimize for empty engagement. A useful first-wave outcome is a small number of users who actually run the workflow and report where it breaks.

# Video Prompt Lab Launch Pack

This folder contains launch-ready copy for Video Prompt Lab. Every draft follows the same evidence policy as the repository: **no invented Star counts, download counts, benchmark superiority, success rates, or render scores.**

## Core positioning

**One-line description**

> Open-source AI video prompt compiler with Video IR, capability-based model routing, preflight checks, failure diagnosis, deterministic evals, and Agent Skill support.

**Core thesis**

> Treat AI video prompts as compiled production specifications, not adjective collections.

**Live demo target**

`https://jupiterx0910.github.io/video-prompt-lab/`

**Install**

```bash
npx skills add jupiterx0910/video-prompt-lab
```

## Recommended GitHub metadata

### Description

```text
Open-source AI video prompt compiler with Video IR, capability-based model routing, preflight checks, failure diagnosis, deterministic evals, and Agent Skill support.
```

### Topics

```text
ai-video
prompt-engineering
agent-skills
video-generation
text-to-video
image-to-video
prompt-compiler
llm-tools
ai-agents
seedance
veo
sora
kling
runway
```

These topics map to actual repository functionality or model-family routing profiles. Trim model-family topics first if a tighter discovery surface is preferred.

---

## GitHub repository announcement

### Title

Video Prompt Lab v2.2 — from prompt collection to AI video prompt compiler

### Body

Video Prompt Lab now treats AI video prompting as a small compiler pipeline:

```text
Idea
→ Video IR
→ Capability Inference
→ Model Router
→ Model-aware Prompt
→ Preflight
→ Generate
→ Failure Diagnosis
→ Minimal Iteration
```

The problem I wanted to solve was not “how do I add more cinematic words?” It was: **why does a video fail, and which control layer should change next?**

The repository now includes:

- a Video IR for subject/state, causality, camera, physics, sound and continuity;
- capability-based routing for Seedance / Veo / Sora / Kling / Runway families;
- canonical task and failure datasets;
- an interactive zero-dependency Prompt Builder;
- Before / After and Failure Playground views;
- deterministic evals + GitHub Actions;
- an installable Agent Skill.

The tests protect deterministic structure; they do not pretend to measure stochastic render quality.

Try the live demo:
`https://jupiterx0910.github.io/video-prompt-lab/`

Install the Skill:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

If you work on AI video generation, contributions based on reproducible failure cases are especially welcome.

---

## Show HN

### Title

```text
Show HN: Video Prompt Lab – compile AI video ideas into controllable production prompts
```

### Body

I built Video Prompt Lab because most AI video prompt libraries optimize wording while many generation failures happen at a different layer: identity drift, object-state resets, motion without causality, conflicting camera instructions, weak time progression, or ambiguous sound ownership.

Instead of starting with a paragraph, the project normalizes an idea into a small Video IR, infers required capabilities, routes to a model family, compiles a model-aware prompt, runs preflight checks, and then diagnoses failures with minimal-delta iteration.

Pipeline:

```text
Idea → Video IR → Capability Inference → Model Router
→ Prompt → Preflight → Generate → Diagnose → Change 1–2 variables
```

It includes a zero-dependency browser demo, canonical cases/failure taxonomy, deterministic evals, GitHub Actions, and an Agent Skill installable with:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

Live demo:
`https://jupiterx0910.github.io/video-prompt-lab/`

Repo:
`https://github.com/jupiterx0910/video-prompt-lab`

One deliberate constraint: I do not publish a permanent “best video model” leaderboard or fake render scores. Model families are routed by task-capability overlap and fast-changing product limits are treated as time-sensitive.

I’d be interested in feedback on the IR, failure taxonomy, and cases where minimal-delta iteration does or does not hold up.

---

## Reddit

### Suggested title

```text
I open-sourced an AI video prompt compiler: Video IR → model routing → preflight → failure diagnosis
```

### Post

I kept running into the same issue with AI video prompt guides: they often tell you which cinematic words to add, but they do not tell you **which layer failed** when the output breaks.

So I built Video Prompt Lab around a different abstraction:

1. turn the idea into a structured Video IR;
2. infer capabilities such as I2V, dialogue audio, continuity, multi-shot or complex motion;
3. route by capability overlap instead of a permanent model leaderboard;
4. compile a model-aware prompt;
5. run preflight checks;
6. if the render fails, diagnose the layer and change only 1–2 variables.

The repo includes an interactive static Prompt Builder, Before/After examples, a Failure Playground, canonical datasets and deterministic CI. The tests validate structure and routing logic — not stochastic video quality.

Live demo:
`https://jupiterx0910.github.io/video-prompt-lab/`

GitHub:
`https://github.com/jupiterx0910/video-prompt-lab`

Agent Skill install:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

I’d especially value concrete failure cases: identity drift, prop resets, weird camera choreography, I2V overmotion, dialogue attribution, or anything that does not fit the current taxonomy.

**Posting note:** adapt the opening sentence and flair to each community’s self-promotion rules instead of cross-posting identical copy everywhere.

---

## X / Twitter thread

### Post 1

Most AI video prompt libraries optimize **words**.

But failed videos are often failures of **state, time, causality, camera, physics, sound, or continuity**.

I open-sourced Video Prompt Lab: an AI video prompt compiler.

### Post 2

The pipeline:

```text
Idea
→ Video IR
→ Capability Inference
→ Model Router
→ Prompt
→ Preflight
→ Diagnose
→ change 1–2 variables
```

The goal is not a longer prompt. It is a more debuggable production specification.

### Post 3

Example: “make a cinematic shoe ad in the rain” is underspecified.

The compiler asks instead:

- what object state must never drift?
- what triggers motion?
- what is the visible consequence?
- where does the camera end?
- how should water/materials physically respond?

### Post 4

It also includes a Failure Playground for:

- identity drift
- prop/object reset
- motion without cause
- camera conflict
- synthetic render look
- static time spine
- speaker/audio swap
- I2V overmotion

### Post 5

No fake “9.8/10” benchmark and no permanent “best model” ranking.

The router uses task-capability overlap across Seedance / Veo / Sora / Kling / Runway family profiles, with cautions for fast-changing product surfaces.

### Post 6

Try the live demo:
`https://jupiterx0910.github.io/video-prompt-lab/`

Install as an Agent Skill:

```bash
npx skills add jupiterx0910/video-prompt-lab
```

GitHub:
`https://github.com/jupiterx0910/video-prompt-lab`

---

## 中文发布稿

### 标题

```text
我把 AI 视频提示词做成了一个“编译器”，而不是 Prompt 大全
```

### 正文

很多 AI 视频提示词教程在解决一个表层问题：**怎么把文字写得更“电影感”。**

但真正让视频翻车的，常常不是形容词不够，而是：

- 人物/Logo 漂移；
- 道具状态突然重置；
- 动作没有物理原因；
- 运镜互相冲突；
- 时间上没有真正发生事情；
- 对白串人、声音和画面不同步；
- 图生视频一次要求太多运动，导致人脸拉坏。

所以我把 Video Prompt Lab 重构成了一条编译链：

```text
一句想法
→ Video IR
→ 能力推断
→ 模型路由
→ 模型化 Prompt
→ Preflight
→ 生成
→ 失败诊断
→ 每轮只改 1–2 个变量
```

它现在包含交互式 Prompt Builder、Before/After、Failure Playground、标准案例、失败数据集、确定性测试、GitHub Actions，以及可安装的 Agent Skill。

核心观点只有一句：

> **AI 视频 Prompt 应该被当成“可编译、可检查、可诊断的制作规格”，而不是形容词集合。**

在线 Demo：
`https://jupiterx0910.github.io/video-prompt-lab/`

GitHub：
`https://github.com/jupiterx0910/video-prompt-lab`

安装 Skill：

```bash
npx skills add jupiterx0910/video-prompt-lab
```

如果你也在做 AI 视频，我更想收集的不是“神级 Prompt”，而是**真实失败案例以及哪一个最小修改让它变好**。

---

## Release v2.2.0

The exact release body is stored in [`release-v2.2.0.md`](release-v2.2.0.md).

Target commit for the v2.2.0 tag:

```text
b4eed435b564552de97d1612240b32f90c867c4d
```

This target intentionally points to the merged V2.2 compiler + interactive-demo milestone, before the V2.3 distribution layer.

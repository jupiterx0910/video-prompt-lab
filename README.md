# Video Prompt Lab｜把灵感编译成可执行的 AI 视频规格

> **Prompt 不是形容词堆砌，而是一份会随时间发生变化的制作规格。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-18a957)](https://agentskills.io)
[![CI](https://img.shields.io/github/actions/workflow/status/jupiterx0910/video-prompt-lab/validate.yml?branch=main&label=validation)](.github/workflows/validate.yml)
[![Language](https://img.shields.io/badge/Language-中文%20%7C%20English-blue)](README_EN.md)

Video Prompt Lab 是一个面向 **文生视频、图生视频和 Agent 工作流** 的提示词工程库。它不把重点放在“神奇关键词”，而是先把创意规范化成 **Video IR（视频中间表示）**，再根据任务需要选择模型能力、编译提示词、做 preflight，并在生成失败后按层诊断。

```text
一句灵感
   ↓
Video IR：主体 / 世界状态 / 动作因果 / 镜头 / 时间 / 物理 / 声音 / 连续性
   ↓
能力需求：I2V？对白音频？多镜头？复杂运动？产品一致性？
   ↓
Model Router：按能力匹配，而不是做永久排行榜
   ↓
模型化 Prompt：保留导演意图，按目标模型压缩
   ↓
Preflight：冲突、时长、连续性、物理、声音、负面约束
   ↓
生成 → 失败诊断 → 只改 1–2 个变量 → 再生成
```

## 为什么这套方法和普通 Prompt 大全不同

很多提示词库解决的是“**写什么词**”。Video Prompt Lab 更关注“**视频为什么会按这个方式发生**”。

| 普通做法 | Video Prompt Lab |
|---|---|
| 先写一大段漂亮文字 | 先建立 Video IR，再编译成文字 |
| 直接问“哪个模型最好” | 先拆能力需求，再解释为什么匹配某个模型 |
| 情绪靠“高级、电影感、震撼” | 情绪翻译成动作、构图、光线、声音和留白 |
| 动作只写结果 | 写 `触发 → 反应/动作 → 可见后果` |
| 镜头词越多越好 | 每镜头只保留一个主运动和明确结束构图 |
| 生成失败就重写整条 Prompt | 先判断身份、运动、镜头、时间、物理、音频还是模型适配失败 |
| 凭感觉升级 Skill | 用确定性 eval + GitHub Actions 防止结构性回退 |

这不是在承诺“Prompt 能保证出片”。模型生成仍然具有随机性。工程化的价值在于：**让你知道自己在控制什么、为什么失败、下一轮该改什么。**

## 30 秒快速开始

没有 Agent 时，直接套这个最小公式：

```text
[时长与比例]。[主体身份与固定特征]在[地点/时间]因为[触发事件]完成[明确动作]，最终[可见结果]。
摄影：[景别]，[机位]，[焦段感]，[一种主要镜头运动]，[结束构图]。
物理与光线：[光源/材质/环境]如何因为动作发生可见变化。
声音：[同步动作声]，[环境底噪]，[必要时对白/画外声及来源]。
连续性：锁定[人物/服装/道具/Logo/方向/空间关系]。
避免：[本镜头最可能发生的 3–5 个错误]。
```

核心优先级：

```text
动作因果 > 主体/物体一致性 > 空间与镜头 > 关键物理变化 > 声音 > 次要细节 > 风格形容词
```

## V2.1：Prompt Compiler

完整架构见 [Prompt Compiler v2](docs/prompt-compiler-v2.md)。

Video IR 不是要求你把所有字段都展示给用户，而是让 Agent 在写 Prompt 之前先解决冲突：

```yaml
intent:
  purpose: product / cinematic / social / documentary
state:
  subject: persistent identity
  environment: spatial state
  props: object state
  continuity_locks: things that must not drift
motion:
  trigger: why change starts
  action: what changes
  consequence: visible end state
camera:
  framing: shot size and angle
  movement: one dominant move
  endpoint: where the shot ends
physics:
  light: source and change
  material: physical response
  sound: source and sync point
constraints:
  avoid: shot-specific failures
```

同一个 Video IR 可以编译成不同模型偏好的表达，而不用从头重写创意。

## Model Router：不是排行榜

模型变化太快，静态的“S/A/B 排名”很容易过期。本项目使用 [router/models.json](router/models.json) 做 **能力路由**：

1. 用户明确指定模型 → 优先尊重；
2. 未指定 → 从任务提取能力标签；
3. 根据模型家族的 strengths/cautions 做匹配；
4. 给出 1–2 个候选及理由；
5. 涉及版本、价格、时长、分辨率、可用性时，再查当前官方说明。

当前路由覆盖 Seedance、Veo、Sora、Kling、Runway 等模型家族。这里的配置是**工作流知识**，不是永久有效的产品规格。尤其是 Sora 等产品/接口的可用状态曾发生明显变化，实际使用前必须核对当前官方入口。

## 失败诊断：先定位，再改 Prompt

见 [AI Video Failure Diagnosis](docs/failure-diagnosis.md)。

典型诊断：

| 症状 | 更可能的根因 | 第一修复动作 |
|---|---|---|
| 人脸/衣服变化 | identity/state | 减少无关外观细节，强化 2–4 个稳定锚点 |
| Logo、道具突然变化 | object state | 明确前后状态和不能变化的几何特征 |
| 动作像漂移 | motion | 补触发、受力/反应和最终后果 |
| 运镜乱飞 | camera | 删除冲突动作，只留一个主运镜 |
| 看起来像游戏 CG | physics/look | 删除空泛词，补素材、反射、曝光、惯性等物理依据 |
| 视频几乎不动 | time | 加 2–4 个真正改变信息/动作/声音的节拍 |
| 对白串人/声音错位 | audio | 缩短对白，明确说话者和声音发生时刻 |

最重要的迭代纪律：**每轮只改 1–2 个变量。** 否则你无法知道究竟什么起作用。

## Canonical Dataset

[dataset/cases.json](dataset/cases.json) 不是“爆款 Prompt 收藏夹”，而是一组用于训练思维和防回退的标准任务：

- 产品广告
- 电影动作
- UGC / 社交短视频
- 纪实观察
- 图生视频
- 双人对白与同步声音
- 多镜头连续性

每个案例只记录任务、必须保留的 IR、风险标签和能力需求。**没有真实生成记录，就不填虚构分数。**

## 确定性 Eval + CI

优秀的 Skill 不应该“越改越玄学”。V2.1 新增零依赖结构回归测试：

```bash
python scripts/validate_repo.py
python evals/run_evals.py
```

CI 检查：

- Router JSON 是否完整、ID 是否冲突；
- Dataset 是否覆盖关键任务；
- Dataset 引用的能力标签是否真实存在于 Router；
- 路由基准案例是否至少有候选模型满足能力要求；
- 标准 Prompt 是否保留因果、运镜、连续性和针对性约束；
- `SKILL.md` 是否仍然包含 Video IR、路由、显式模型优先、preflight、诊断优先等核心不变量。

这些测试只证明**工程结构没有回退**，不等于评价最终生成视频。评分边界见 [evals/scoring.md](evals/scoring.md)。

## Agent Skill

根目录 [SKILL.md](SKILL.md) 可以作为支持 Agent Skills 的技能入口。

它现在按下面的链条工作：

```text
Resolve Task
→ Build Video IR
→ Infer Capabilities
→ Route/Honor Target Model
→ Compile Prompt
→ Preflight
→ Output
→ Diagnose & Iterate
```

默认输出仍然是人能直接复制的：`创意判断 + 模型建议（需要时）+ 主提示词 + 连续性锁 + 负面约束 + 迭代旋钮`。

安装：

```bash
git clone https://github.com/jupiterx0910/video-prompt-lab.git
```

然后把仓库或 `SKILL.md` 放入你的 Agent 技能目录。

## 仓库导航

| 需求 | 文件 |
|---|---|
| 理解完整编译器 | [docs/prompt-compiler-v2.md](docs/prompt-compiler-v2.md) |
| 学基础方法 | [docs/prompt-engineering.md](docs/prompt-engineering.md) |
| 模型适配 | [docs/model-adaptation.md](docs/model-adaptation.md) |
| 模型能力路由 | [router/models.json](router/models.json) |
| 从零写文生视频 | [templates/text-to-video.md](templates/text-to-video.md) |
| 图生视频 | [templates/image-to-video.md](templates/image-to-video.md) |
| 多镜头叙事 | [templates/multi-shot-story.md](templates/multi-shot-story.md) |
| UGC / 社交短视频 | [templates/social-video.md](templates/social-video.md) |
| 产品广告 | [templates/product-film.md](templates/product-film.md) |
| 镜头语言 | [references/camera-language.md](references/camera-language.md) |
| 运动与连续性 | [references/motion-continuity.md](references/motion-continuity.md) |
| 灯光与色彩 | [references/lighting-color.md](references/lighting-color.md) |
| 声音设计 | [references/sound-design.md](references/sound-design.md) |
| 故障诊断 | [docs/failure-diagnosis.md](docs/failure-diagnosis.md) |
| 负面约束 | [references/negative-prompts.md](references/negative-prompts.md) |
| Canonical Dataset | [dataset/cases.json](dataset/cases.json) |
| Eval | [evals/README.md](evals/README.md) |
| 案例 | [examples/README.md](examples/README.md) |

## 设计原则

- 不把偶然成功包装成普遍规律。
- 不把具体摄影机型号当成“电影感魔法词”。
- 不用 `8K / masterpiece / best quality` 代替动作与物理描述。
- 不在核心逻辑里硬编码很快会变的价格、时长和 UI 参数。
- 不伪造 Benchmark 分数。
- 不追求 Prompt 越长越好；复杂镜头先完整设计，再按模型压缩。

## 与参考项目的关系

项目早期受到 [zhouwei713/seedance-prompt](https://github.com/zhouwei713/seedance-prompt) 中“从漂亮画面描述转向可信素材设计”的启发。V2.1 进一步吸收了优秀开源项目常见的工程实践：结构化 Skill、失败案例、可机器读取的数据、自动 eval、CI 回归门禁和模型路由，但仓库架构、实现与正文均为独立设计和重写。

## 贡献

欢迎提交新案例、模型适配经验和失败复盘。请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。如果增加模型能力事实，请优先附官方来源；如果增加“效果更好”的经验，请说明测试模型、时间、输入和观察条件。

## License

[MIT](LICENSE)

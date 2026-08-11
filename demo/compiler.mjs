const text = (value) => (typeof value === 'string' ? value.trim() : '');

const unique = (values) => [...new Set(values.filter(Boolean))];

export function normalizeIR(state = {}) {
  return {
    task: {
      mode: text(state.mode) || 'text-to-video',
      use_case: text(state.useCase) || 'cinematic',
      duration: text(state.duration),
      aspect_ratio: text(state.aspect),
    },
    subject: text(state.subject),
    environment: text(state.environment),
    motion: {
      trigger: text(state.trigger),
      action: text(state.action),
      consequence: text(state.consequence),
    },
    camera: text(state.camera),
    physics: {
      light: text(state.light),
      sound: text(state.sound),
    },
    continuity: text(state.continuity),
    avoid: text(state.avoid),
  };
}

export function inferCapabilities(state = {}) {
  const capabilities = [];
  const mode = text(state.mode).toLowerCase();
  const useCase = text(state.useCase).toLowerCase();

  capabilities.push(mode === 'image-to-video' ? 'image_to_video' : 'text_to_video');

  const byUseCase = {
    product: ['product', 'continuity'],
    cinematic: ['cinematic_narrative', 'physics'],
    social: ['social', 'character_motion'],
    documentary: ['physics', 'complex_motion'],
    dialogue: ['dialogue_audio', 'sound_sync', 'cinematic_narrative'],
    'multi-shot': ['multi_shot', 'continuity', 'cinematic_narrative'],
  };

  capabilities.push(...(byUseCase[useCase] || []));

  if (text(state.continuity)) capabilities.push('continuity');
  if (useCase !== 'dialogue' && text(state.sound)) capabilities.push('sound_sync');

  return unique(capabilities);
}

function scoreModel(model, capabilities) {
  const strengths = new Set(Array.isArray(model.strengths) ? model.strengths : []);
  const matched = capabilities.filter((capability) => strengths.has(capability));
  return { model, matched, score: matched.length };
}

export function routeModels(models = [], capabilities = [], explicitModelId = 'auto') {
  const scored = models
    .map((model) => scoreModel(model, capabilities))
    .sort((a, b) => b.score - a.score || String(a.model.family).localeCompare(String(b.model.family)));

  const explicit = text(explicitModelId).toLowerCase();
  if (explicit && explicit !== 'auto') {
    const chosen = scored.find(({ model }) => String(model.id).toLowerCase() === explicit);
    if (chosen) {
      return {
        selected: chosen.model,
        alternatives: scored.filter(({ model }) => model.id !== chosen.model.id).slice(0, 3).map(({ model }) => model),
        matched: chosen.matched,
        warning: 'Explicit model selection preserved. Capability mismatch is shown as a caution, not silently rerouted.',
      };
    }

    return {
      selected: null,
      alternatives: scored.slice(0, 3).map(({ model }) => model),
      matched: [],
      warning: `No router profile exists for explicit model "${explicitModelId}". Compile platform-neutral output instead of inventing capabilities.`,
    };
  }

  const best = scored[0];
  if (!best) {
    return {
      selected: null,
      alternatives: [],
      matched: [],
      warning: 'No model profiles are available. Use platform-neutral compilation.',
    };
  }

  return {
    selected: best.model,
    alternatives: scored.slice(1, 4).map(({ model }) => model),
    matched: best.matched,
    warning: best.score === 0
      ? 'No capability tags matched strongly; recommendation is only a fallback profile, not a global ranking.'
      : 'Recommendation is based on capability overlap for this task, not a global model ranking.',
  };
}

export function compilePrompt(state = {}, ir = normalizeIR(state), route = { selected: null }) {
  const lines = [];
  const duration = ir.task.duration ? `${ir.task.duration}s` : '8s';
  const aspect = ir.task.aspect_ratio || '16:9';
  lines.push(`Task: ${duration}, ${aspect}, ${ir.task.mode}, ${ir.task.use_case}.`);

  if (ir.subject) lines.push(`Subject: ${ir.subject}.`);
  if (ir.environment) lines.push(`Environment: ${ir.environment}.`);

  const motion = [ir.motion.trigger, ir.motion.action, ir.motion.consequence].filter(Boolean);
  if (motion.length) lines.push(`Action causality: ${motion.join(' → ')}.`);

  if (ir.camera) lines.push(`Camera: ${ir.camera}.`);
  if (ir.physics.light) lines.push(`Light: ${ir.physics.light}.`);
  if (ir.physics.sound) lines.push(`Sound: ${ir.physics.sound}.`);
  if (ir.continuity) lines.push(`Continuity: ${ir.continuity}.`);
  if (ir.avoid) lines.push(`Avoid: ${ir.avoid}.`);

  if (route?.selected) {
    const emphasis = Array.isArray(route.selected.prompt_emphasis)
      ? route.selected.prompt_emphasis.slice(0, 3).join(', ')
      : '';
    lines.push(
      `Model adaptation: ${route.selected.family}${emphasis ? ` — prioritize ${emphasis}` : ''}.`
    );
  }

  return lines.join('\n');
}

export function preflight(state = {}, ir = normalizeIR(state), route = { selected: null, matched: [] }) {
  const warnings = [];

  if (!ir.subject) warnings.push('Add a stable subject anchor before finalizing the prompt.');
  if (!ir.motion.action) warnings.push('Add one primary action; a video prompt needs visible change over time.');
  if (!ir.camera) warnings.push('Add one main camera idea or explicitly choose a locked-off shot.');

  if (ir.task.mode === 'image-to-video' && ir.subject.length > 180) {
    warnings.push('Image-to-video subject text is unusually long; describe what changes instead of re-describing the whole input image.');
  }

  if (route?.selected) {
    const desired = inferCapabilities(state);
    const strengths = new Set(route.selected.strengths || []);
    const unsupported = desired.filter((capability) => !strengths.has(capability));
    if (unsupported.length) {
      warnings.push(
        `${route.selected.family} profile does not explicitly cover: ${unsupported.join(', ')}. Verify the current model surface before generation.`
      );
    }
  }

  return warnings;
}

export function buildBeforeAfter(caseRecord = {}, models = []) {
  const task = text(caseRecord.task) || 'video';
  const input = text(caseRecord.input);
  const firstSentence = input.split(/[.;]/)[0].trim() || input;
  const required = Array.isArray(caseRecord.required_ir) ? caseRecord.required_ir : [];
  const risks = Array.isArray(caseRecord.risk_tags) ? caseRecord.risk_tags : [];
  const preferred = Array.isArray(caseRecord.preferred_capabilities) ? caseRecord.preferred_capabilities : [];
  const route = routeModels(models, preferred, 'auto');

  const weak = `Make a ${task} video: ${firstSentence}. Cinematic, high quality.`;
  const diagnosis = [
    required.length ? `Missing explicit control dimensions: ${required.join(', ')}.` : '',
    risks.length ? `Known failure surface: ${risks.join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  const improved = [
    input,
    required.length ? `Control explicitly: ${required.join(', ')}.` : '',
    'Continuity: preserve every stated identity, prop, direction, and object-state constraint through the shot or cuts.',
    risks.length ? `Avoid: ${risks.join(', ')}.` : '',
    route.selected ? `Model route: ${route.selected.family}, based on ${route.matched.join(', ') || 'fallback capability overlap'}.` : '',
  ].filter(Boolean).join('\n');

  return { weak, diagnosis, improved };
}

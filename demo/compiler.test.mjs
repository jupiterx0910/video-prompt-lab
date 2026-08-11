import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeIR,
  inferCapabilities,
  routeModels,
  compilePrompt,
  preflight,
  buildBeforeAfter,
} from './compiler.mjs';

const models = [
  {
    id: 'seedance',
    family: 'Seedance',
    strengths: ['text_to_video', 'image_to_video', 'multi_shot', 'complex_motion', 'product', 'continuity'],
    cautions: ['verify current limits'],
    evidence: 'official-doc-informed',
    prompt_emphasis: ['time order', 'action causality'],
  },
  {
    id: 'veo',
    family: 'Veo',
    strengths: ['text_to_video', 'image_to_video', 'dialogue_audio', 'sound_sync', 'physics', 'cinematic_narrative'],
    cautions: ['verify current surface'],
    evidence: 'official-doc-informed',
    prompt_emphasis: ['speaker attribution', 'sound sources'],
  },
  {
    id: 'kling',
    family: 'Kling',
    strengths: ['text_to_video', 'image_to_video', 'continuity', 'character_motion', 'product', 'social'],
    cautions: ['verify current release'],
    evidence: 'heuristic',
    prompt_emphasis: ['subject anchor', 'motion amplitude'],
  },
];

test('image-to-video infers image_to_video capability', () => {
  const caps = inferCapabilities({ mode: 'image-to-video', useCase: 'cinematic' });
  assert.ok(caps.includes('image_to_video'));
});

test('dialogue infers dialogue_audio and sound_sync', () => {
  const caps = inferCapabilities({ mode: 'text-to-video', useCase: 'dialogue', sound: 'two spoken lines' });
  assert.ok(caps.includes('dialogue_audio'));
  assert.ok(caps.includes('sound_sync'));
});

test('explicit model selection wins over automatic score', () => {
  const result = routeModels(models, ['dialogue_audio', 'sound_sync', 'physics'], 'kling');
  assert.equal(result.selected.id, 'kling');
  assert.match(result.warning, /explicit/i);
});

test('automatic routing returns selected model and alternatives', () => {
  const result = routeModels(models, ['product', 'continuity'], 'auto');
  assert.ok(result.selected);
  assert.ok(Array.isArray(result.alternatives));
  assert.ok(Array.isArray(result.matched));
});

test('missing action produces a preflight warning', () => {
  const state = { mode: 'text-to-video', useCase: 'product', subject: 'a running shoe', action: '' };
  const ir = normalizeIR(state);
  const route = routeModels(models, inferCapabilities(state), 'auto');
  const warnings = preflight(state, ir, route);
  assert.ok(warnings.some((warning) => /action/i.test(warning)));
});

test('compiled prompt carries subject action and continuity', () => {
  const state = {
    mode: 'text-to-video',
    useCase: 'cinematic',
    duration: '8',
    aspect: '16:9',
    subject: 'a courier in a red jacket',
    environment: 'a wet night market',
    trigger: 'a motorcycle approaches',
    action: 'the courier runs toward a closing gate',
    consequence: 'she slips through before it shuts',
    camera: 'waist-height 35mm follow shot',
    light: 'mixed market neon and streetlight',
    sound: 'footsteps, market ambience, motorcycle engine',
    continuity: 'keep the red jacket and parcel unchanged',
    avoid: 'duplicate people, prop drift',
  };
  const ir = normalizeIR(state);
  const route = routeModels(models, inferCapabilities(state), 'auto');
  const prompt = compilePrompt(state, ir, route);
  assert.match(prompt, /courier in a red jacket/i);
  assert.match(prompt, /runs toward a closing gate/i);
  assert.match(prompt, /red jacket and parcel unchanged/i);
});

test('before-after diagnosis identifies missing control dimensions', () => {
  const caseRecord = {
    id: 'product-test',
    task: 'product',
    mode: 'text-to-video',
    input: 'A shoe lands on wet stone. Preserve the logo and sole shape.',
    required_ir: ['subject', 'environment', 'action', 'camera', 'light', 'continuity'],
    risk_tags: ['logo_drift', 'object_state'],
    preferred_capabilities: ['product', 'continuity'],
  };
  const result = buildBeforeAfter(caseRecord, models);
  assert.ok(result.weak.length > 0);
  assert.ok(result.diagnosis.length > 0);
  assert.match(result.improved, /continuity|preserve|avoid/i);
});

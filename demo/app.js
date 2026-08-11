import {
  normalizeIR,
  inferCapabilities,
  routeModels,
  compilePrompt,
  preflight,
  buildBeforeAfter,
} from './compiler.mjs';

const DATA_PATHS = {
  router: '../router/models.json',
  cases: '../dataset/cases.json',
  failures: '../dataset/failures.json',
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  form: $('#prompt-form'),
  model: $('#model'),
  routeFamily: $('#route-family'),
  routeEvidence: $('#route-evidence'),
  routeNote: $('#route-note'),
  routeMatched: $('#route-matched'),
  routeCautions: $('#route-cautions'),
  routeAlternatives: $('#route-alternatives'),
  capabilities: $('#capabilities'),
  irOutput: $('#ir-output'),
  promptOutput: $('#prompt-output'),
  preflightOutput: $('#preflight-output'),
  loadError: $('#load-error'),
  caseSelect: $('#case-select'),
  beforeOutput: $('#before-output'),
  diagnosisOutput: $('#diagnosis-output'),
  afterOutput: $('#after-output'),
  loadCase: $('#load-case'),
  failureMenu: $('#failure-menu'),
  failureSymptom: $('#failure-symptom'),
  failureCause: $('#failure-cause'),
  failureFix: $('#failure-fix'),
  failureChange: $('#failure-change'),
  failureTags: $('#failure-tags'),
};

const data = {
  models: [],
  cases: [],
  failures: [],
  activeFailureId: null,
};

function formState() {
  const formData = new FormData(elements.form);
  return {
    mode: String(formData.get('mode') || ''),
    useCase: String(formData.get('useCase') || ''),
    model: String(formData.get('model') || 'auto'),
    duration: String(formData.get('duration') || ''),
    aspect: String(formData.get('aspect') || ''),
    subject: String(formData.get('subject') || ''),
    environment: String(formData.get('environment') || ''),
    trigger: String(formData.get('trigger') || ''),
    action: String(formData.get('action') || ''),
    consequence: String(formData.get('consequence') || ''),
    camera: String(formData.get('camera') || ''),
    light: String(formData.get('light') || ''),
    sound: String(formData.get('sound') || ''),
    continuity: String(formData.get('continuity') || ''),
    avoid: String(formData.get('avoid') || ''),
  };
}

function createChip(label, matched = false) {
  const chip = document.createElement('span');
  chip.className = `chip${matched ? ' match' : ''}`;
  chip.textContent = label;
  return chip;
}

function renderCapabilities(capabilities, matched = []) {
  elements.capabilities.replaceChildren();
  const matchedSet = new Set(matched);
  capabilities.forEach((capability) => {
    elements.capabilities.append(createChip(capability, matchedSet.has(capability)));
  });
}

function matchedFor(model, capabilities) {
  const strengths = new Set(model?.strengths || []);
  return capabilities.filter((capability) => strengths.has(capability));
}

function renderRoute(route, capabilities) {
  const selected = route.selected;
  elements.routeFamily.textContent = selected?.family || 'Platform-neutral';
  elements.routeEvidence.textContent = selected?.evidence || 'no profile';
  elements.routeNote.textContent = route.warning || 'Capability route unavailable.';
  elements.routeMatched.textContent = route.matched?.length
    ? route.matched.join(' · ')
    : 'No explicit capability matches';

  renderCapabilities(capabilities, route.matched || []);

  elements.routeCautions.replaceChildren();
  const cautions = selected?.cautions || [];
  cautions.slice(0, 2).forEach((cautionText) => {
    const caution = document.createElement('div');
    caution.className = 'caution';
    caution.textContent = cautionText;
    elements.routeCautions.append(caution);
  });

  elements.routeAlternatives.replaceChildren();
  (route.alternatives || []).slice(0, 3).forEach((model) => {
    const item = document.createElement('div');
    item.className = 'alt-model';
    const matches = matchedFor(model, capabilities);
    const name = document.createElement('strong');
    const meta = document.createElement('span');
    name.textContent = model.family;
    meta.textContent = matches.length ? `${matches.length} matched` : 'fallback';
    item.append(name, meta);
    elements.routeAlternatives.append(item);
  });
}

function renderPreflight(warnings) {
  elements.preflightOutput.replaceChildren();

  if (!warnings.length) {
    const item = document.createElement('div');
    item.className = 'preflight-item ok';
    item.textContent = 'Structural preflight is clean. Render quality still requires an actual generation test.';
    elements.preflightOutput.append(item);
    return;
  }

  warnings.forEach((warning) => {
    const item = document.createElement('div');
    item.className = 'preflight-item';
    item.textContent = warning;
    elements.preflightOutput.append(item);
  });
}

function renderCompiler() {
  if (!data.models.length) return;

  const state = formState();
  const ir = normalizeIR(state);
  const capabilities = inferCapabilities(state);
  const route = routeModels(data.models, capabilities, state.model);
  const prompt = compilePrompt(state, ir, route);
  const warnings = preflight(state, ir, route);

  renderRoute(route, capabilities);
  elements.irOutput.textContent = JSON.stringify(ir, null, 2);
  elements.promptOutput.textContent = prompt;
  renderPreflight(warnings);
}

function populateModels() {
  data.models.forEach((model) => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.family;
    elements.model.append(option);
  });
}

function caseLabel(caseRecord) {
  return `${caseRecord.task} · ${caseRecord.id.replaceAll('-', ' ')}`;
}

function renderCase(caseRecord) {
  const comparison = buildBeforeAfter(caseRecord, data.models);
  elements.beforeOutput.textContent = comparison.weak;
  elements.diagnosisOutput.textContent = comparison.diagnosis;
  elements.afterOutput.textContent = comparison.improved;
}

function populateCases() {
  elements.caseSelect.replaceChildren();
  data.cases.forEach((caseRecord) => {
    const option = document.createElement('option');
    option.value = caseRecord.id;
    option.textContent = caseLabel(caseRecord);
    elements.caseSelect.append(option);
  });

  if (data.cases[0]) renderCase(data.cases[0]);
}

function currentCase() {
  return data.cases.find((caseRecord) => caseRecord.id === elements.caseSelect.value) || data.cases[0];
}

function loadCaseIntoBuilder(caseRecord) {
  if (!caseRecord) return;

  $('#mode').value = caseRecord.mode || 'text-to-video';
  $('#use-case').value = ['product', 'cinematic', 'social', 'documentary', 'dialogue', 'multi-shot'].includes(caseRecord.task)
    ? caseRecord.task
    : caseRecord.mode === 'image-to-video'
      ? 'cinematic'
      : 'cinematic';
  $('#model').value = 'auto';

  const brief = caseRecord.input || '';
  const firstClause = brief.split(/[.;]/)[0].trim();
  $('#subject').value = firstClause;
  $('#environment').value = '';
  $('#trigger').value = '';
  $('#action').value = brief;
  $('#consequence').value = '';
  $('#camera').value = '';
  $('#light').value = '';
  $('#sound').value = caseRecord.required_ir?.includes('sound') ? 'Add only sounds caused by visible or clearly off-screen events.' : '';
  $('#continuity').value = 'Preserve every identity, prop, direction, and object-state constraint named in the brief.';
  $('#avoid').value = (caseRecord.risk_tags || []).join(', ');

  renderCompiler();
  document.querySelector('#builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFailure(failureId) {
  const failure = data.failures.find((item) => item.id === failureId) || data.failures[0];
  if (!failure) return;

  data.activeFailureId = failure.id;
  elements.failureSymptom.textContent = failure.symptom;
  elements.failureCause.textContent = failure.root_cause;
  elements.failureFix.textContent = failure.fix;
  elements.failureChange.textContent = failure.change_only;
  elements.failureTags.replaceChildren(...failure.risk_tags.map((tag) => createChip(tag, true)));

  $$('.failure-button').forEach((button) => {
    const active = button.dataset.failureId === failure.id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function populateFailures() {
  elements.failureMenu.replaceChildren();

  data.failures.forEach((failure) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'failure-button';
    button.dataset.failureId = failure.id;
    button.setAttribute('role', 'listitem');
    button.setAttribute('aria-pressed', 'false');
    button.textContent = failure.id.replaceAll('-', ' ');
    button.addEventListener('click', () => renderFailure(failure.id));
    elements.failureMenu.append(button);
  });

  if (data.failures[0]) renderFailure(data.failures[0].id);
}

function showToast(message) {
  const existing = $('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

async function copyText(value, successMessage = 'Copied') {
  const textValue = String(value || '');
  if (!textValue) return;

  try {
    await navigator.clipboard.writeText(textValue);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = textValue;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  showToast(successMessage);
}

function bindEvents() {
  elements.form.addEventListener('input', renderCompiler);
  elements.caseSelect.addEventListener('change', () => renderCase(currentCase()));
  elements.loadCase.addEventListener('click', () => loadCaseIntoBuilder(currentCase()));

  $('#copy-prompt').addEventListener('click', () => copyText(elements.promptOutput.textContent, 'Prompt copied'));
  $('#copy-ir').addEventListener('click', () => copyText(elements.irOutput.textContent, 'Video IR copied'));

  $$('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyText(button.dataset.copy, 'Install command copied'));
  });
}

function showLoadError(error) {
  console.error(error);
  elements.loadError.hidden = false;
  elements.loadError.innerHTML = [
    '<strong>Canonical data could not be loaded.</strong>',
    ' Do not open this page with <code>file://</code>.',
    ' From the repository root run <code>python -m http.server 8000</code>,',
    ' then open <code>http://localhost:8000/demo/</code>.',
  ].join('');
}

async function loadCanonicalData() {
  const [routerResponse, casesResponse, failuresResponse] = await Promise.all([
    fetch(DATA_PATHS.router),
    fetch(DATA_PATHS.cases),
    fetch(DATA_PATHS.failures),
  ]);

  const responses = [routerResponse, casesResponse, failuresResponse];
  const failed = responses.find((response) => !response.ok);
  if (failed) throw new Error(`Canonical data request failed with HTTP ${failed.status}`);

  const [routerPayload, casesPayload, failuresPayload] = await Promise.all([
    routerResponse.json(),
    casesResponse.json(),
    failuresResponse.json(),
  ]);

  data.models = Array.isArray(routerPayload.models) ? routerPayload.models : [];
  data.cases = Array.isArray(casesPayload.cases) ? casesPayload.cases : [];
  data.failures = Array.isArray(failuresPayload.failures) ? failuresPayload.failures : [];

  if (!data.models.length || !data.cases.length || !data.failures.length) {
    throw new Error('Canonical data loaded but one or more required collections are empty.');
  }
}

async function init() {
  bindEvents();

  try {
    await loadCanonicalData();
    populateModels();
    populateCases();
    populateFailures();
    renderCompiler();
  } catch (error) {
    showLoadError(error);
  }
}

init();

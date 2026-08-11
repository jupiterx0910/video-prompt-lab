"""Deterministic, zero-dependency regression checks for Video Prompt Lab v2.1."""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
ALLOWED_EVIDENCE = {"official-doc-informed", "field-tested", "heuristic"}
ALLOWED_MODES = {"text-to-video", "image-to-video"}
REQUIRED_TASKS = {
    "product",
    "cinematic",
    "social",
    "documentary",
    "image-to-video",
    "dialogue",
    "multi-shot",
}
ALLOWED_IR = {
    "subject",
    "environment",
    "props",
    "trigger",
    "action",
    "consequence",
    "camera",
    "light",
    "sound",
    "time",
    "continuity",
}
SKILL_INVARIANTS = {
    "Video IR": "Skill must normalize requests through Video IR.",
    "router/models.json": "Skill must consult the model router when model choice is open.",
    "explicit": "Skill must describe precedence for an explicitly requested model.",
    "preflight": "Skill must perform a preflight check before final output.",
    "diagnos": "Skill must diagnose failed generations before rewriting blindly.",
}


def load_json(relative: str, errors: list[str]) -> dict:
    path = ROOT / relative
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"missing JSON file: {relative}")
    except json.JSONDecodeError as exc:
        errors.append(f"invalid JSON in {relative}: line {exc.lineno}: {exc.msg}")
    return {}


def require_keys(record: dict, keys: set[str], label: str, errors: list[str]) -> None:
    missing = sorted(keys - record.keys())
    if missing:
        errors.append(f"{label} missing keys: {', '.join(missing)}")


def validate_router(errors: list[str]) -> tuple[dict[str, dict], set[str]]:
    data = load_json("router/models.json", errors)
    models = data.get("models", [])
    if not isinstance(models, list) or not models:
        errors.append("router/models.json must contain a non-empty models list")
        return {}, set()

    by_id: dict[str, dict] = {}
    capabilities: set[str] = set()
    for index, model in enumerate(models):
        label = f"router model #{index + 1}"
        if not isinstance(model, dict):
            errors.append(f"{label} must be an object")
            continue
        require_keys(
            model,
            {"id", "family", "strengths", "cautions", "prompt_emphasis", "evidence"},
            label,
            errors,
        )
        model_id = model.get("id")
        if not isinstance(model_id, str) or not model_id:
            errors.append(f"{label} has invalid id")
            continue
        if model_id in by_id:
            errors.append(f"duplicate router model id: {model_id}")
        by_id[model_id] = model

        strengths = model.get("strengths", [])
        if not isinstance(strengths, list) or not all(isinstance(x, str) and x for x in strengths):
            errors.append(f"router model {model_id} strengths must be a list of strings")
        else:
            capabilities.update(strengths)

        if model.get("evidence") not in ALLOWED_EVIDENCE:
            errors.append(f"router model {model_id} has invalid evidence level")

    if not data.get("policy", {}).get("explicit_model_wins"):
        errors.append("router policy must preserve explicit model choice")
    return by_id, capabilities


def validate_dataset(capabilities: set[str], errors: list[str]) -> None:
    data = load_json("dataset/cases.json", errors)
    cases = data.get("cases", [])
    if not isinstance(cases, list) or len(cases) < 7:
        errors.append("dataset/cases.json must contain at least 7 cases")
        return

    seen_ids: set[str] = set()
    seen_tasks: set[str] = set()
    for index, case in enumerate(cases):
        label = f"dataset case #{index + 1}"
        if not isinstance(case, dict):
            errors.append(f"{label} must be an object")
            continue
        require_keys(
            case,
            {"id", "task", "mode", "input", "required_ir", "risk_tags", "preferred_capabilities"},
            label,
            errors,
        )
        case_id = case.get("id")
        if not isinstance(case_id, str) or not case_id:
            errors.append(f"{label} has invalid id")
            continue
        if case_id in seen_ids:
            errors.append(f"duplicate dataset case id: {case_id}")
        seen_ids.add(case_id)
        seen_tasks.add(case.get("task"))

        if case.get("mode") not in ALLOWED_MODES:
            errors.append(f"dataset case {case_id} has unsupported mode: {case.get('mode')}")

        required_ir = set(case.get("required_ir", []))
        unknown_ir = sorted(required_ir - ALLOWED_IR)
        if unknown_ir:
            errors.append(f"dataset case {case_id} has unknown IR fields: {', '.join(unknown_ir)}")

        preferred = set(case.get("preferred_capabilities", []))
        unknown_caps = sorted(preferred - capabilities)
        if unknown_caps:
            errors.append(
                f"dataset case {case_id} asks for unknown capabilities: {', '.join(unknown_caps)}"
            )

    missing_tasks = sorted(REQUIRED_TASKS - seen_tasks)
    if missing_tasks:
        errors.append(f"dataset missing required task coverage: {', '.join(missing_tasks)}")


def validate_eval_cases(models: dict[str, dict], errors: list[str]) -> None:
    data = load_json("evals/cases.json", errors)
    cases = data.get("cases", [])
    if not isinstance(cases, list) or not cases:
        errors.append("evals/cases.json must contain cases")
        return

    seen_ids: set[str] = set()
    for index, case in enumerate(cases):
        label = f"eval case #{index + 1}"
        if not isinstance(case, dict):
            errors.append(f"{label} must be an object")
            continue
        case_id = case.get("id")
        if not case_id:
            errors.append(f"{label} has no id")
            continue
        if case_id in seen_ids:
            errors.append(f"duplicate eval case id: {case_id}")
        seen_ids.add(case_id)

        case_type = case.get("type")
        if case_type == "route":
            required = set(case.get("required_capabilities", []))
            candidates = case.get("expected_candidates", [])
            if not required or not candidates:
                errors.append(f"route eval {case_id} needs required_capabilities and expected_candidates")
                continue
            matched = False
            for candidate in candidates:
                model = models.get(candidate)
                if model is None:
                    errors.append(f"route eval {case_id} references unknown model: {candidate}")
                    continue
                if required <= set(model.get("strengths", [])):
                    matched = True
            if not matched:
                errors.append(
                    f"route eval {case_id} has no expected candidate satisfying {sorted(required)}"
                )
        elif case_type == "prompt":
            prompt = case.get("prompt_fixture", "").lower()
            if not prompt:
                errors.append(f"prompt eval {case_id} has empty prompt_fixture")
                continue
            for term in case.get("required_terms", []):
                if term.lower() not in prompt:
                    errors.append(f"prompt eval {case_id} missing required term: {term}")
            for term in case.get("forbidden_terms", []):
                if term.lower() in prompt:
                    errors.append(f"prompt eval {case_id} contains forbidden term: {term}")
        else:
            errors.append(f"eval case {case_id} has unsupported type: {case_type}")


def validate_skill(errors: list[str]) -> None:
    path = ROOT / "SKILL.md"
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        errors.append("missing SKILL.md")
        return

    lowered = text.lower()
    for token, message in SKILL_INVARIANTS.items():
        if token.lower() not in lowered:
            errors.append(message)


def main() -> int:
    errors: list[str] = []
    models, capabilities = validate_router(errors)
    validate_dataset(capabilities, errors)
    validate_eval_cases(models, errors)
    validate_skill(errors)

    if errors:
        print("Eval failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "Eval passed: "
        f"{len(models)} model profiles, "
        f"{len(capabilities)} capability tags, "
        "dataset coverage and Skill invariants valid."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

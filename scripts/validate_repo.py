"""Small zero-dependency integrity check for Video Prompt Lab."""

from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "README_EN.md",
    "SKILL.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "docs/prompt-engineering.md",
    "docs/model-adaptation.md",
    "docs/prompt-compiler-v2.md",
    "docs/failure-diagnosis.md",
    "router/models.json",
    "router/README.md",
    "dataset/cases.json",
    "dataset/failures.json",
    "dataset/README.md",
    "evals/README.md",
    "evals/cases.json",
    "evals/run_evals.py",
    "evals/scoring.md",
    "references/camera-language.md",
    "references/motion-continuity.md",
    "references/lighting-color.md",
    "references/sound-design.md",
    "references/negative-prompts.md",
    "templates/text-to-video.md",
    "templates/image-to-video.md",
    "templates/multi-shot-story.md",
    "templates/social-video.md",
    "templates/product-film.md",
    "examples/README.md",
]

FAILURE_REQUIRED_FIELDS = {
    "id",
    "symptom",
    "root_cause",
    "fix",
    "change_only",
    "risk_tags",
}


def validate_failure_taxonomy(errors: list[str]) -> None:
    path = ROOT / "dataset/failures.json"
    if not path.is_file():
        return

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return

    failures = payload.get("failures")
    if not isinstance(failures, list) or len(failures) < 6:
        errors.append("dataset/failures.json must contain at least 6 failure records")
        return

    seen_ids: set[str] = set()
    for index, failure in enumerate(failures):
        if not isinstance(failure, dict):
            errors.append(f"dataset/failures.json failure #{index + 1} must be an object")
            continue

        missing = FAILURE_REQUIRED_FIELDS - failure.keys()
        if missing:
            errors.append(
                f"dataset/failures.json failure #{index + 1} missing fields: "
                + ", ".join(sorted(missing))
            )
            continue

        failure_id = failure.get("id")
        if not isinstance(failure_id, str) or not failure_id.strip():
            errors.append(f"dataset/failures.json failure #{index + 1} has empty id")
        elif failure_id in seen_ids:
            errors.append(f"dataset/failures.json duplicate failure id: {failure_id}")
        else:
            seen_ids.add(failure_id)

        for field in ("symptom", "root_cause", "fix", "change_only"):
            value = failure.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(
                    f"dataset/failures.json failure {failure_id or index + 1} has empty {field}"
                )

        risk_tags = failure.get("risk_tags")
        if (
            not isinstance(risk_tags, list)
            or not risk_tags
            or any(not isinstance(tag, str) or not tag.strip() for tag in risk_tags)
        ):
            errors.append(
                f"dataset/failures.json failure {failure_id or index + 1} must have non-empty risk_tags"
            )


def main() -> int:
    errors: list[str] = []
    for relative in REQUIRED:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"missing required file: {relative}")
        elif path.stat().st_size < 80:
            errors.append(f"file is unexpectedly small: {relative}")

    for folder in ("router", "dataset", "evals"):
        directory = ROOT / folder
        if not directory.exists():
            continue
        for path in directory.rglob("*.json"):
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                errors.append(
                    f"invalid JSON in {path.relative_to(ROOT)}: line {exc.lineno}: {exc.msg}"
                )

    validate_failure_taxonomy(errors)

    markdown_files = list(ROOT.rglob("*.md"))
    link_pattern = re.compile(r"\[[^\]]+\]\((?!https?://|#|mailto:)([^)]+)\)")
    for path in markdown_files:
        text = path.read_text(encoding="utf-8")
        for target in link_pattern.findall(text):
            clean_target = target.split("#", 1)[0]
            if not clean_target:
                continue
            resolved = (path.parent / clean_target).resolve()
            if not resolved.exists():
                errors.append(f"broken local link in {path.relative_to(ROOT)}: {target}")

    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"Validation passed: {len(REQUIRED)} required files, "
        f"{len(markdown_files)} Markdown files, JSON parsed successfully."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

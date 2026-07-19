"""Small zero-dependency integrity check for Video Prompt Lab."""

from pathlib import Path
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


def main() -> int:
    errors: list[str] = []
    for relative in REQUIRED:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"missing required file: {relative}")
        elif path.stat().st_size < 80:
            errors.append(f"file is unexpectedly small: {relative}")

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

    print(f"Validation passed: {len(REQUIRED)} required files, {len(markdown_files)} Markdown files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

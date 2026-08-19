import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skill"

manifest = json.loads((SKILL / "manifest.json").read_text(encoding="utf-8"))
assert manifest["name"] == "video-prompt-compiler"
assert manifest["version"] == "2.4.0"
assert manifest["entry"] == "SKILL.md"
assert (SKILL / manifest["entry"]).exists()

for ref in manifest["references"]:
    path = SKILL / ref
    assert path.exists(), f"missing reference: {ref}"
    assert path.read_text(encoding="utf-8").strip(), f"empty reference: {ref}"

assert len(manifest["capabilities"]) >= 5
assert len(manifest["models"]) == 5
print("Skill validation passed")

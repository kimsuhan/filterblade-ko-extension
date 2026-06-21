import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT_JS = ROOT / "filterblade-ko-extension" / "content.js"
DICTIONARY_JSON = ROOT / "docs" / "poe2_item_name_dictionary.json"


def load_dictionary():
    data = json.loads(DICTIONARY_JSON.read_text(encoding="utf-8"))
    glossary = {}
    for row in data["records"]:
        english = row["english"].strip()
        korean = row["korean"].strip()
        if english and korean and english != korean:
            glossary[english] = korean
    return glossary


def js_unescape(value):
    return json.loads(f'"{value}"')


def extract_literal_pairs():
    source = CONTENT_JS.read_text(encoding="utf-8")
    pair_pattern = re.compile(
        r'"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"|'
        r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\]'
    )

    for match in pair_pattern.finditer(source):
        if match.group(1) is not None:
            yield js_unescape(match.group(1)), js_unescape(match.group(2))
        else:
            yield js_unescape(match.group(3)), js_unescape(match.group(4))


def main():
    glossary = load_dictionary()
    conflicts = []
    covered = []

    for english, korean in extract_literal_pairs():
        official = glossary.get(english)
        if not official:
            continue
        if korean != official:
            conflicts.append((english, korean, official))
        else:
            covered.append(english)

    if conflicts:
        print("POE2DB item-name conflicts found:")
        for english, current, official in conflicts:
            print(f"- {english}: current={current!r}, official={official!r}")
        raise SystemExit(1)

    print(f"ok: {len(covered)} hard-coded item translations match POE2DB")


if __name__ == "__main__":
    main()

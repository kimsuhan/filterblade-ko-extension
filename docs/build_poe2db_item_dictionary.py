import csv
import json
import re
import time
import urllib.parse
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path


BASE_URL = "https://poe2db.tw"
ITEMS_URL = f"{BASE_URL}/kr/Items"
OUT_DIR = Path(__file__).resolve().parent
JSON_OUT = OUT_DIR / "poe2_item_name_dictionary.json"
CSV_OUT = OUT_DIR / "poe2_item_name_dictionary.csv"

DIRECT_CATEGORY_SLUGS = {
    "Unique_item",
    "Gem",
    "Skill_Gems",
    "Support_Gems",
    "Spirit_Gems",
    "Lineage_Supports",
    "Meta_Skill_Gem",
    "Flasks",
    "Essence",
    "Splinter",
    "Catalysts",
    "Liquid_Emotions",
    "Strongbox",
    "Hideout",
}

CATEGORY_ALIASES = {
    "Expedition_Logbooks": "Expedition_Logbook",
}

SKIP_SLUGS = {
    "",
    "Items",
    "marked",
    "patreon",
    "passive-skill-tree",
    "atlas-skill-tree",
}


@dataclass
class Anchor:
    attrs: dict
    text: str


class AnchorParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._attrs = None
        self._text = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._attrs = dict(attrs)
            self._text = []

    def handle_data(self, data):
        if self._attrs is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self._attrs is not None:
            text = re.sub(r"\s+", " ", "".join(self._text)).strip()
            self.links.append(Anchor(self._attrs, text))
            self._attrs = None
            self._text = []


def fetch(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "POE2-FilterBlade-KO-Dictionary/0.1 (+local translation aid)"
        },
    )
    last_error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code == 404:
                raise
        except urllib.error.URLError as exc:
            last_error = exc
        time.sleep(0.5 * (attempt + 1))
    raise last_error


def parse_links(html):
    parser = AnchorParser()
    parser.feed(html)
    return parser.links


def normalize_slug(href):
    if not href:
        return None

    href = urllib.parse.unquote(href.split("#", 1)[0].split("?", 1)[0])
    if href.startswith("http://") or href.startswith("https://"):
        return None
    if href.startswith("/kr/") or href.startswith("/us/"):
        href = href[4:]
    elif href.startswith("/"):
        return None

    href = href.strip("/")
    return None if href in SKIP_SLUGS else href


def get_categories():
    html = fetch(ITEMS_URL)
    categories = []
    seen = set()

    for link in parse_links(html):
        slug = normalize_slug(link.attrs.get("href"))
        if not slug or slug in seen:
            continue

        classes = link.attrs.get("class", "")
        if "ItemClasses" in classes or slug in DIRECT_CATEGORY_SLUGS:
            categories.append(
                {
                    "slug": slug,
                    "label_kr": link.text or slug.replace("_", " "),
                }
            )
            seen.add(slug)

    return categories


def is_item_name_link(link, category_slug):
    text = link.text.strip()
    if not text:
        return False

    classes = link.attrs.get("class", "")
    data_hover = link.attrs.get("data-hover", "")
    href = link.attrs.get("href", "")
    if not normalize_slug(href):
        return False

    if category_slug == "Unique_item":
        return "UniqueItem" in classes

    if category_slug in {
        "Gem",
        "Skill_Gems",
        "Support_Gems",
        "Spirit_Gems",
        "Lineage_Supports",
        "Meta_Skill_Gem",
    }:
        return bool(re.search(r"\bgem_(red|green|blue)\b", classes))

    if "BlightCraftingItems" in classes:
        return False

    if "whiteitem" in classes or "item_currency" in classes:
        return True

    return "BaseItemTypes" in data_hover and (
        "whiteitem" in classes or "item_currency" in classes
    )


def extract_page_items(lang, category_slug):
    fetch_slug = CATEGORY_ALIASES.get(category_slug, category_slug)
    url = f"{BASE_URL}/{lang}/{fetch_slug}"
    html = fetch(url)
    items = {}

    for link in parse_links(html):
        if not is_item_name_link(link, category_slug):
            continue

        slug = normalize_slug(link.attrs.get("href"))
        if not slug:
            continue

        items.setdefault(
            slug,
            {
                "name": link.text,
                "class": link.attrs.get("class", ""),
                "data_hover": link.attrs.get("data-hover", ""),
            },
        )

    return items


def infer_kind(classes, category_slug):
    if category_slug == "Unique_item" or "UniqueItem" in classes:
        return "unique"
    if category_slug.endswith("Gems") or category_slug in {"Gem", "Meta_Skill_Gem"}:
        return "gem"
    if "item_currency" in classes or category_slug in {
        "Stackable_Currency",
        "Essence",
        "Splinter",
        "Catalysts",
        "Liquid_Emotions",
    }:
        return "currency"
    return "item"


def build_dictionary():
    categories = get_categories()
    records = []
    skipped = []
    seen = set()

    for category in categories:
        slug = category["slug"]
        try:
            kr_items = extract_page_items("kr", slug)
            us_items = extract_page_items("us", slug)
        except Exception as exc:
            skipped.append({"category_slug": slug, "reason": repr(exc)})
            continue

        for item_slug in sorted(set(kr_items) & set(us_items)):
            kr = kr_items[item_slug]
            us = us_items[item_slug]
            key = (us["name"], kr["name"], item_slug)
            if key in seen:
                continue
            seen.add(key)

            records.append(
                {
                    "english": us["name"],
                    "korean": kr["name"],
                    "kind": infer_kind(us["class"], slug),
                    "category_slug": slug,
                    "category_kr": category["label_kr"],
                    "item_slug": item_slug,
                    "poe2db_us": f"{BASE_URL}/us/{urllib.parse.quote(item_slug)}",
                    "poe2db_kr": f"{BASE_URL}/kr/{urllib.parse.quote(item_slug)}",
                }
            )

        time.sleep(0.08)

    records.sort(key=lambda row: (row["kind"], row["category_slug"], row["english"]))
    return categories, records, skipped


def write_outputs():
    categories, records, skipped = build_dictionary()
    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    payload = {
        "generated_at": generated_at,
        "source": {
            "items_index": ITEMS_URL,
            "language_pairs": ["us", "kr"],
            "note": "Names only. Numeric item stats and descriptions are intentionally excluded.",
        },
        "counts": {
            "records": len(records),
            "categories_seen": len(categories),
            "categories_skipped": len(skipped),
        },
        "skipped": skipped,
        "records": records,
    }

    JSON_OUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    with CSV_OUT.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "english",
                "korean",
                "kind",
                "category_slug",
                "category_kr",
                "item_slug",
                "poe2db_us",
                "poe2db_kr",
            ],
        )
        writer.writeheader()
        writer.writerows(records)

    print(f"records={len(records)}")
    print(f"categories={len(categories)} skipped={len(skipped)}")
    print(f"json={JSON_OUT}")
    print(f"csv={CSV_OUT}")
    if skipped:
        print("skipped:")
        for row in skipped:
            print(f"- {row['category_slug']}: {row['reason']}")


if __name__ == "__main__":
    write_outputs()

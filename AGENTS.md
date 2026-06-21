# AGENTS.md

## Project Goal

This repository contains a Chrome extension that translates the FilterBlade Path of Exile 2 UI into Korean.

The extension should prioritize practical readability for Korean PoE2 players while preserving official item names and filter-rule meaning.

## Core Translation Rules

- Path of Exile 2 item names must follow `docs/poe2_item_name_dictionary.json`.
- The generated extension dictionary `filterblade-ko-extension/poe2-item-names.js` must remain higher priority than hand-written UI translations.
- Before adding a hand-written item translation, check whether the English name already exists in the POE2DB-based dictionary.
- Do not translate filter syntax or debug-like rule code when it is shown as raw rule details, such as `SetFontSize`, `SetTextColor`, `BaseType == ...`, `Entry ID`, or `Priority`.
- Translate user-facing labels, cards, hover tooltips, and guidance text.

## Terminology

Use `docs/translation_terms.json` as the source of truth for repeated UI terms.

Do not duplicate the term list in this file. Update `docs/translation_terms.json` when terminology changes, then run the validation script.

## UI Behavior

- Strictness labels should use two lines when helpful, for example Korean on the first line and the English label on the second line.
- Long translated explanations should add line breaks after sentence endings for readability.
- Short metadata lines should not be force-broken. Examples: `분류`, `베이스 타입`, `지도 아이콘`, `빛기둥`, `사운드`, `화폐 등급`.
- Tooltip text can be split into multiple DOM text nodes. Add translations for both full sentences and smaller label/value fragments when needed.
- Be careful with partial replacements. Do not allow short words like `here` to alter unrelated words such as `There`.

## Validation

After changing translations, run:

```powershell
python docs/validate_extension_translations.py
```

The validation must pass both checks:

- hard-coded item translations match the POE2DB dictionary
- Korean UI terminology is consistent

Also run a JavaScript syntax check on changed extension scripts when possible:

```powershell
node --check filterblade-ko-extension/content.js
node --check filterblade-ko-extension/poe2-item-names.js
```

## Updating The Item Dictionary

- Use `docs/build_poe2db_item_dictionary.py` to rebuild the POE2DB item-name dictionary.
- The dictionary is for names only. Do not add item stats, requirements, or long descriptions.
- If POE2DB has unavailable pages, document the skipped categories in `docs/README.md`.
- Regenerate `filterblade-ko-extension/poe2-item-names.js` from `docs/poe2_item_name_dictionary.json` after dictionary updates.

## Extension Versioning

- Bump `filterblade-ko-extension/manifest.json` whenever extension behavior or translations change.
- Keep the version increment small and sequential.

## Git Hygiene

- Keep `_workspace/` ignored; it is for local analysis artifacts.
- Do not commit local machine absolute paths.
- Before committing, check the working tree and validation results.

# AGENTS.md

## 작업 지침

- FilterBlade 번역에서 Path of Exile 2 아이템명은 반드시 `docs/poe2_item_name_dictionary.json`의 POE2DB 공식 한국어명을 기준으로 한다.
- 새 아이템명 번역을 수동으로 추가하기 전에 먼저 사전에 같은 영문명이 있는지 확인한다.
- 수동 번역을 추가하거나 수정한 뒤에는 아래 검사를 실행해 POE2DB 사전과 충돌하지 않는지 확인한다.

```powershell
& 'C:\Users\k_yak\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' docs\validate_extension_translations.py
```

- 확장 프로그램에서는 `filterblade-ko-extension/poe2-item-names.js`의 사전 번역이 수동 UI 번역보다 우선되어야 한다.
- 반복 UI 용어는 `docs/translation_terms.json`을 기준으로 통일한다. 특히 `beam`은 `빛기둥`, `tier`는 `등급`, `value-tier`는 `표시 등급`, `currency tier`는 `화폐 등급`으로 번역한다.

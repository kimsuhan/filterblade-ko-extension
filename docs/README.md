# POE2 아이템 이름 사전

FilterBlade 한국어 번역에 활용하기 위한 Path of Exile 2 아이템 이름 사전입니다.

## 파일

- `poe2_item_name_dictionary.json`: 확장 프로그램이나 스크립트에서 쓰기 쉬운 JSON 사전
- `poe2_item_name_dictionary.csv`: 사람이 확인하기 쉬운 CSV 사전
- `build_poe2db_item_dictionary.py`: POE2DB에서 사전을 다시 생성하는 스크립트
- `validate_extension_translations.py`: 확장 프로그램의 수동 아이템 번역이 POE2DB 사전과 충돌하는지 검사하는 스크립트
- `translation_terms.json`: FilterBlade UI 번역에서 반복 사용할 표준 용어 사전

## 포함한 정보

상세 능력치, 요구 레벨, 설명문은 넣지 않았습니다. 번역에 필요한 이름 정보만 남겼습니다.

- 영문명
- 한국어명
- 종류: 일반 아이템, 고유 아이템, 젬, 화폐
- POE2DB 카테고리
- POE2DB 영어/한국어 링크

## 출처와 생성 방식

출처는 POE2DB의 한국어/영어 아이템 페이지입니다.

- 한국어 아이템 인덱스: https://poe2db.tw/kr/Items
- 영어 아이템 인덱스: https://poe2db.tw/us/Items

생성 스크립트는 한국어와 영어 페이지에서 같은 아이템 URL 슬러그를 가진 항목을 짝지어 `english -> korean` 형태로 저장합니다.

## 현재 수집 상태

현재 생성된 사전은 3,697개 이름 레코드를 포함합니다.

POE2DB 메뉴에는 있으나 생성 시점에 페이지가 열리지 않아 제외된 카테고리:

- `Misc_Map_Items`: POE2DB가 404 응답

`Expedition_Logbooks` 메뉴 링크는 생성 시점에 404를 응답했지만, 실제 단수형 페이지인 `Expedition_Logbook`으로 대체 수집했습니다.

## 확장 프로그램 반영

`filterblade-ko-extension/poe2-item-names.js`는 이 JSON 사전에서 생성한 확장용 파일입니다. 아이템명은 성능을 위해 문장 안 부분 치환이 아니라, 화면 문구 전체가 아이템명과 정확히 같을 때만 번역합니다.

수동 번역을 추가하거나 고친 뒤에는 아래 검사를 실행해 POE2DB 공식 아이템명과 충돌하지 않는지 확인합니다.

```powershell
& 'C:\Users\k_yak\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' docs\validate_extension_translations.py
```

검사는 UI 용어 일관성도 함께 확인합니다. 예를 들어 `beam`은 `빛기둥`, `tier`는 `등급`, `value-tier`는 `표시 등급`, `currency tier`는 `화폐 등급`으로 맞춥니다.

(() => {
  const DEFAULT_ENABLED = true;
  const TRANSLATED_ATTR = "data-filterblade-ko-original";
  const WHITE_SPACE_ATTR = "data-filterblade-ko-original-white-space";
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);
  const originalTextNodes = new WeakMap();
  const itemNameTranslations = new Map(Object.entries(window.POE2_KO_ITEM_NAMES || {}));

  const exactTranslations = new Map(Object.entries({
    "FilterBlade": "FilterBlade",
    "FAQ": "자주 묻는 질문",
    "Profile": "프로필",
    "Settings": "설정",
    "ProfileName": "프로필 이름",
    "Logout": "로그아웃",
    "loading...": "불러오는 중...",
    "Back to My Filters": "내 필터로 돌아가기",
    "Reset filter": "필터 초기화",
    "MY FILTERS": "내 필터",
    "OVERVIEW": "개요",
    "CUSTOMIZE": "커스터마이즈",
    "SIMULATE": "시뮬레이션",
    "THEMES": "테마",
    "ADVANCED": "고급",
    "EXPORT TO POE": "PoE로 내보내기",
    "Checking for filter to load... Please wait...": "불러올 필터를 확인하는 중입니다... 잠시만 기다려 주세요...",
    "Load Auto-Save?": "자동 저장본을 불러올까요?",
    "Okay": "확인",
    "Okay!": "확인!",
    "No, thanks": "아니요",
    "Filter loaded via sharing link!": "공유 링크로 필터를 불러왔습니다!",
    "Sound files download:": "사운드 파일 다운로드:",
    "# Base filter": "# 기본 필터",
    "STRICTNESS - how much the filter hides": "엄격도 - 필터가 숨기는 아이템 수",
    "Customize Strictness": "엄격도 커스터마이즈",
    "Global Filter Style": "전체 필터 스타일",
    "Change the visual style and sounds of the base filter": "기본 필터의 시각 스타일과 사운드를 변경합니다",
    "Modules": "모듈",
    "More info": "자세히 보기",
    "here": "여기",
    "Your base filter": "기본 필터",
    "Tierlists:": "티어 목록:",
    "Softcore": "소프트코어",
    "Strictness:": "엄격도:",
    "Semi-Strict": "준엄격\nSemi-Strict",
    "Visuals:": "비주얼:",
    "Normal": "일반",
    "Quick-Start Build Wizard": "빠른 시작 빌드 마법사",
    "Getting started": "시작하기",
    "Save & Export": "저장 및 내보내기",
    "Safely": "안전하게",
    "Loot Generator": "전리품 생성기",
    "Import Item from PoE Item Builder": "PoE 아이템 빌더에서 아이템 가져오기",
    "Generate loot": "전리품 생성",
    "Generate valuable loot": "가치 있는 전리품 생성",
    "Zone Level:": "지역 레벨:",
    "Change loot pile background image": "전리품 더미 배경 이미지 변경",
    "Config": "설정",
    "Click an Item above to edit.": "수정하려면 위의 아이템을 클릭하세요.",
    "Decorators": "장식 요소",
    "What are Decorators?": "장식 요소란?",
    "Showcase Item": "아이템 미리보기",
    "Legacy Global Color&Sound Editors": "기존 전체 색상 및 사운드 편집기",
    "Global Visual Edits": "전체 비주얼 편집",
    "My Modules": "내 모듈",
    "Review changes": "변경 사항 검토",
    "Execute": "실행",
    "About the filter": "필터 정보",
    "Compare Strictness": "엄격도 비교",
    "Compare Styles": "스타일 비교",
    "Filter Line Translator": "필터 줄 번역기",
    "Filter Structure": "필터 구조",
    "Test Local Filter": "로컬 필터 테스트",
    "Upload Local Filter": "로컬 필터 업로드",
    "WARNING:": "경고:",
    "Expect bugs!": "오류가 발생할 수 있습니다!",
    "I understand": "이해했습니다",
    "Up- or Download your Save-File": "저장 파일 업로드 또는 다운로드",
    "Download current saveFile": "현재 저장 파일 다운로드",
    "Load filter from saveFile": "저장 파일에서 필터 불러오기",
    "Upload Option File": "옵션 파일 업로드",
    "Go Back": "돌아가기",
    "Create new filter": "새 필터 만들기",
    "Create new module": "새 모듈 만들기",
    "1 Config": "1 설정",
    "2 Export": "2 내보내기",
    "3 Finish": "3 완료",
    "## Please wait...": "## 잠시만 기다려 주세요...",
    "Premium feature": "프리미엄 기능",
    "Recommended": "추천",
    "Download": "다운로드",
    "Individual files": "개별 파일",
    "SUPPORT US": "후원하기",
    "About us": "소개",
    "# Welcome to FilterBlade!": "# FilterBlade에 오신 것을 환영합니다!",
    "### Our new design!": "### 새로운 디자인!",
    "### Intro": "### 소개",
    "### How to use?": "### 사용 방법",
    "### Customize": "### 커스터마이즈",
    "### Download / Export": "### 다운로드 / 내보내기",
    "### Did I break it?": "### 망가뜨린 건가요?",
    "### Learn and see": "### 배우고 확인하기",
    "### Test & Simulate": "### 테스트 및 시뮬레이션",
    "### How to update?": "### 업데이트 방법",
    "### Do a redesign!": "### 새 디자인 만들기",
    "### Need help?": "### 도움이 필요하신가요?",
    "Filter Overview": "필터 개요",
    "Switch view": "보기 전환",
    "Customizer Author:": "커스터마이저 작성자:",
    "Customizer Version:": "커스터마이저 버전:",
    "Contact": "문의",
    "Privacy Policy": "개인정보 처리방침",
    "COMMON CURRENCIES": "일반 화폐",
    "MID-TIER CURRENCY": "중간급 화폐",
    "RARE CURRENCY": "희귀 화폐",
    "RUNES OF ALDUR DROPS": "알두르 룬 드롭",
    "GOLD": "골드",
    "Orb of Transmutation": "진화의 오브",
    "Orb of Augmentation": "확장의 오브",
    "Scroll of Wisdom": "감정 주문서",
    "Orb of Alchemy": "연금술의 오브",
    "Vaal Orb": "바알 오브",
    "Lesser Jeweller's Orb": "하위 쥬얼러 오브",
    "Greater Jeweller's Orb": "상위 쥬얼러 오브",
    "Orb of Annulment": "소멸의 오브",
    "Chaos Orb": "카오스 오브",
    "Exalted Orb": "엑잘티드 오브",
    "Divine Orb": "신성한 오브",
    "Regal Orb": "제왕의 오브",
    "Mirror of Kalandra": "칼란드라의 거울",
    "Cryptic Key": "난해한 열쇠",
    "Exceptional Verisium": "특출난 베리시움",
    "Ornate Wombgift": "화려한 움브기프트",
    "Conductive Runes": "전도성 룬",
    "30x Gold": "골드 30개",
    "100x Gold": "골드 100개",
    "3100x Gold": "골드 3100개",
    "5000x Gold": "골드 5000개",
    "NEVERSINK SC": "NEVERSINK SC",
    "NEVERSINK STABLE": "NEVERSINK STABLE",
    "AUTO-ADJUST FOR BUILD (NEW!)": "빌드에 맞춰 자동 조정 (신규!)",
    "NOTABLE DROPS": "주요 드롭",
    "TOP-VALUE ITEMS": "최고 가치 아이템",
    "UNIQUE ITEMS": "고유 아이템",
    "SOMETIMES LUCKY": "운이 좋으면",
    "TABLETS": "서판",
    "SPLINTERS": "파편",
    "SKILL GEMS": "스킬 젬",
    "WAYSTONES": "경로석",
    "ENDGAME WAYSTONES": "엔드게임 경로석",
    "WAYSTONE UPGRADES!": "경로석 등급 상승!",
    "RARE ITEMS (ENDGAME)": "희귀 아이템 (엔드게임)",
    "RARE ITEMS PROGRESSION": "희귀 아이템 진행도",
    "RARE ITEM RANKING": "희귀 아이템 등급",
    "RINGS, AMULETS, BELTS": "반지, 목걸이, 허리띠",
    "ITEMLEVEL 82": "아이템 레벨 82",
    "RARE & MAGIC ITEMS - HIGH TIER": "희귀 및 마법 아이템 - 고티어",
    "HIGHER TIER: RARE": "상위 티어: 희귀",
    "HIGHER TIER: MAGIC": "상위 티어: 마법",
    "OTHERS BASES": "기타 베이스",
    "OTHER BASES": "기타 베이스",
    "CRAFTING BASES": "제작 베이스",
    "CHANCING BASES": "기회의 오브 베이스",
    "JEWELS": "주얼",
    "CHARMS (ENDGAME)": "호신부 (엔드게임)",
    "FLASKS (ENDGAME)": "플라스크 (엔드게임)",
    "CAMPAIGN AND LEVELING": "캠페인 및 레벨링",
    "LEVELING CURRENCY": "레벨링 화폐",
    "CAMPAIGN SPECIFIC RULE": "캠페인 전용 규칙",
    "LEVELING FLASKS": "레벨링 플라스크",
    "OVERLEVELING ITEMS": "레벨 초과 아이템",
    "SOFT": "낮음\nSoft",
    "REGULAR": "일반\nNormal",
    "STRICT": "엄격\nStrict",
    "VERY STRICT": "매우 엄격\nVery Strict",
    "UBER STRICT": "극엄격\nUber Strict",
    "UBER+1 STRICT": "극엄격+1\nUber+1 Strict",
    "Soft": "낮음\nSoft",
    "Regular": "일반\nNormal",
    "Strict": "엄격\nStrict",
    "Very Strict": "매우 엄격\nVery Strict",
    "Uber Strict": "극엄격\nUber Strict",
    "Uber+1 Strict": "극엄격+1\nUber+1 Strict",
    "Uncut Skill Gem": "미가공 스킬 젬",
    "Uncut Spirit Gem": "미가공 정신력 젬",
    "Uncut Support Gem": "미가공 보조 젬",
    "Waystone": "경로석",
    "5x Breach Splinter": "균열 파편 5개",
    "2x Breach Splinter": "균열 파편 2개",
    "RIGHT-CLICK FOR MORE OPTIONS.": "추가 옵션은 우클릭하세요.",
    "HOLD SHIFT FOR ALL STATS.": "전체 정보는 Shift를 누르세요.",
    "Right-click for more options.": "추가 옵션은 우클릭하세요.",
    "Hold Shift for all stats.": "전체 정보는 Shift를 누르세요.",
    "Class:": "분류:",
    "CLASS:": "분류:",
    "Stackable Currency": "중첩 가능 화폐",
    "STACKABLE CURRENCY": "중첩 가능 화폐",
    "CLASS: STACKABLE CURRENCY": "분류: 중첩 가능 화폐",
    "BaseType:": "베이스 타입:",
    "BASETYPE:": "베이스 타입:",
    "BASETYPE: ORB OF TRANSMUTATION": "베이스 타입: 진화의 오브",
    "BASETYPE: ORB OF AUGMENTATION": "베이스 타입: 확장의 오브",
    "BASETYPE: ORB OF ALCHEMY": "베이스 타입: 연금술의 오브",
    "BASETYPE: VAAL ORB": "베이스 타입: 바알 오브",
    "BASETYPE: CHAOS ORB": "베이스 타입: 카오스 오브",
    "BASETYPE: EXALTED ORB": "베이스 타입: 엑잘티드 오브",
    "BASETYPE: DIVINE ORB": "베이스 타입: 신성한 오브",
    "HIDDEN STARTING WITH VERY STRICT": "매우 엄격부터 숨김",
    "HIDDEN STARTING WITH UBER STRICT": "극엄격부터 숨김",
    "HIDDEN STARTING WITH UBER+1 STRICT": "극엄격+1부터 숨김",
    "Hidden starting with": "숨김 시작 엄격도",
    "HIDDEN STARTING WITH": "숨김 시작 엄격도",
    "MapIcon:": "지도 아이콘:",
    "MAPICON:": "지도 아이콘:",
    "Small Grey Circle": "작은 회색 원",
    "SMALL GREY CIRCLE": "작은 회색 원",
    "Beam:": "빔:",
    "BEAM:": "빔:",
    "White Temp": "임시 흰색",
    "WHITE TEMP": "임시 흰색",
    "Current": "현재",
    "CURRENT": "현재",
    "Tier 6": "티어 6",
    "TIER 6": "티어 6",
    "BASED ON THIS RULE IN THE FILTER:": "필터의 이 규칙을 기준으로 표시:",
    "Based on this rule in the filter:": "필터의 이 규칙을 기준으로 표시:",
    "CURRENCY TIER 6": "화폐 티어 6"
  }));

  const phraseTranslations = [
    ["Please consider supporting us by disabling AdBlock.", "광고 차단기를 끄고 저희를 후원해 주세요."],
    ["This page is auto generated with JavaScript.", "이 페이지는 JavaScript로 자동 생성됩니다."],
    ["YOU NEED TO HAVE JAVASCRIPT ENABLED TO USE THIS SITE.", "이 사이트를 사용하려면 JavaScript를 활성화해야 합니다."],
    ["If you want to delete these auto-saved changes, click on 'Reset filter'", "자동 저장된 변경 사항을 삭제하려면 '필터 초기화'를 클릭하세요."],
    ["Add modular changes that modify the filter appearance, sounds and filtering.", "필터의 외형, 사운드, 필터링을 바꾸는 모듈식 변경 사항을 추가합니다."],
    ["Use the customize screen to implement more changes!", "더 많은 변경은 커스터마이즈 화면에서 적용하세요!"],
    ["The customizer is designed to be fail-proof.", "커스터마이저는 실수하기 어렵도록 설계되어 있습니다."],
    ["You don't have to worry about accidentally hiding uniques or 6-links or such.", "유니크나 6링크 같은 중요한 아이템을 실수로 숨길 걱정은 하지 않아도 됩니다."],
    ["edit the filter here.", "여기에서 필터를 편집하세요."],
    ["See the effects everywhere else on FilterBlade - instantly.", "변경 효과는 FilterBlade의 다른 화면에도 즉시 반영됩니다."],
    ["Create your own items and see how they look in the filter.", "직접 아이템을 만들고 필터에서 어떻게 보이는지 확인하세요."],
    ["Change reoccurring colors and sounds of the filter.", "필터에서 자주 쓰이는 색상과 사운드를 바꿉니다."],
    ["Quick edits that affect the whole filter", "전체 필터에 영향을 주는 빠른 편집"],
    ["Only use these tools if you know what you are doing.", "무엇을 하는지 알고 있을 때만 이 도구를 사용하세요."],
    ["Most users won't need to use any of them.", "대부분의 사용자는 이 기능을 사용할 필요가 없습니다."],
    ["Visualize every single change that you customized in the currently active filter.", "현재 활성 필터에서 커스터마이즈한 모든 변경 사항을 시각화합니다."],
    ["Clicking the buttons below will compare how your current filter will look like", "아래 버튼을 누르면 현재 필터가 어떻게 보일지 비교할 수 있습니다"],
    ["It will not actively change your current filter.", "현재 필터 자체를 실제로 변경하지는 않습니다."],
    ["For your day-to-day filter creator!", "평소 필터 제작에 쓰기 좋은 도구입니다!"],
    ["Upload Local Filter WARNING: This severely limits the functionality on FilterBlade:", "로컬 필터 업로드 경고: 이 기능은 FilterBlade의 기능을 크게 제한합니다:"],
    ["You CAN test the uploaded filters in the loot simulator", "업로드한 필터는 전리품 시뮬레이터에서 테스트할 수 있습니다"],
    ["CAN'T reliably use the customizer with uploaded filters.", "업로드한 필터에서는 커스터마이저를 안정적으로 사용할 수 없습니다."],
    ["There WILL be bugs.", "오류가 발생할 수 있습니다."],
    ["This file contains your full FilterBlade filter and saveState.", "이 파일에는 전체 FilterBlade 필터와 저장 상태가 들어 있습니다."],
    ["Start customizing and head over to the 'Export to PoE' screen once you're done.", "커스터마이즈를 시작하고 완료되면 'PoE로 내보내기' 화면으로 이동하세요."],
    ["Start customizing and head over to the Advanced -> 'My Modules' once you're done.", "커스터마이즈를 시작하고 완료되면 고급 -> '내 모듈'로 이동하세요."],
    ["continuous automated updates & fixes", "지속적인 자동 업데이트 및 수정"],
    ["economy updates for tierlists of uniques, currency, etc.", "유니크, 화폐 등의 티어 목록 경제 업데이트"],
    ["support a small development team", "소규모 개발팀 후원"],
    ["one-time upload to your PoE account", "PoE 계정에 1회 업로드"],
    ["no manual import required", "수동 가져오기 불필요"],
    ["instantly available inGame", "게임 내에서 즉시 사용 가능"],
    ["manual file download", "수동 파일 다운로드"],
    ["no console support", "콘솔 미지원"],
    ["import to PoE via game files on your PC", "PC의 게임 파일을 통해 PoE로 가져오기"],
    ["Support the FilterBlade Dev-Team", "FilterBlade 개발팀 후원하기"],
    ["FilterBlade is an online editor for loot-filters for the games Path of Exile 1 and 2 based on NeverSink's filters.", "FilterBlade는 NeverSink 필터를 기반으로 Path of Exile 1과 2의 아이템 필터를 편집하는 온라인 도구입니다."],
    ["The base NeverSink filter is already solid.", "기본 NeverSink 필터는 이미 충분히 탄탄합니다."],
    ["You can do a quick setup using the options above", "위 옵션으로 빠르게 설정할 수 있습니다"],
    ["Edit every part of the filter: Colors, tierlists, sounds in a sorted structure.", "필터의 색상, 티어 목록, 사운드 등 모든 부분을 정리된 구조에서 편집하세요."],
    ["Every edit done is automatically saved", "모든 편집은 자동 저장됩니다"],
    ["Head to the export screen to save the filter", "필터를 저장하려면 내보내기 화면으로 이동하세요"],
    ["download a filter-file or upload it directly into your PoE account", "필터 파일을 다운로드하거나 PoE 계정에 직접 업로드할 수 있습니다"],
    ["You will see warnings if you're about to do something dangerous.", "위험한 작업을 하려 하면 경고가 표시됩니다."],
    ["There is also additional validation when exporting.", "내보내기 시 추가 검증도 진행됩니다."],
    ["Want to test your filter?", "필터를 테스트하고 싶으신가요?"],
    ["Verify your results?", "결과를 확인하고 싶으신가요?"],
    ["Check out our tools on the Simulate screen.", "시뮬레이션 화면의 도구를 확인해 보세요."],
    ["FilterBlade will ALWAYS give you the newest up-to-date filter.", "FilterBlade는 항상 최신 필터를 제공합니다."],
    ["Use the search bar at the top, check our FAQ, or ask in our Discord if you need help!", "도움이 필요하면 상단 검색창, FAQ, Discord를 이용하세요!"],
    ["Pro tip: You can right-click ANY item to jump directly into its customizer rule!", "팁: 아무 아이템이나 우클릭하면 해당 커스터마이저 규칙으로 바로 이동할 수 있습니다!"],
    ["This site is fan-made and not affiliated with Grinding Gear Games in any way.", "이 사이트는 팬 제작 사이트이며 Grinding Gear Games와 관련이 없습니다."],
    ["Tip: Right-clicking any item will jump directly to its rule inside the customizer!", "팁: 아무 아이템이나 우클릭하면 커스터마이저의 해당 규칙으로 바로 이동합니다!"],
    ["Tip: You can right-click ANY item to jump directly into its customizer rule!", "팁: 아무 아이템이나 우클릭하면 해당 커스터마이저 규칙으로 바로 이동할 수 있습니다!"],
    ["Basic supplies used to perform common operations. They're not worth much, but are important nonetheless. People frequently hide them or buy them in bulk.", "기본 제작에 쓰이는 재료입니다. 값어치는 크지 않지만 그래도 자주 필요합니다. 보통 숨기거나 대량으로 구매하는 경우가 많습니다."],
    ["Hover over the scroll above for more information! ( recommended for new players )", "위의 두루마리에 마우스를 올리면 더 많은 정보를 볼 수 있습니다! (신규 플레이어에게 추천)"],
    ["Rather common, but unless sold in bulk, not too expensive. Often used in basic crafting.", "꽤 흔한 편이며 대량 판매가 아니라면 비싸지 않습니다. 기본 제작에 자주 사용됩니다."],
    ["Their powerful effects aside high currencies act as trade goods for players. Chaos Orbs and Divine Orbs are pretty much the standard way to pay for most trades. These are desired drops and it's almost always recommended to pick them up.", "고급 화폐는 효과도 강하지만 플레이어 간 거래 수단으로도 쓰입니다. 카오스 오브와 신성한 오브는 대부분의 거래에서 표준 결제 수단입니다. 인기가 높은 드롭이라 거의 항상 줍는 것을 추천합니다."],
    ["Many items are undiscovered (we only know the names). These come with a new highlight. Keep the filter updated frequently, until we know more!", "아직 밝혀지지 않은 아이템이 많습니다(이름만 알려진 상태). 이런 아이템은 새 강조 표시가 적용됩니다. 더 많은 정보가 확인될 때까지 필터를 자주 업데이트하세요!"],
    ["You can find gold all throughout the game. Use it to shop at vendors or respec your skill tree.", "골드는 게임 전반에서 얻을 수 있습니다. 상점에서 물건을 사거나 스킬 트리를 초기화할 때 사용하세요."],
    ["Basic supplies used to perform common operations.", "기본 제작에 쓰이는 재료입니다."],
    ["They're not worth much, but are important nonetheless.", "값어치는 크지 않지만 그래도 자주 필요합니다."],
    ["People frequently hide them or buy them in bulk.", "보통 숨기거나 대량으로 구매하는 경우가 많습니다."],
    ["Rather common, but unless sold in bulk, not too expensive.", "꽤 흔한 편이며 대량 판매가 아니라면 비싸지 않습니다."],
    ["Often used in basic crafting.", "기본 제작에 자주 사용됩니다."],
    ["These are desired drops and it's almost always recommended to pick them up.", "인기가 높은 드롭이라 거의 항상 줍는 것을 추천합니다."],
    ["Use it to shop at vendors or respec your skill tree.", "상점에서 물건을 사거나 스킬 트리를 초기화할 때 사용하세요."],
    ["UBER+1 STRICT", "극엄격+1\nUber+1 Strict"],
    ["UBER STRICT", "극엄격\nUber Strict"],
    ["VERY STRICT", "매우 엄격\nVery Strict"],
    ["REGULAR", "일반\nNormal"],
    ["STRICT", "엄격\nStrict"],
    ["SOFT", "낮음\nSoft"],
    ["Tiering based on current softcore economy. Updated every 4 hours.", "현재 소프트코어 경제를 기준으로 티어를 매깁니다. 4시간마다 갱신됩니다."],
    ["Tiering based on last handmade update.", "마지막 수동 업데이트를 기준으로 티어를 매깁니다."],
    ["All top value items have the same white background and drop-sound. They also come with a red beam and a huge red star on the minimap. These items include top tier currencies, valuable uniques, great divination cards, reliquary keys and everything else that is worth a LOT.", "최고가 아이템은 모두 흰색 배경과 같은 드롭 사운드를 사용합니다. 빨간 빔과 미니맵의 큰 빨간 별도 함께 표시됩니다. 최고 티어 화폐, 비싼 고유 아이템, 좋은 점술 카드, 성유물 보관실 열쇠처럼 가치가 매우 높은 아이템이 여기에 포함됩니다."],
    ["There are hundreds of uniques! Some are in high demand, others are worthless or very niche. The filter can't distinguish between uniques with the same baseType. Bases with a blue or purple beam/map icon could potentially be very expensive.", "고유 아이템은 수백 가지입니다! 어떤 것은 수요가 높지만, 어떤 것은 가치가 낮거나 쓰임새가 아주 좁습니다. 필터는 같은 베이스 타입의 고유 아이템을 구분하지 못합니다. 파란색이나 보라색 빔/지도 아이콘이 붙은 베이스는 비싼 아이템일 수도 있습니다."],
    ["The blue or purple map icons and beams signalize that are drop CAN be quite valuable... if you're lucky. A unique Leather Belt can very very rarely be an expensive headhunter and the filter can't tell them apart.", "파란색이나 보라색 지도 아이콘과 빔은 운이 좋으면 꽤 값진 드롭일 수 있다는 뜻입니다. 예를 들어 고유 가죽 허리띠는 아주 드물게 비싼 헤드헌터일 수 있지만, 필터는 둘을 구분하지 못합니다."],
    ["Tablets and fragments have their own tierlist!", "서판과 조각은 별도의 티어 목록을 사용합니다!"],
    ["Breach and delirium splinters increase their highlight with stack size", "균열 및 환영 파편은 중첩 개수가 많을수록 강조 표시가 강해집니다."],
    ["Uncut skill gems are highlighted based on the arealevel and their gemlevel. You'll see them clearly during the campaign. In the endgame high level ones receive extra highlight!", "미가공 스킬 젬은 지역 레벨과 젬 레벨에 따라 강조됩니다. 캠페인 중에는 뚜렷하게 보이고, 엔드게임에서는 높은 레벨 젬이 한 번 더 강조됩니다!"],
    ["Waystones gain more highlight as they gain tiers. High tier (11+) and top tier (16) Waystones have different sounds. The filter highlights waystone tier upgrades with an extra color.", "경로석은 등급이 오를수록 더 눈에 띄게 표시됩니다. 고티어(11+)와 최고 티어(16) 경로석은 서로 다른 사운드를 사용합니다. 등급이 오른 경로석은 별도 색상으로 구분됩니다."],
    ["The filter highlights Waystones drops of a higher tier than the one you're in with extra highlight (disabled on some styles)", "현재 진행 중인 등급보다 높은 경로석은 추가로 강조합니다. 일부 스타일에서는 꺼져 있을 수 있습니다."],
    ["As you enter higher waystones new basetypes can drop. The filter will automatically highlight lower level basetypes less. The 3 basetypes on the left side have the levels 65-70-80. The higher level bow is less useful by comparison to other available basetypes", "더 높은 경로석에 들어가면 새로운 베이스 타입이 드롭됩니다. 필터는 낮은 레벨 베이스 타입의 강조를 자동으로 줄입니다. 왼쪽의 세 베이스 타입은 각각 레벨 65-70-80입니다. 레벨이 높은 활이라도 다른 베이스 타입과 비교하면 덜 쓸모 있을 수 있습니다."],
    ["The filter has a ranking system for all gear-basetypes. Better basetypes receive more highlight, while worse ones are hidden on higher strictnesses (NOTE: transparency rendering is a bit weird on filterblade, works better ingame).", "필터는 모든 장비 베이스 타입에 등급을 매깁니다. 좋은 베이스 타입은 더 눈에 띄게 표시하고, 낮은 베이스 타입은 높은 엄격도에서 숨깁니다. 참고: FilterBlade에서는 투명도 표시가 조금 어색할 수 있지만, 게임 안에서는 더 잘 보입니다."],
    ["Jewellery has a ranking of it's own and distinct highlight and strictness progression", "장신구는 별도의 등급 체계가 있고, 강조 방식과 엄격도 진행도 따로 적용됩니다."],
    ["Itemlevel 82 rares are capable of rolling the best available mods. These are highlighted by a slightly orange hue.", "아이템 레벨 82 희귀 아이템에는 최고 등급 속성이 붙을 수 있습니다. 이 아이템은 살짝 주황빛으로 표시됩니다."],
    ["Rare & Magic items can drop with a higher 'tier'. The tier affects the initially rolled mods. Higher tier items are strongly biased to have higher mod values. Non-tiered items CAN be just as good, but are way less likely to be so.", "희귀 및 마법 아이템은 더 높은 '티어'로 드롭될 수 있습니다. 티어는 처음 붙는 속성에 영향을 줍니다. 티어가 높을수록 높은 속성값이 붙기 쉽습니다. 티어가 없는 아이템도 좋을 수는 있지만 그럴 가능성은 훨씬 낮습니다."],
    ["Higher tier magic items can make for valuable crafting bases. Keep in mind that the 'tier' only affects the initially rolled mods, not further crafting results.", "상위 티어 마법 아이템은 좋은 제작 베이스가 될 수 있습니다. 단, '티어'는 처음 붙은 속성에만 영향을 주며 이후 제작 결과에는 영향을 주지 않습니다."],
    ["Useful normal and magic bases get highlighted in the endgame in order to attempt craft them up. ItemLevel 82 (highest relevant itemlevel) bases also have an orange border.", "엔드게임에서는 제작해 볼 만한 일반 및 마법 베이스가 강조됩니다. 아이템 레벨 82(실질적으로 중요한 최고 아이템 레벨) 베이스에는 주황색 테두리도 붙습니다."],
    ["By applying an 'Orb of Chance' on these bases, you have a tiny chance to turn it into valuable unique item.", "이 베이스에 '기회의 오브'를 사용하면 아주 낮은 확률로 값진 고유 아이템이 될 수 있습니다."],
    ["Jewels in PoE2 can be quite valuable and come with lucrative corruption options. The filter highlights this appropriately.", "PoE2의 주얼은 꽤 비쌀 수 있고, 쓸 만한 타락 옵션도 붙습니다. 필터는 이런 주얼을 알맞게 강조합니다."],
    ["ItemLevel 83 charms can roll some exclusive mods. These are highlighted with an orange border, similar to most ILVL 82-83 items.", "아이템 레벨 83 호신부에는 일부 전용 속성이 붙을 수 있습니다. 대부분의 아이템 레벨 82-83 아이템처럼 주황색 테두리로 표시됩니다."],
    ["ItemLevel 83 flasks can roll some exclusive mods. These are highlighted with an orange border, similar to most ILVL 82-83 items.", "아이템 레벨 83 플라스크에는 일부 전용 속성이 붙을 수 있습니다. 대부분의 아이템 레벨 82-83 아이템처럼 주황색 테두리로 표시됩니다."],
    ["Useful currency that drops while leveling. These rules have priority over normal currency rules, but only apply during campaign zones. Great for new leagues!", "레벨링 중 드롭되는 유용한 화폐입니다. 이 규칙은 일반 화폐 규칙보다 우선하지만 캠페인 지역에서만 적용됩니다. 새 리그 초반에 좋습니다!"],
    ["Certain items like jewellery, magic boots (chance for movementspeed) are highlighted more during the campaign", "장신구나 마법 장화(이동 속도 가능성) 같은 특정 아이템은 캠페인 중 더 강하게 강조됩니다."],
    ["Flask upgrades and useful charms are highlighted while leveling", "레벨링 중에는 플라스크 업그레이드와 유용한 호신부가 강조됩니다."],
    ["During the campaign the itemfilter will remove normal (and on higher strictnesses magic) bases that are completely overleveled and no longer have a good use case.", "캠페인 중에는 현재 레벨에 비해 너무 낮아진 일반 베이스를 숨깁니다. 높은 엄격도에서는 마법 베이스도 숨길 수 있습니다."],
    ["Recommended filter-strictness for beginners and league-starters. Shows anything potentially useful, while hiding the worst of drops.", "초보자와 리그 스타터에게 추천하는 필터 엄격도입니다. 최악의 드롭은 숨기면서 잠재적으로 유용한 아이템은 보여줍니다."],
    ["Barely hides anything. Only focuses on highlighting. Not recommended for endgame gameplay.", "거의 아무것도 숨기지 않고, 강조 표시 위주로 보여줍니다. 엔드게임 플레이에는 추천하지 않습니다."],
    ["Low strictness. Shows all rares and crafting bases. Shows too much for higher waystones. Shows anything remotely useable.", "낮은 엄격도입니다. 모든 희귀 아이템과 제작 베이스를 보여줍니다. 높은 경로석에서는 너무 많은 아이템이 보일 수 있으며, 조금이라도 쓸 만한 아이템은 전부 표시합니다."],
    ["Recommended for waystone early-mid waystone tiers. Hides least effective rares, salvagables and runes in the endgame.", "초중반 경로석 구간에 추천합니다. 엔드게임에서는 효율이 낮은 희귀 아이템, 분해용 아이템, 룬을 숨깁니다."],
    ["Recommended for endgame waystone farming. Hides most inefficient rares, crafting bases.", "엔드게임 경로석 파밍에 추천합니다. 효율이 낮은 희귀 아이템과 제작 베이스 대부분을 숨깁니다."],
    ["Hides regular transmutation and augmentation orbs in the endgame", "엔드게임에서는 일반 진화의 오브와 확장의 오브를 숨깁니다."],
    ["Endgame farming: T15+ waystones only. Hides alchemy-grade currencies. Designed for high-juiced gameplay.", "엔드게임 파밍용입니다. T15+ 경로석만 기준으로 하며, 연금술 등급 화폐를 숨깁니다. 고투자 플레이에 맞춰 설계되었습니다."],
    ["WARNING: Hides waystone tiers 1-14. Will hide many boss-drop-uniques to minimize clutter in maps. Check hidden items when bossing. Hides lower-currency tiers", "경고: 1-14등급 경로석을 숨깁니다. 지도에서 잡동사니 표시를 줄이기 위해 보스 드롭 고유 아이템도 많이 숨길 수 있습니다. 보스를 잡을 때는 숨겨진 아이템을 확인하세요. 낮은 티어 화폐도 숨깁니다."]
  ];

  const regexTranslations = [
    [/^(.+) \(Tier (\d+)\)$/i, (match, name, tier) => `${translateItemOrExact(name)} (${tier}등급)`],
    [/^(.+) \(Level (\d+)\)$/i, (match, name, level) => `${translateItemOrExact(name)} (${level}레벨)`],
    [/^(\d+)x (.+)$/i, (match, count, name) => `${translateItemOrExact(name)} ${count}개`],
    [/^Class:\s*(.+)$/i, (match, itemClass) => `분류: ${translateItemClass(itemClass)}`],
    [/^BaseType:\s*(.+)$/i, (match, baseType) => `베이스 타입: ${translateItemOrExact(baseType)}`],
    [/^Hidden starting with (.+)$/i, (match, strictness) => `${translateItemOrExact(strictness)}부터 숨김`],
    [/^Currency Tier (\d+)$/i, (match, tier) => `화폐 티어 ${tier}`]
  ];

  function translateItemOrExact(value) {
    const trimmed = value.trim();
    return itemNameTranslations.get(trimmed) ?? exactTranslations.get(trimmed) ?? trimmed;
  }

  function translateItemClass(value) {
    const normalized = value.trim().toLowerCase();
    const classes = {
      "stackable currency": "중첩 가능 화폐",
      "currency": "화폐",
      "unique item": "고유 아이템",
      "gem": "젬",
      "skill gem": "스킬 젬",
      "support gem": "보조 젬",
      "waystone": "경로석",
      "map fragment": "지도 조각"
    };
    return classes[normalized] ?? translateItemOrExact(value);
  }

  function translateText(value) {
    const trimmed = value.trim();
    if (!trimmed) return value;

    const exact = translateItemOrExact(trimmed);
    if (exact !== trimmed) {
      return value.replace(trimmed, exact);
    }

    for (const [pattern, replacer] of regexTranslations) {
      const regexMatch = trimmed.match(pattern);
      if (regexMatch) {
        return value.replace(trimmed, replacer(...regexMatch));
      }
    }
    let translated = value;
    for (const [source, target] of phraseTranslations) {
      translated = translated.replaceAll(source, target);
    }
    return translated;
  }

  function restoreElement(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      if (originalTextNodes.has(element)) {
        element.nodeValue = originalTextNodes.get(element);
        originalTextNodes.delete(element);
      }
      return;
    }

    if (element.nodeType !== Node.ELEMENT_NODE) return;

    if (element.hasAttribute(WHITE_SPACE_ATTR)) {
      const originalWhiteSpace = element.getAttribute(WHITE_SPACE_ATTR);
      if (originalWhiteSpace) {
        element.style.whiteSpace = originalWhiteSpace;
      } else {
        element.style.removeProperty("white-space");
      }
      element.removeAttribute(WHITE_SPACE_ATTR);
    }

    for (const attr of ["placeholder", "title", "aria-label", "value"]) {
      const originalAttr = `${TRANSLATED_ATTR}-${attr}`;
      if (element.hasAttribute(originalAttr)) {
        element.setAttribute(attr, element.getAttribute(originalAttr));
        element.removeAttribute(originalAttr);
      }
    }
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (!parent || SKIP_TAGS.has(parent.tagName)) return;
    if (parent.closest("[contenteditable='true']")) return;

    const original = originalTextNodes.get(node) ?? node.nodeValue;
    const translated = translateText(original);
    if (translated !== original) {
      if (!originalTextNodes.has(node)) {
        originalTextNodes.set(node, original);
      }
      if (translated.includes("\n") && !parent.hasAttribute(WHITE_SPACE_ATTR)) {
        parent.setAttribute(WHITE_SPACE_ATTR, parent.style.whiteSpace || "");
        parent.style.whiteSpace = "pre-line";
      }
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    }
  }

  function translateAttributes(element) {
    for (const attr of ["placeholder", "title", "aria-label", "value"]) {
      if (!element.hasAttribute(attr)) continue;
      if (attr === "value" && !["BUTTON", "INPUT"].includes(element.tagName)) continue;

      const originalAttr = `${TRANSLATED_ATTR}-${attr}`;
      const original = element.getAttribute(originalAttr) ?? element.getAttribute(attr);
      const translated = translateText(original);
      if (translated !== original) {
        if (!element.hasAttribute(originalAttr)) {
          element.setAttribute(originalAttr, original);
        }
        if (element.getAttribute(attr) !== translated) {
          element.setAttribute(attr, translated);
        }
      }
    }
  }

  function translateRoot(root = document.body) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
      if (SKIP_TAGS.has(root.tagName)) return;
      translateAttributes(root);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && SKIP_TAGS.has(node.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        translateTextNode(node);
      } else {
        translateAttributes(node);
      }
      node = walker.nextNode();
    }
  }

  function restoreRoot(root = document.body) {
    if (!root) return;
    restoreElement(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode();
    while (node) {
      restoreElement(node);
      node = walker.nextNode();
    }
  }

  let enabled = DEFAULT_ENABLED;
  let observer;
  let scheduled = false;

  function scheduleTranslate() {
    if (!enabled || scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      translateRoot();
    });
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      if (!enabled) return;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target);
        } else {
          for (const node of mutation.addedNodes) {
            translateRoot(node);
          }
        }
      }
      scheduleTranslate();
    });
    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  function setEnabled(nextEnabled) {
    enabled = nextEnabled;
    if (enabled) {
      translateRoot();
      startObserver();
    } else {
      restoreRoot();
    }
  }

  chrome.storage.sync.get({ enabled: DEFAULT_ENABLED }, ({ enabled: storedEnabled }) => {
    setEnabled(storedEnabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.enabled) {
      setEnabled(Boolean(changes.enabled.newValue));
    }
  });
})();

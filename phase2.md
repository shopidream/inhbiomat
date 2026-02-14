당신은 웹 프로토타입 자동 생성 전문가입니다. 다음 조건을 만족하도록 기존 INH GLOBAL 정적 HTML 프로토타입을 한국어/영어 다국어 사이트로 변환하세요.

1️⃣ 목표
- 현재 prototype 디렉토리에 있는 HTML, CSS, JS, JSON을 다국어(한국어/영어) 지원으로 확장
- 제품 데이터는 기존 JSON 유지, 제품명과 설명만 다국어 필드 추가
- UI 텍스트와 메뉴도 다국어로 처리
- 언어 선택 드롭다운으로 페이지 내에서 토글 가능

2️⃣ 폴더 구조
prototype/
├── index.html
├── products.html
├── product-detail.html
├── quote.html
├── css/style.css
├── js/
│   ├── products.js
│   ├── product-detail.js
│   ├── quote.js
│   └── i18n.js          ← 새로 생성, 언어 처리
└── lang/
    ├── en.json           ← 영어 텍스트
    └── ko.json           ← 한국어 텍스트

3️⃣ 언어 파일 예시
- en.json, ko.json: UI 텍스트 key-value
예:
{
  "home": "Home",
  "products": "Products",
  "request_quote": "Request Quote",
  "material_type": "Material Type",
  ...
}

4️⃣ 제품 데이터 확장
- 기존 products JSON 유지
- 각 제품에 name, description 필드에 { "en": "...", "ko": "..." } 형태로 추가
예:
{
  "id": "mcd",
  "name": {"en": "MCD Apatitic Abrasive", "ko": "MCD 아파타이트 연마제"},
  "description": {"en": "Titanium implant surface treatment.", "ko": "티타늄 임플란트 표면 처리용."},
  ...
}

5️⃣ JS 처리
- i18n.js: 현재 언어 선택(currentLang) 관리, applyTranslations()로 data-i18n 속성 적용
- 기존 products.js, product-detail.js, quote.js는 currentLang에 맞춰 name/description 출력
- HTML에서는 텍스트 요소에 data-i18n 속성 추가
예:
<a href="index.html" data-i18n="home"></a>

6️⃣ 요구사항
- 순수 HTML/CSS/JS, no framework
- JSON에서 동적 로딩
- 모바일/태블릿/데스크탑 반응형
- Cloudflare Pages 배포 가능 구조 유지
- 기존 기능(제품 필터, SKU 테이블, 관련 제품 링크, 견적 요청 양식) 유지

7️⃣ 최종 목표
- prototype 디렉토리 전체를 다국어 지원으로 변환
- 페이지 내 언어 토글 가능
- 제품 데이터와 UI 모두 한국어/영어 지원
- 기존 구조, 디자인, 기능 그대로 유지

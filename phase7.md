목표
- /prototype/quote.html 고객 문의 페이지를 기존 i18n 시스템을 사용해 한글/영어 다국어 지원으로 완성한다.
- 새로운 기능 추가는 하지 말고, 번역 및 연결 작업만 수행한다.

절대 지침
- 디렉터리 구조 변경 금지
- 파일 이동 금지
- 기존 JS 로직 변경 최소화
- 이미 존재하는 i18n.js 구조를 그대로 사용
- 하드코딩된 텍스트만 i18n 키로 치환

작업 범위

1. quote.html 수정
- 화면에 보이는 모든 영어 텍스트를 제거
- 모든 텍스트 요소에 data-i18n 속성 사용
- 예: 제목, 설명문, label, placeholder, 버튼 텍스트, 안내 문구 등
- placeholder도 data-i18n-placeholder 형태로 처리

2. 다국어 번역 파일 작업
- /prototype/lang/ko.json 에 quote 관련 번역 키 추가
- /prototype/lang/en.json 에 동일한 키 구조 유지
- 번역 문구는 클로드가 자연스럽게 작성

권장 키 구조 예시
quote.title
quote.subtitle
quote.company
quote.name
quote.email
quote.phone
quote.product
quote.quantity
quote.message
quote.submit
quote.required
quote.success
quote.error

3. quote.js 확인
- 페이지 로드시 현재 언어 기준으로 번역이 적용되는지 확인
- 필요 시 applyTranslations() 호출만 추가 (새 로직 작성 금지)

완료 기준
- http://localhost:8000/prototype/quote.html
- http://localhost:8000/prototype/quote.html?product=atcp

위 두 URL에서
- 한국어 선택 시 전체 한글 표시
- 영어 선택 시 전체 영어 표시
- 제품 파라미터 기능 정상 유지

금지 사항
- 새로운 페이지 추가 금지
- UI/디자인 변경 금지
- 기능 확장 금지
- phase6, 추가 아이디어 등 실행 금지

작업 완료 후
- 수정된 파일 목록
- 추가된 i18n 키 목록
- 테스트 URL
만 간단히 요약해서 보고할 것

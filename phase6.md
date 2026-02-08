목표
이 프로젝트 전체에서 모든 상대경로를 절대경로로 변환한다.
JSON뿐 아니라 HTML, CSS, JS, 폰트, 이미지 등 모든 정적 리소스가 대상이다.

서버 기준
- 로컬 서버 루트: http://localhost:8000/
- 파일 시스템 루트 기준 경로로 절대경로를 사용한다.

경로 매핑 규칙 (절대 변경 금지)
- /data → data/
- /product_images → product_images/
- /prototype/css → prototype/css/
- /prototype/js → prototype/js/
- /prototype/fonts → prototype/fonts/
- /prototype/lang → prototype/lang/

작업 대상
- 모든 *.html, *.css, *.js 파일
- 특히 아래 항목은 반드시 확인할 것
  - <link href="">
  - <script src="">
  - <img src="">
  - CSS의 url(...)
  - @font-face src
  - fetch(), axios(), Image().src 등 JS 동적 경로

변환 규칙
1. 상대경로 사용 금지
   - ../
   - ./
   - css/
   - js/
   - images/
   - fonts/
2. 위 패턴이 발견되면 반드시 절대경로로 교체한다.
3. 기존 파일 이동은 하지 말고 경로 문자열만 수정한다.
4. 기능 변경, 로직 수정, 포맷 변경은 하지 않는다.
5. 콘솔 로그, 주석, 코드 스타일 유지.

검증
- 변환 후 아래 URL들이 브라우저에서 직접 열려야 한다.
  - /data/products-index.json
  - /product_images/*.png
  - /prototype/css/style.css
  - /prototype/js/*.js
  - /prototype/product-detail.html
  - /prototype/products.html

출력
- 수정된 파일 목록 요약
- 각 파일별 변경된 경로 개수
- 상대경로가 더 이상 존재하지 않음을 확인

중요
- CSS 내부 경로를 가장 우선적으로 점검할 것 (디자인 깨짐 원인)
- 폰트(.woff, .woff2) 경로 누락 금지
- 하드코딩된 문자열도 모두 검사

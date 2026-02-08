지금 프로젝트에서 경로 문제로 products-index.json 을 로드하지 못하고 있습니다.

현재 구조는 다음과 같습니다.

- 서버 루트: Inbiomat/
- 데이터: /data/products-index.json
- 제품 이미지: /product_images/
- HTML/JS: /prototype/

문제:
product-detail.html 및 관련 JS에서
../data/products-index.json 같은 상대경로를 사용하고 있어
서버 루트 기준 접근 시 404 오류가 발생합니다.

요청사항:
1. 모든 fetch 및 asset 접근 경로를 "절대경로" 기준으로 통일하세요.
   - ../data/... ❌
   - /data/... ✅
   - ../product_images/... ❌
   - /product_images/... ✅

2. 수정 대상
   - prototype/js/product-detail.js
   - prototype/js/products.js (존재한다면)
   - 기타 products-index.json 또는 product JSON을 fetch하는 모든 JS 파일

3. product-detail.html, products.html 등 HTML 파일에서는
   JS 코드 변경 없이 정상 동작하도록 경로 문제를 완전히 해결하세요.

4. 변경 후 다음 URL들이 모두 정상 동작해야 합니다.
   - http://localhost:8000/data/products-index.json
   - http://localhost:8000/product_images/mcd_1.png
   - http://localhost:8000/prototype/product-detail.html

주의:
- 서버 구조를 바꾸지 마세요.
- 파일 이동 금지
- 로컬 서버 및 실서버(Cloudflare Pages) 모두 호환되도록 처리하세요.

작업 완료 후,
수정된 파일 목록과 변경 요약을 간단히 정리해 주세요.

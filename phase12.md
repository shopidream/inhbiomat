프로젝트 경로: C:\Users\Juyong\Inbiomat
배포 환경: Cloudflare Pages, prototype/ 폴더가 사이트 루트로 서빙됨
다음 버그들을 모두 수정해줘:
1. 사이드바 카테고리 필터가 작동하지 않음
prototype/js/products.js의 applyFilters() 함수에서 카테고리 필터 로직 문제:

products-index.json의 category 값(예: "MATRIX® System")을 toLowerCase().replace(/[®\s]+/g, '-').replace(/\(|\)/g, '') 로 변환해서 HTML 체크박스 value("matrix-system")와 비교하고 있음
"All Products" 체크박스가 체크된 상태에서 다른 카테고리를 체크하면 "All Products"가 해제되지 않아서 필터가 제대로 동작 안 함
"All Products" 체크 시 다른 카테고리 체크 해제, 개별 카테고리 체크 시 "All Products" 해제되는 상호 배타 로직 추가해줘
카테고리별 변환 결과가 HTML value와 정확히 매칭되는지 검증하고, 안 맞으면 수정해줘

2. 사이드바 카운트 숫자가 실제 표시 제품 수와 불일치
prototype/products.html 사이드바의 카운트 숫자(96, 6, 27, 21, 2, 40)가 SKU 수 기준으로 하드코딩되어 있음. 실제로 화면에 보이는 건 product family 단위(총 15개). prototype/data/products-index.json의 products 배열에서 각 카테고리별 실제 product family 수를 세서 동적으로 표시하도록 수정하거나, 하드코딩 숫자를 실제 product family 수에 맞게 수정해줘.
3. 모든 HTML, JS, CSS 파일에서 ../ 경로 잔존 여부 확인
Cloudflare Pages에서 prototype/이 루트이므로 ../data/, ../product_images/ 같은 상대경로는 404를 발생시킴. 모든 파일에서 ../로 시작하는 경로를 찾아서 ./로 수정해줘. prototype/js/product-detail.js, prototype/js/products.js, prototype/index.html, prototype/products.html, prototype/product-detail.html, prototype/quote.html, prototype/css/style.css 전부 확인.
4. prototype/js/products.js 인코딩 깨짐 수정
파일 내 유니코드 문자가 깨진 곳이 있을 수 있음. 특히:

toggleFilters() 함수의 '▲'와 '▼' 문자가 '??'로 깨져있으면 복원
정규식의 ® 문자가 깨져있으면 복원
파일을 UTF-8 인코딩으로 저장

5. 수정 완료 후
powershellgit add .
git commit -m "Fix sidebar filters, counts, paths, and encoding issues"
git push
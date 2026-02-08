프로젝트 경로: C:\Users\Juyong\Inbiomat
PDF 원본: C:\Users\Juyong\Inbiomat\VIEW-Rev00-EXTERNAL-Specs-Tradeshow-Interactive-COMPRESSED.pdf
방향 전환: 이미지 크롭/추출 방식을 완전히 버리고, PDF 각 페이지를 통째로 이미지(PNG)로 변환해서 사용한다.
1. PDF 전체 페이지를 이미지로 변환

PyMuPDF(fitz)로 PDF의 2~46페이지를 각각 300 DPI PNG로 렌더링
파일명: page_02.png, page_03.png, ... page_46.png (1페이지는 표지이므로 제외)
저장 위치: prototype/product_images/pages/

1-1. CSS 비율 관련 추가 지시:

PDF 페이지 비율: 792:612 = 22:17 (가로형, ratio 1.294)
제품 카드 .product-card-image: aspect-ratio: 22 / 17; 적용
제품 상세 페이지 이미지 영역: 동일하게 aspect-ratio: 22 / 17; 적용
이미지는 object-fit: contain;으로 비율 유지


2. 제품별 페이지 매핑
각 제품 JSON의 이미지 정보를 페이지 번호 기반으로 변경:
json"pages": {
  "main": "page_02.png",
  "detail1": "page_03.png",
  "detail2": "page_04.png"
}
제품별 매핑:

mcd: 2,3,4 / mcha: 5,6,7 / swha: 8,9,10 / uwha: 11,12,13
hawhisk-s: 14,15,16 / cad: 17,18,19 / had: 20,21,22 / hadel: 23,24,25
atcp: 26,27,28 / ssbtcp: 29,30,31 / swbtcp: 32,33,34 / utcp: 35,36,37
ttcp: 38,39,40 / s1bcp: 41,42,43 / u1bcp: 44,45,46

3. 제품 리스트 페이지 수정 (products.js, index.html)

제품 카드 썸네일에 해당 제품의 main 페이지 이미지 사용
이미지 경로: ./product_images/pages/page_XX.png
제품 카드 이미지 비율을 PDF 페이지 비율(가로형, 약 11:8.5)에 맞게 CSS 수정

4. 제품 상세 페이지 수정 (product-detail.js)

3개 페이지 이미지를 순서대로 표시 (main, detail1, detail2)
각 이미지 클릭 시 모달/라이트박스로 확대 보기 가능하게 구현
확대 시 핀치줌 또는 스크롤줌 지원 (모바일 대응)
간단한 라이트박스: 외부 라이브러리 없이 순수 CSS/JS로 구현

5. products-index.json 및 개별 제품 JSON 업데이트

prototype/data/products-index.json과 prototype/data/products/*.json 모두 업데이트할 것 (prototype 폴더 내 파일을 직접 수정)
기존 "image" 또는 "images" 필드를 "pages" 필드로 교체

6. 기존 크롭된 이미지 정리

prototype/product_images/ 내 기존 크롭 이미지(*_1.png, *_2.png, *_main.png, *_square.png, *_wide.png 등) 삭제
prototype/images/products/ 내 기존 이미지도 삭제
pages 폴더의 전체 페이지 이미지만 남기기

수정 완료 후:
powershellgit add .
git commit -m "Replace cropped images with full PDF page renders, add lightbox viewer"
git push
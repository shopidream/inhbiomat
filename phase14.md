프로젝트 경로: C:\Users\Juyong\Inbiomat
PDF 원본: C:\Users\Juyong\Inbiomat\VIEW-Rev00-EXTERNAL-Specs-Tradeshow-Interactive-COMPRESSED.pdf
문제: 기존 이미지 추출 방식(PDF 내 이미지 객체만 추출)으로는 하단의 스케일바(예: "10 μm"), 카탈로그 번호(예: "Cat#UWHA20"), 측정 방식(예: "SEM") 텍스트가 포함되지 않음. 이 텍스트들은 PDF의 별도 텍스트/벡터 레이어에 있기 때문임.
해결 방법: PDF 이미지 객체 추출 대신, 각 페이지를 고해상도(300 DPI)로 래스터 렌더링한 후 이미지 영역을 크롭하는 방식으로 변경.
구현 방법:

Python의 pdf2image (poppler 기반) 또는 pymupdf(fitz)를 사용해서 PDF 각 페이지를 300 DPI PNG로 렌더링
각 제품의 2페이지(정사각형 이미지)와 3페이지(가로형 이미지)를 렌더링
렌더링된 전체 페이지 이미지에서 제품 사진 + 하단 텍스트(스케일바, Cat#, SEM/XRD 등)가 포함된 영역을 크롭
크롭 영역은 페이지 내 이미지가 차지하는 영역 + 하단 텍스트 영역까지 포함해야 함

크롭 영역 결정 방법:

pymupdf(fitz)로 페이지 내 이미지 객체의 bbox(bounding box) 좌표를 구함
해당 bbox 하단으로 약 5~10% 추가 여백을 포함하여 크롭 (텍스트 레이어가 이미지 바로 아래에 있으므로)
또는 페이지 전체를 렌더링한 후, 이미지 상단 경계부터 하단 텍스트 끝까지를 수동으로 크롭

제품별 페이지 매핑 (기존 매핑 참고):

mcd: 2-4, mcha: 5-7, swha: 8-10, uwha: 11-13, hawhisk-s: 14-16
cad: 17-19, had: 20-22, hadel: 23-25, atcp: 26-28, ssbtcp: 29-31
swbtcp: 32-34, utcp: 35-37, ttcp: 38-40, s1bcp: 41-43, u1bcp: 44-46

각 제품에서:

1번째 페이지(예: 2, 5, 8...) → {product_id}_main.png (메인 페이지 전체 또는 주요 영역)
2번째 페이지(예: 3, 6, 9...) → {product_id}_square.png (정사각형 이미지 + 하단 텍스트)
3번째 페이지(예: 4, 7, 10...) → {product_id}_wide.png (가로형 이미지 + 하단 텍스트)

출력 위치: C:\Users\Juyong\Inbiomat\product_images\에 저장 후 prototype\product_images\에도 복사
검증: 추출 후 한 제품(예: uwha)의 square 이미지를 열어서 하단에 "10 μm" 스케일바와 "Cat#UWHA20 SEM" 텍스트가 보이는지 확인
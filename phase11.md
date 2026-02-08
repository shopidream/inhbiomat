프로젝트: Inbiomat Prototype

문제:
1. Header 링크 클릭 시 404 또는 오류 발생.
2. 한글 폰트(Pretendard) 적용이 되지 않음.

원인 추정:
- HTML과 CSS에서 로컬 절대 경로(C:\Users\Juyong\Inbiomat\prototype\assets\...) 사용.
- Cloudflare Pages 배포 후 서버에서는 해당 절대 경로를 찾을 수 없음.

수정 지시:

1️⃣ HTML 수정
- 모든 `<link>` 및 `<script>` 경로를 절대 로컬 경로 대신 상대 경로로 변경.
  예: 
    ```html
    <link rel="stylesheet" href="./css/style.css">
    <script src="./js/products.js"></script>
    <img src="./assets/logo.png">
    ```

2️⃣ CSS에서 폰트 경로 수정
- 현재:
    ```css
    @font-face {
      font-family: 'Pretendard';
      src: url('C:/Users/Juyong/Inbiomat/prototype/assets/Pretendard-Bold.woff') format('woff');
      font-weight: 700;
    }
    ```
- 수정 후:
    ```css
    @font-face {
      font-family: 'Pretendard';
      src: url('../assets/Pretendard-Bold.woff') format('woff');
      font-weight: 700;
      font-style: normal;
    }
    ```
- 다른 Pretendard 파일(Pretendard-Light, Medium, SemiBold, Regular)도 동일하게 상대 경로로 수정.

3️⃣ 링크, 이미지, JS 경로 전체 점검
- 모든 `<a href="">`, `<img src="">`, `<script src="">` 등 **상대 경로로 통일**.
- Cloudflare Pages는 루트가 `prototype`이 아니므로 `./` 또는 `../` 기준으로 경로 작성.

4️⃣ 테스트
- 로컬에서 `npx wrangler dev`로 먼저 확인.
- Cloudflare Pages 재배포 후 header 정상 표시 확인.
- 한글 폰트가 정상적으로 적용되는지 확인.

결과: 
- Header 링크 클릭 가능
- Pretendard 폰트 정상 표시

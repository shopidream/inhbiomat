# 네이버 사이트 간단 체크 해결 가이드

## 현재 상태
- ✅ 웹사이트 정상 작동: https://inhbiomat.com
- ✅ robots.txt 정상: https://inhbiomat.com/robots.txt
- ✅ sitemap.xml 정상: https://inhbiomat.com/sitemap.xml
- ✅ 네이버 사이트 인증 완료
- ✅ 서버 응답 속도: 0.33초 (빠름)
- ✅ 네이버봇 접근 가능

## 문제: 사이트 간단 체크가 안됨

### 해결 방법

#### Step 1: 네이버 서치어드바이저 등록 URL 확인

1. [네이버 서치어드바이저](https://searchadvisor.naver.com) 접속
2. 좌측 상단에 **등록된 사이트 URL** 확인
3. 다음 중 무엇으로 등록되어 있나요?
   - `https://inhbiomat.com` ✅ (정답)
   - `https://www.inhbiomat.com` ❌ (www 있음 - 잘못됨)
   - `http://inhbiomat.com` ❌ (http - 잘못됨)
   - `https://www.inbiomat.co.kr` ❌ (이전 도메인 - 잘못됨)

**잘못 등록되어 있다면:**
- 사이트를 삭제하고 `https://inhbiomat.com`으로 다시 등록

#### Step 2: 사이트 간단 체크 올바르게 실행

1. 서치어드바이저 좌측 메뉴: **최적화** > **사이트 간단 체크**
2. URL 입력란에 정확히 입력:
   ```
   https://inhbiomat.com
   ```
   또는
   ```
   https://inhbiomat.com/index.html
   ```

3. **체크 시작** 버튼 클릭

#### Step 3: Cloudflare 방화벽 확인

Cloudflare가 네이버봇을 차단하고 있을 수 있습니다.

**확인 방법:**
1. Cloudflare 대시보드 접속
2. **보안(Security)** > **이벤트(Events)** 메뉴
3. 최근 차단된 요청에 네이버봇(Yeti) 있는지 확인

**네이버봇이 차단되어 있다면:**
1. **보안(Security)** > **WAF** > **사용자 정의 규칙(Custom Rules)**
2. 새 규칙 추가:
   - 규칙 이름: `Allow Naver Bot`
   - 필드: `User Agent`
   - 연산자: `contains`
   - 값: `Yeti`
   - 작업: `Allow` (허용)

#### Step 4: Cloudflare Bot Fight Mode 확인

1. Cloudflare 대시보드 > **보안(Security)** > **Bots**
2. **Bot Fight Mode**가 활성화되어 있다면:
   - 이것이 네이버봇을 차단할 수 있습니다
   - **Bot Fight Mode 비활성화** 또는
   - **Super Bot Fight Mode** 업그레이드 후 네이버봇 허용

#### Step 5: robots.txt에서 Yeti 명시적 허용 확인

현재 robots.txt 내용 (정상):
```
User-agent: Yeti
Allow: /

User-agent: *
Allow: /
```

#### Step 6: 시간 대기

방금 설정을 변경했다면:
- 네이버가 사이트를 크롤링하는데 **24-48시간** 소요
- robots.txt 수집 요청 후 **수 시간** 대기 필요

**즉시 확인 방법:**
1. **요청** > **robots.txt** > **수집 요청**
2. **요청** > **사이트맵 제출** > `https://inhbiomat.com/sitemap.xml`
3. **요청** > **URL 검사** > `https://inhbiomat.com` 입력

## 네이버 URL 검사 도구 사용

사이트 간단 체크 대신 **URL 검사** 도구를 사용해보세요:

1. 서치어드바이저 > **검증** > **URL 검사**
2. URL 입력: `https://inhbiomat.com`
3. **검사 시작**
4. 결과 확인:
   - 수집 가능 여부
   - robots.txt 상태
   - 페이지 로딩 상태

## 확인용 테스트 URL

브라우저에서 다음 URL들이 정상 작동하는지 확인:

1. 메인 페이지:
   ```
   https://inhbiomat.com
   https://inhbiomat.com/index.html
   ```

2. SEO 파일:
   ```
   https://inhbiomat.com/robots.txt
   https://inhbiomat.com/sitemap.xml
   ```

3. 다른 페이지:
   ```
   https://inhbiomat.com/products.html
   https://inhbiomat.com/quote.html
   ```

모두 정상적으로 열려야 합니다.

## 추가 점검 사항

### 1. 네이버 검색 등록 확인
네이버 검색창에 다음 입력:
```
site:inhbiomat.com
```

**결과:**
- 아무것도 안 나옴 → 아직 색인되지 않음 (정상, 시간 필요)
- 페이지가 나옴 → 색인 완료

### 2. Google Search Console 비교
Google Search Console에도 등록해서 비교:
- Google에서는 정상인데 네이버에서만 안되면 → 네이버 특정 문제
- 둘 다 안되면 → 사이트 구조 문제

## 문제가 계속되면

### A. 네이버 고객센터 문의
서치어드바이저 우측 상단 **고객센터** > **1:1 문의**

**문의 내용 템플릿:**
```
제목: 사이트 간단 체크 실행 불가

내용:
- 사이트 URL: https://inhbiomat.com
- 문제: 사이트 간단 체크를 실행할 수 없습니다
- 시도한 것:
  1. robots.txt 수집 요청 완료
  2. sitemap.xml 제출 완료
  3. 네이버 사이트 인증 완료
  4. 웹사이트 정상 작동 확인 완료
- 요청: 사이트 간단 체크가 실행되지 않는 원인을 알려주세요
```

### B. 임시 해결: URL 검사 사용
사이트 간단 체크 대신:
1. **검증** > **URL 검사** 사용
2. **통계** > **수집 현황** 모니터링
3. **통계** > **검색 반영 현황** 확인

## 정상 작동 예상 결과

사이트 간단 체크 성공 시:
- ✅ 타이틀 태그 확인
- ✅ 메타 설명 확인
- ✅ H1 태그 확인
- ✅ 이미지 Alt 확인
- ✅ 모바일 친화성 확인

---

**작성일**: 2026-02-14
**최종 업데이트**: 2026-02-14

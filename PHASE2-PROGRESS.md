# Phase 2: 다국어 지원 구현 - 진행 상황

## ✅ 완료된 작업

### 1. 언어 파일 생성
- `prototype/lang/en.json` - 영어 번역 (100+ 키)
- `prototype/lang/ko.json` - 한국어 번역 (100+ 키)

### 2. i18n 시스템 구현
- `prototype/js/i18n.js` 생성
  - 언어 전환 기능
  - localStorage에 언어 설정 저장
  - data-i18n 속성 기반 자동 번역
  - HTML/placeholder/title 속성 지원

### 3. HTML 업데이트
- ✅ `index.html` - 완전히 다국어 지원
  - 헤더에 언어 선택 드롭다운 추가
  - 모든 텍스트에 data-i18n 속성 추가
  - i18n.js 로드

- ⏳ `products.html` - 부분 완료
  - 헤더 업데이트 완료 (언어 선택기 추가)
  - 사이드바 필터, 제품 카드 등 나머지 부분 미완

## ⏳ 남은 작업

### 1. HTML 파일 업데이트
- [ ] `products.html` 나머지 부분
  - 사이드바 필터 텍스트
  - 제품 카드 템플릿
  - 로딩/에러 메시지

- [ ] `product-detail.html`
  - 헤더 + 언어 선택기
  - 탭 네비게이션
  - 사이드바
  - 모든 정적 텍스트

- [ ] `quote.html`
  - 헤더 + 언어 선택기
  - 폼 레이블 및 플레이스홀더
  - 버튼 텍스트

### 2. JavaScript 파일 업데이트
- [ ] `products.js`
  - currentLang 기반 제품명 렌더링
  - 필터 텍스트 다국어화

- [ ] `product-detail.js`
  - currentLang 기반 제품 상세 정보 렌더링

- [ ] `quote.js`
  - 폼 검증 메시지 다국어화

### 3. 제품 데이터 다국어화 (15개 파일)
각 제품 JSON 파일에 다국어 필드 추가:

```json
{
  "productName": {
    "en": "MCD Apatitic Abrasive",
    "ko": "MCD 아파타이트 연마제"
  },
  "overview": {
    "summary": {
      "en": "Our MCD Apatitic Abrasive is...",
      "ko": "MCD 아파타이트 연마제는..."
    },
    "manufacturing": {
      "en": "MCD is a free-flowing...",
      "ko": "MCD는 자유 유동성..."
    },
    "keyFeatures": [
      {
        "en": "Multi-phase calcium phosphate",
        "ko": "다상 칼슘 인산염"
      }
    ]
  },
  "applications": [
    {
      "en": "Implant Surface Treatment",
      "ko": "임플란트 표면 처리"
    }
  ]
}
```

필요한 파일:
- [ ] `data/products/mcd.json`
- [ ] `data/products/mcha.json`
- [ ] `data/products/swha.json`
- [ ] `data/products/uwha.json`
- [ ] `data/products/hawhisk-s.json`
- [ ] `data/products/cad.json`
- [ ] `data/products/had.json`
- [ ] `data/products/hadel.json`
- [ ] `data/products/atcp.json`
- [ ] `data/products/ssbtcp.json`
- [ ] `data/products/swbtcp.json`
- [ ] `data/products/utcp.json`
- [ ] `data/products/ttcp.json`
- [ ] `data/products/s1bcp.json`
- [ ] `data/products/u1bcp.json`

## 🧪 현재 테스트 가능한 기능

### 홈페이지 (완전히 작동)
```bash
cd prototype
python -m http.server 8000
# 브라우저에서 http://localhost:8000 열기
```

**작동하는 기능:**
1. 언어 선택기로 한국어/영어 전환
2. 모든 UI 텍스트 즉시 번역
3. localStorage에 언어 설정 저장
4. 페이지 새로고침 시 언어 유지

### 제품 목록 페이지 (부분 작동)
- 헤더 네비게이션: ✅ 다국어 지원
- 사이드바 필터: ❌ 아직 영어만
- 제품 카드: ❌ 제품 데이터 미변환

## 📋 작업 우선순위

### 우선순위 1 (핵심 기능)
1. 제품 데이터 다국어화 (최소 5개 대표 제품)
2. products.js 업데이트 (currentLang 지원)
3. product-detail.js 업데이트

### 우선순위 2 (UI 완성)
1. products.html 나머지 부분
2. product-detail.html 전체
3. quote.html 전체

### 우선순위 3 (추가 개선)
1. 나머지 제품 데이터 다국어화
2. 카테고리 설명 다국어화
3. 에러 메시지 다국어화

## 🔧 다음 단계 제안

### Option A: 수동 완료
각 파일을 하나씩 수동으로 업데이트

### Option B: 스크립트 자동화
Python 스크립트로 제품 데이터 일괄 변환:
```python
# convert_products_i18n.py
import json
import glob

for file in glob.glob('data/products/*.json'):
    # 기존 데이터 로드
    # 다국어 구조로 변환
    # 한국어 번역 추가 (DeepL API 또는 수동)
    # 저장
```

### Option C: 단계적 배포
1. 현재 상태로 일단 홈페이지만 배포
2. 점진적으로 나머지 페이지 업데이트
3. 제품 데이터는 우선순위별로 변환

## 📝 참고사항

### 언어 코드
- `en` - English
- `ko` - 한국어 (Korean)

### i18n.js API
```javascript
// 현재 언어 가져오기
i18n.getCurrentLanguage(); // 'en' 또는 'ko'

// 언어 변경
await i18n.setLanguage('ko');

// 번역 가져오기
i18n.t('product_catalog'); // "제품 카탈로그" (한국어) 또는 "Product Catalog" (영어)

// 번역 다시 적용
i18n.applyTranslations();
```

### data-i18n 속성 사용법
```html
<!-- 텍스트 콘텐츠 -->
<h1 data-i18n="product_catalog">Product Catalog</h1>

<!-- HTML 콘텐츠 -->
<p data-i18n-html="hero_subtitle">...</p>

<!-- Placeholder -->
<input data-i18n-placeholder="search" placeholder="Search...">

<!-- Title 속성 -->
<button data-i18n-title="download_pdf" title="Download PDF">...</button>
```

## ✅ 검증 체크리스트

### 홈페이지
- [x] 언어 선택기 작동
- [x] 영어/한국어 전환 시 모든 텍스트 변경
- [x] 새로고침 시 언어 설정 유지
- [x] 버튼 및 링크 텍스트 번역

### 제품 목록 (미완)
- [x] 헤더 번역
- [ ] 필터 라벨 번역
- [ ] 제품 카드 내용 번역
- [ ] 카운트 표시 번역

### 제품 상세 (미완)
- [ ] 모든 탭 번역
- [ ] 테이블 헤더 번역
- [ ] 사이드바 번역
- [ ] 제품 설명 번역

### 견적 요청 (미완)
- [ ] 폼 레이블 번역
- [ ] Placeholder 번역
- [ ] 버튼 번역
- [ ] 검증 메시지 번역

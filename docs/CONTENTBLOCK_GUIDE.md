# ContentBlock 사용 가이드

한국사 아띠 플랫폼의 ContentBlock 시스템을 활용하여 다양한 형태의 학습 컨텐츠를 생성하는 방법을 안내합니다.

## 목차

1. [ContentBlock 시스템 개요](#contentblock-시스템-개요)
2. [Admin UI 사용법](#admin-ui-사용법)
3. [ContentBlock 타입별 가이드](#contentblock-타입별-가이드)
4. [H2 DB 확인 방법](#h2-db-확인-방법)
5. [마이그레이션](#마이그레이션)

---

## ContentBlock 시스템 개요

ContentBlock은 학습 컨텐츠를 다양한 형태로 표현할 수 있도록 하는 다형성(Polymorphism) 기반 시스템입니다.

### 구조

```
ContentBlock (추상 클래스)
├── TextBlock (텍스트)
├── TableBlock (테이블)
├── ComparisonTableBlock (비교 테이블)
├── TimelineBlock (타임라인)
├── HeritageBlock (문화재)
└── ImageGalleryBlock (이미지 갤러리)
```

### 장점

- **유연성**: 다양한 컨텐츠 형태 지원
- **확장성**: 새로운 블록 타입 추가 용이
- **하위 호환성**: 기존 details 방식과 공존
- **구조화**: JSON으로 구조화된 데이터 저장

---

## Admin UI 사용법

### 1. Content Block 타입 선택

`content.html`에서 Content 생성 시:

1. **Content Block 타입** 드롭다운에서 원하는 타입 선택
2. 기존 방식 유지: `선택하지 않음 (기존 방식)` 선택 시 details 필드 사용
3. 새 방식: 타입 선택 시 `Block Data (JSON)` 필드 사용

### 2. JSON 입력 도우미 기능

각 타입 선택 시 제공되는 도우미 버튼:

- **📝 템플릿**: 선택한 타입의 JSON 템플릿 자동 생성
- **✨ 포맷**: JSON 포맷 정리 (들여쓰기, 줄바꿈)
- **✓ 검증**: JSON 유효성 검사

### 3. 기본 Workflow

```
타입 선택 → 템플릿 버튼 클릭 → 값 수정 → 검증 버튼 클릭 → Content 생성
```

---

## ContentBlock 타입별 가이드

### 1. TEXT (텍스트)

가장 간단한 텍스트 블록입니다.

#### JSON 구조

```json
{
  "title": "텍스트 제목",
  "text": "텍스트 내용을 여기에 입력하세요."
}
```

#### 예시

```json
{
  "title": "뗀석기",
  "text": "돌을 깨뜨리고 떼어 내어 날을 만든 도구인 뗀석기를 주로 사용하였다."
}
```

---

### 2. TABLE (테이블)

키-값 형태의 테이블입니다.

#### JSON 구조

```json
{
  "title": "테이블 제목",
  "rows": [
    {"key": "항목1", "value": "내용1"},
    {"key": "항목2", "value": "내용2"}
  ]
}
```

#### 예시

```json
{
  "title": "주요 정책",
  "rows": [
    {
      "key": "불교 수용",
      "value": "중국의 전진과 수교하고, 승려인 순도를 통해 불교를 수용한 후 공인함"
    },
    {
      "key": "율령 반포",
      "value": "국가 통치의 기본법인 율령을 반포하여 중앙 집권 체제를 강화함"
    },
    {
      "key": "태학 설립",
      "value": "우리나라 최초의 국립 대학인 태학을 설립하여 인재를 양성하고 유학을 보급함"
    }
  ]
}
```

---

### 3. COMPARISON_TABLE (비교 테이블)

여러 항목을 비교하는 테이블입니다.

#### JSON 구조

```json
{
  "title": "비교 테이블 제목",
  "headers": ["비교1", "비교2", "비교3"],
  "rows": [
    {
      "category": "구분1",
      "items": [
        {"details": ["내용1-1", "내용1-2"]},
        {"details": ["내용2-1"]},
        {"details": ["내용3-1", "내용3-2", "내용3-3"]}
      ]
    }
  ]
}
```

#### 예시

```json
{
  "title": "삼국의 비교",
  "headers": ["고구려", "백제", "신라"],
  "rows": [
    {
      "category": "건국 시조",
      "items": [
        {"details": ["주몽"]},
        {"details": ["온조"]},
        {"details": ["박혁거세"]}
      ]
    },
    {
      "category": "수도",
      "items": [
        {"details": ["국내성", "평양"]},
        {"details": ["위례성", "부여", "사비"]},
        {"details": ["금성"]}
      ]
    }
  ]
}
```

---

### 4. TIMELINE (타임라인)

시계열 이벤트를 표시하는 타임라인입니다.

#### JSON 구조

```json
{
  "title": "타임라인 제목",
  "rows": [
    {
      "events": [
        {
          "title": "이벤트1",
          "subtitle": "부제목1",
          "details": ["상세내용1", "상세내용2"],
          "style": "GRAY"
        },
        {
          "title": "이벤트2",
          "subtitle": "부제목2",
          "details": ["상세내용1"],
          "style": "YELLOW"
        },
        {
          "title": "이벤트3",
          "subtitle": "부제목3",
          "details": ["상세내용1", "상세내용2", "상세내용3"],
          "style": "PURPLE"
        }
      ]
    }
  ]
}
```

#### 스타일 옵션

- `GRAY`: 회색 배경
- `YELLOW`: 노란색 배경
- `PURPLE`: 보라색 배경

#### 예시

```json
{
  "title": "고구려 역사",
  "rows": [
    {
      "events": [
        {
          "title": "건국",
          "subtitle": "기원전 37년",
          "details": ["주몽이 고구려를 건국", "압록강 유역에 도읍"],
          "style": "GRAY"
        },
        {
          "title": "광개토대왕",
          "subtitle": "391-413년",
          "details": ["영토 대폭 확장", "한반도 북부까지 영역 확대"],
          "style": "YELLOW"
        }
      ]
    }
  ]
}
```

---

### 5. HERITAGE (문화재)

문화재를 카테고리별로 분류하여 표시합니다.

#### JSON 구조

```json
{
  "title": "문화재 제목",
  "categories": [
    {
      "categoryTitle": "카테고리1",
      "items": [
        {"name": "문화재명1", "imageUrl": "https://example.com/image1.png"},
        {"name": "문화재명2", "imageUrl": "https://example.com/image2.png"}
      ]
    },
    {
      "categoryTitle": "카테고리2",
      "items": [
        {"name": "문화재명3", "imageUrl": "https://example.com/image3.png"}
      ]
    }
  ]
}
```

#### 예시

```json
{
  "title": "구석기 시대 유물",
  "categories": [
    {
      "categoryTitle": "석기류",
      "items": [
        {"name": "주먹도끼", "imageUrl": "/images/artifacts/handaxe.png"},
        {"name": "찍개", "imageUrl": "/images/artifacts/chopper.png"}
      ]
    },
    {
      "categoryTitle": "골기류",
      "items": [
        {"name": "골침", "imageUrl": "/images/artifacts/bone-needle.png"}
      ]
    }
  ]
}
```

---

### 6. IMAGE_GALLERY (이미지 갤러리)

이미지 갤러리를 표시합니다.

#### JSON 구조

```json
{
  "title": "이미지 갤러리 제목",
  "items": [
    {"name": "이미지1", "imageUrl": "https://example.com/image1.png", "style": "DEFAULT"},
    {"name": "이미지2", "imageUrl": "https://example.com/image2.png", "style": "ORANGE"},
    {"name": "이미지3", "imageUrl": "https://example.com/image3.png", "style": "GREEN"},
    {"name": "이미지4", "imageUrl": "https://example.com/image4.png", "style": "YELLOW"}
  ]
}
```

#### 스타일 옵션

- `DEFAULT`: 기본 스타일
- `ORANGE`: 오렌지 배경
- `GREEN`: 초록 배경
- `YELLOW`: 노란 배경

#### 예시

```json
{
  "title": "고인돌 유적 사진",
  "items": [
    {
      "name": "고창 고인돌",
      "imageUrl": "/images/dolmen/gochang.jpg",
      "style": "DEFAULT"
    },
    {
      "name": "화순 고인돌",
      "imageUrl": "/images/dolmen/hwasun.jpg",
      "style": "ORANGE"
    },
    {
      "name": "강화 고인돌",
      "imageUrl": "/images/dolmen/ganghwa.jpg",
      "style": "GREEN"
    }
  ]
}
```

---

## H2 DB 확인 방법

### ContentBlock 데이터 확인

H2 콘솔에서 다음 쿼리로 확인:

```sql
-- 모든 Content 확인
SELECT * FROM content;

-- ContentBlock만 확인
SELECT id, content_number, content_title, content_type, block_data
FROM content
WHERE content_type IS NOT NULL;

-- 특정 타입만 확인
SELECT * FROM content WHERE content_type = 'TABLE';

-- 타입별 개수 확인
SELECT content_type, COUNT(*) as count
FROM content
WHERE content_type IS NOT NULL
GROUP BY content_type;
```

---

## 마이그레이션

### 자동 마이그레이션

기존 `details` 데이터를 자동으로 ContentBlock (TEXT)로 변환:

```bash
java -jar app.jar --migrate-details=true
```

### 수동 마이그레이션

`MigrateDetailsToContentBlocks.java` 스크립트 실행:

```java
@Autowired
MigrateDetailsToContentBlocks migrationScript;

migrationScript.run("--migrate-details=true");
```

### 마이그레이션 전략

- 기존 `details` 데이터는 유지 (하위 호환성)
- `content_type`이 `NULL`이고 `details`가 있는 경우만 마이그레이션
- `details`를 TextBlock JSON으로 변환
- 안전한 롤백을 위해 트랜잭션 사용

---

## 문제 해결

### Q1. JSON 파싱 오류가 발생합니다.

**A**: `검증` 버튼을 클릭하여 JSON 형식을 확인하세요. `포맷` 버튼으로 자동 정리할 수 있습니다.

### Q2. Admin에서 생성한 Content가 Web에 표시되지 않습니다.

**A**: 다음을 확인하세요:
1. `contentType`이 올바르게 저장되었는지 (H2 DB 확인)
2. `blockData`가 유효한 JSON인지
3. Web 브라우저 콘솔에서 오류 메시지 확인

### Q3. 기존 details 방식과 새 방식 중 어떤 것을 사용해야 하나요?

**A**: 
- **기존 방식**: 단순한 텍스트 배열에 적합
- **새 방식**: 구조화된 컨텐츠 (테이블, 타임라인 등)에 적합
- 두 방식 모두 지원되며, 필요에 따라 선택하세요.

---

## 추가 리소스

- [ContentBlock Java 클래스](../src/main/java/com/kobe/koreahistory/dto/response/content/)
- [ContentService](../src/main/java/com/kobe/koreahistory/service/ContentService.java)
- [ContentBlockUtil](../src/main/java/com/kobe/koreahistory/util/ContentBlockUtil.java)
- [Web 렌더링 로직](../src/main/resources/static/web/js/study.js)
- [Admin UI](../src/main/resources/static/admin/pages/content.html)

---

## 개발자 가이드

### 새로운 ContentBlock 타입 추가

1. DTO 클래스 생성: `src/main/java/.../dto/response/content/NewBlock.java`
2. `ContentBlock.java`에 `@JsonSubTypes` 등록
3. `ContentBlockUtil`에 해당 없음 (Jackson 자동 처리)
4. Web 렌더링 함수 추가: `study.js`
5. Admin UI placeholder 추가: `content.js`

---

**작성일**: 2025-11-02  
**버전**: 1.0.0


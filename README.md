# Korean History API 🇰🇷

한국사 주요 개념과 흐름을 학습하고 관리하기 위한 RESTful API 서버입니다.

이 프로젝트는 Spring Boot, JPA(Hibernate), H2 데이터베이스를 기반으로 구축되었으며, 한국사 시대별 대분류(Chapter), 소분류(Lesson), 섹션(Section), 서브섹션(Subsection), 핵심 키워드(Keyword) 및 상세 내용(Content)을 계층적으로 관리하는 기능을 제공합니다.

---

## 📑 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [데이터 모델](#-데이터-모델)
- [시작하기](#-시작하기)
- [API 명세](#-api-명세)
- [프로젝트 구조](#-프로젝트-구조)
- [기여하기](#-기여하기)
- [라이센스](#-라이센스)

---

## ✨ 주요 기능

- **생성 (Create)**: 대분류(Chapter)와 하위 소분류(Lesson)를 한 번에 생성하고, Section과 Subsection을 추가할 수 있습니다
- **조회 (Read)**: 대분류, 소분류, 섹션, 키워드 및 상세 내용을 다양한 조건으로 조회합니다
- **수정 (Update)**: 대분류 및 소분류의 번호와 제목을 부분적으로 수정합니다
- **삭제 (Delete)**: 대분류를 삭제할 수 있습니다 (Cascade로 하위 데이터 자동 삭제)

---

## 🛠️ 기술 스택

- **언어**: Java 17
- **프레임워크**: Spring Boot 3.5.6
- **데이터베이스**: H2 In-Memory Database
- **ORM**: Spring Data JPA (Hibernate)
- **빌드 도구**: Gradle 8.14.3
- **기타**: Lombok, Validation

---

## 🗂️ 데이터 모델

프로젝트는 계층적 구조로 한국사 학습 데이터를 관리합니다:

```
Chapter (대분류)
  └── Lesson (소분류)
        ├── Keyword (키워드)
        │     └── KeywordContent
        │           └── Content
        └── Section (섹션)
              └── Subsection (서브섹션)
```

### 주요 엔티티

- **Chapter**: 시대별 대분류 (예: 선사시대, 고대)
- **Lesson**: 대분류 내의 세부 주제 (예: 구석기 시대 ~ 철기 시대)
- **Section**: 소분류 내의 섹션
- **Subsection**: 섹션 내의 서브섹션
- **Keyword**: 학습 키워드 (예: 뗀석기, 숨베찌르개)
- **KeywordContent**: 키워드와 연결된 콘텐츠
- **Content**: 실제 학습 내용 (대분류, 소분류, 상세 내용 포함)

---

## 🚀 시작하기

### 사전 요구 사항

- Java 17 이상 (JDK)
- IDE (IntelliJ IDEA, Eclipse, VSCode 등)

### 실행 방법

#### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/KoreaHistory.git
cd KoreaHistory
```

#### 2. 애플리케이션 실행

아래 Gradle 명령어를 사용하여 애플리케이션을 실행합니다.

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

서버는 `http://localhost:8080`에서 실행됩니다.

### 데이터베이스 확인

애플리케이션 실행 후, 웹 브라우저에서 H2 콘솔에 접속할 수 있습니다:

- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:koreahistory`
- **Username**: `sa`
- **Password**: (공백)
- **초기 데이터**: `src/main/resources/data.sql` 파일에 의해 자동으로 생성됩니다

---

## 📖 API 명세

### 1. Chapter (대분류)

#### 1.1. 모든 대분류 조회

```http
GET /api/v1/chapters/search/all
```

**Response (200 OK)**

```json
[
  {
    "id": 1,
    "chapterNumber": 1,
    "chapterTitle": "선사시대",
    "lessons": [
      {
        "id": 1,
        "lessonNumber": 1,
        "lessonTitle": "구석기 시대 ~ 철기 시대"
      },
      {
        "id": 2,
        "lessonNumber": 2,
        "lessonTitle": "고조선과 여러 나라의 성장"
      }
    ]
  }
]
```

#### 1.2. 대분류 조회 (제목으로)

```http
POST /api/v1/search/chapters
Content-Type: application/json
```

**Request Body**

```json
{
  "chapterTitle": "선사시대"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "chapterNumber": 1,
  "chapterTitle": "선사시대",
  "lessons": [
    {
      "id": 1,
      "lessonNumber": 1,
      "lessonTitle": "구석기 시대 ~ 철기 시대"
    }
  ]
}
```

#### 1.3. 대분류 생성

대분류(Chapter)와 하위 소분류(Lesson)들을 한 번에 생성합니다.

```http
POST /api/v1/create/chapter
Content-Type: application/json
```

**Request Body**

```json
{
  "chapterNumber": 2,
  "chapterTitle": "고대",
  "lessons": [
    {
      "lessonNumber": 3,
      "lessonTitle": "고구려"
    },
    {
      "lessonNumber": 4,
      "lessonTitle": "백제"
    }
  ]
}
```

**Response (200 OK)**

```json
{
  "id": 2,
  "chapterNumber": 2,
  "chapterTitle": "고대"
}
```

#### 1.4. 대분류 번호 수정

```http
PATCH /api/v1/chapters/{id}/number
Content-Type: application/json
```

**Request Body**

```json
{
  "chapterNumber": 10
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "changedChapterNumber": 10
}
```

#### 1.5. 대분류 제목 수정

```http
PATCH /api/v1/chapters/{id}/title
Content-Type: application/json
```

**Request Body**

```json
{
  "chapterTitle": "수정된 대분류 제목"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "changedChapterTitle": "수정된 대분류 제목"
}
```

#### 1.6. 대분류 삭제

```http
DELETE /api/v1/chapters/{id}
```

**Response (204 No Content)**

---

### 2. Lesson (소분류)

#### 2.1. 소분류 조회

번호 또는 제목으로 소분류를 동적으로 검색합니다.

```http
GET /api/v1/detail/search?lessonNumber=1&lessonTitle=구석기
```

**Response (200 OK)**

```json
[
  {
    "id": 1,
    "lessonNumber": 1,
    "lessonTitle": "구석기 시대 ~ 철기 시대"
  }
]
```

#### 2.2. 소분류 생성

기존 대분류에 새로운 소분류를 추가합니다.

```http
POST /api/v1/chapters/{chapterId}/details
Content-Type: application/json
```

**Request Body**

```json
{
  "lessonNumber": 5,
  "lessonTitle": "신라"
}
```

**Response (201 Created)**

```json
{
  "id": 5,
  "lessonNumber": 5,
  "lessonTitle": "신라"
}
```

#### 2.3. 소분류 제목 수정

```http
PATCH /api/v1/chapters/detail/{id}
Content-Type: application/json
```

**Request Body**

```json
{
  "toChangeLessonTitle": "수정된 소분류 제목"
}
```

**Response (200 OK)**

```json
{
  "changedLessonTitle": "수정된 소분류 제목"
}
```

---

### 3. Section (섹션)

#### 3.1. 섹션 조회

```http
GET /api/v1/search/section/{sectionId}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "sectionNumber": 1,
  "sectionTitle": "도구"
}
```

#### 3.2. 섹션 생성

```http
POST /api/v1/create/section/{lessonId}
Content-Type: application/json
```

**Request Body**

```json
{
  "sectionNumber": 1,
  "sectionTitle": "도구"
}
```

**Response (201 Created)**

```json
{
  "id": 1,
  "sectionNumber": 1,
  "sectionTitle": "도구"
}
```

---

### 4. Subsection (서브섹션)

#### 4.1. 서브섹션 생성

```http
POST /api/v1/create/subsection/{sectionId}
Content-Type: application/json
```

**Request Body**

```json
{
  "subsectionNumber": 1,
  "subsectionTitle": "뗀석기"
}
```

**Response (201 Created)**

```json
{
  "id": 1,
  "subsectionNumber": 1,
  "subsectionTitle": "뗀석기"
}
```

---

### 5. Keyword (키워드)

#### 5.1. 키워드 조회 (상세 내용 포함)

```http
POST /api/v1/search/keyword/and/chapter
Content-Type: application/json
```

**Request Body**

```json
{
  "keyword": "뗀석기"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "detailChapter": {
    "id": 1,
    "lessonNumber": 1,
    "lessonTitle": "구석기 시대 ~ 철기 시대"
  },
  "keyword": "뗀석기",
  "keywordContent": {
    "id": 1,
    "mainCategory": "1. 구석기 시대",
    "subCategory": "(1) 도구",
    "detail": "① 뗀석기: 돌을 깨뜨리고 떼어 내어 날을 만든 도구인 \"뗀석기를 주로 사용\"하였다."
  }
}
```

#### 5.2. 키워드로 콘텐츠만 조회

```http
POST /api/v1/search/by/keywords
Content-Type: application/json
```

**Request Body**

```json
{
  "keyword": "뗀석기"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "mainCategory": "1. 구석기 시대",
  "subCategory": "(1) 도구",
  "detail": "① 뗀석기: 돌을 깨뜨리고 떼어 내어 날을 만든 도구인 \"뗀석기를 주로 사용\"하였다."
}
```

---

## 📁 프로젝트 구조

```
KoreaHistory/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/kobe/koreahistory/
│   │   │       ├── controller/           # REST API 컨트롤러
│   │   │       │   └── KoreaHistoryController.java
│   │   │       ├── service/              # 비즈니스 로직
│   │   │       │   ├── ChapterService.java
│   │   │       │   ├── LessonService.java
│   │   │       │   ├── SectionService.java
│   │   │       │   └── SubsectionService.java
│   │   │       ├── repository/           # JPA 리포지토리
│   │   │       │   ├── ChapterRepository.java
│   │   │       │   ├── LessonRepository.java
│   │   │       │   ├── SectionRepository.java
│   │   │       │   ├── SubsectionRepository.java
│   │   │       │   ├── KeywordRepository.java
│   │   │       │   └── KeywordContentRepository.java
│   │   │       ├── domain/entity/        # JPA 엔티티
│   │   │       │   ├── Chapter.java
│   │   │       │   ├── Lesson.java
│   │   │       │   ├── Section.java
│   │   │       │   ├── Subsection.java
│   │   │       │   ├── Keyword.java
│   │   │       │   ├── KeywordContent.java
│   │   │       │   └── Content.java
│   │   │       └── dto/                  # DTO 클래스
│   │   │           ├── request/
│   │   │           └── response/
│   │   └── resources/
│   │       ├── application.yml           # 애플리케이션 설정
│   │       └── data.sql                  # 초기 데이터
│   └── test/
│       └── java/
│           └── com/kobe/koreahistory/
│               └── KoreaHistoryApplicationTests.java
├── build.gradle                          # Gradle 빌드 설정
├── settings.gradle
├── gradlew                               # Gradle Wrapper (Linux/Mac)
├── gradlew.bat                           # Gradle Wrapper (Windows)
├── LICENCE                               # MIT 라이센스
└── README.md                             # 프로젝트 문서
```

---

## 🔧 개발 환경 설정

### IDE 설정 (IntelliJ IDEA)

1. 프로젝트를 IntelliJ IDEA로 엽니다
2. Gradle 프로젝트로 인식되면 자동으로 의존성을 다운로드합니다
3. Lombok 플러그인이 설치되어 있는지 확인합니다
4. `KoreaHistoryApplication.java`를 실행합니다

### 데이터베이스 초기화

애플리케이션 시작 시 `data.sql` 파일이 자동으로 실행되어 초기 데이터가 생성됩니다:

- 1개의 Chapter (선사시대)
- 2개의 Lesson (구석기 시대 ~ 철기 시대, 고조선과 여러 나라의 성장)
- 3개의 Keyword (뗀석기, 숨베찌르개, 주요 뗀석기)
- 관련 Content 데이터

---

## 🧪 테스트

```bash
# 모든 테스트 실행
./gradlew test

# 특정 테스트 클래스 실행
./gradlew test --tests KoreaHistoryApplicationTests
```

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

이슈나 PR은 언제나 환영합니다!

---

## 📝 라이센스

이 프로젝트는 MIT 라이센스에 따라 배포됩니다. 자세한 내용은 [LICENCE](LICENCE) 파일을 참조하세요.

---

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

**Author**: Minseong Kang

---

## 🗺️ 로드맵

- [ ] 사용자 인증 및 권한 관리
- [ ] 학습 진도 추적 기능
- [ ] 퀴즈 및 테스트 기능
- [ ] 이미지 및 멀티미디어 지원
- [ ] 검색 기능 고도화
- [ ] RESTful API 문서화 (Swagger/OpenAPI)
- [ ] 단위 테스트 및 통합 테스트 확대
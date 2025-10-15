# Korean History API 🇰🇷

한국사 주요 개념과 흐름을 학습하고 관리하기 위한 RESTful API 서버입니다.

Spring Boot, JPA(Hibernate), H2 데이터베이스를 기반으로 구축되었으며, 한국사 시대별 대분류(Chapter)부터 세부 키워드(Keyword)까지 계층적으로 관리하는 기능을 제공합니다.

---

## 📑 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [데이터 모델](#️-데이터-모델)
- [시작하기](#-시작하기)
- [API 명세](#-api-명세)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 환경 설정](#-개발-환경-설정)
- [기여하기](#-기여하기)
- [라이센스](#-라이센스)

---

## ✨ 주요 기능

### CRUD 작업
- **생성**: 대분류(Chapter)와 하위 구조를 한 번에 생성
- **조회**: 다양한 조건으로 계층적 데이터 조회
- **수정**: 엔티티별 부분 수정 지원
- **삭제**: Cascade를 통한 하위 데이터 자동 삭제

### 키워드 관리
- 다중 키워드 지원 (@ElementCollection 활용)
- 키워드 검색 (부분 일치)
- 키워드 추가/삭제

### 상세 내용 관리
- 키워드별 다중 상세 정보 저장
- 컬렉션 테이블을 통한 유연한 데이터 구조

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | Java 17 |
| **프레임워크** | Spring Boot 3.5.6 |
| **데이터베이스** | H2 In-Memory Database |
| **ORM** | Spring Data JPA (Hibernate) |
| **빌드 도구** | Gradle 8.14.3 |
| **기타** | Lombok, Validation |

---

## 🗂️ 데이터 모델

### 계층 구조

```
Chapter (대분류 - 시대)
  └── Lesson (중분류 - 시대별 주제)
        └── Section (소분류 - 세부 주제)
              └── Subsection (서브섹션 - 상세 주제)
                    └── Topic (토픽 - 학습 주제)
                          └── Keyword (키워드 그룹)
                                ├── keywords (다중 키워드 문자열)
                                └── Content (상세 내용)
                                      └── details (다중 상세 설명)
```

### 주요 엔티티

| 엔티티 | 설명 | 예시 |
|--------|------|------|
| **Chapter** | 시대별 대분류 | 선사시대, 고대 |
| **Lesson** | 대분류 내의 세부 주제 | 구석기 시대 ~ 철기 시대 |
| **Section** | 소분류 내의 섹션 | 구석기 시대와 신석기 시대 |
| **Subsection** | 섹션 내의 서브섹션 | 구석기 시대 |
| **Topic** | 학습 토픽 | 도구, 생활 모습, 사회 |
| **Keyword** | 키워드 그룹 (다중 키워드 포함) | 뗀석기, 주먹 도끼, 찍개 등 |
| **Content** | 실제 학습 내용 (다중 상세 설명 포함) | 뗀석기의 사용법, 특징 등 |

### 특징

- **@ElementCollection 활용**: Keyword와 Content는 각각 다중 문자열을 저장하는 컬렉션 테이블 구조
- **Cascade 설정**: 부모 엔티티 삭제 시 하위 엔티티 자동 삭제
- **Lazy Loading**: 성능 최적화를 위한 지연 로딩 적용

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

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

서버가 `http://localhost:8080`에서 실행됩니다.

### 데이터베이스 확인

애플리케이션 실행 후, H2 콘솔에 접속하여 데이터를 확인할 수 있습니다.

| 항목 | 값 |
|------|-----|
| **URL** | http://localhost:8080/h2-console |
| **JDBC URL** | jdbc:h2:mem:koreahistory |
| **Username** | sa |
| **Password** | (공백) |

**초기 데이터**: `src/main/resources/data.sql` 파일에 의해 자동 생성
- 2개의 Chapter (선사시대, 고대)
- 4개의 Topic (도구, 생활 모습, 사회, 주요 유적)
- 6개의 Keyword 그룹 (37개의 키워드 문자열)
- 관련 Content 데이터

---

## 📖 API 명세

### Base URL

```
http://localhost:8080/api/v1
```

---

### 1. Chapter (대분류)

#### 1.1. 모든 대분류 조회

```http
GET /api/v1/chapters/search/all
```

**응답 예시 (200 OK)**

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
        "lessonTitle": "구석기 시대 ~ 철기 시대",
        "sections": []
      }
    ]
  }
]
```

#### 1.2. 대분류 상세 조회 (제목으로)

```http
POST /api/v1/search/chapters
Content-Type: application/json
```

**요청 본문**

```json
{
  "chapterTitle": "선사시대"
}
```

#### 1.3. 대분류 생성

```http
POST /api/v1/create/chapter
Content-Type: application/json
```

**요청 본문**

```json
[
  {
    "chapterNumber": 2,
    "chapterTitle": "고대",
    "lessons": [
      {
        "lessonNumber": 3,
        "lessonTitle": "고구려",
        "sections": []
      }
    ]
  }
]
```

**응답 (201 Created)**

```json
[
  {
    "id": 2,
    "chapterNumber": 2,
    "chapterTitle": "고대",
    "lessons": [
      {
        "id": 3,
        "lessonNumber": 3,
        "lessonTitle": "고구려",
        "sections": []
      }
    ]
  }
]
```

#### 1.4. 대분류 번호 수정

```http
PATCH /api/v1/chapters/{id}/number
Content-Type: application/json
```

**요청 본문**

```json
{
  "chapterNumber": 10
}
```

#### 1.5. 대분류 제목 수정

```http
PATCH /api/v1/chapters/{id}/title
Content-Type: application/json
```

**요청 본문**

```json
{
  "chapterTitle": "수정된 대분류 제목"
}
```

#### 1.6. 대분류 삭제

```http
DELETE /api/v1/chapters/{id}
```

**응답 (204 No Content)**

---

### 2. Lesson (중분류)

#### 2.1. 중분류 조회

```http
GET /api/v1/detail/search?lessonNumber=1&lessonTitle=구석기
```

**쿼리 파라미터**
- `lessonNumber` (optional): 중분류 번호
- `lessonTitle` (optional): 중분류 제목 (부분 검색)

#### 2.2. 중분류 생성

```http
POST /api/v1/chapters/{chapterId}/details
Content-Type: application/json
```

**요청 본문**

```json
{
  "lessonNumber": 5,
  "lessonTitle": "신라"
}
```

#### 2.3. 중분류 제목 수정

```http
PATCH /api/v1/chapters/detail/{id}
Content-Type: application/json
```

**요청 본문**

```json
{
  "toChangeLessonTitle": "수정된 중분류 제목"
}
```

---

### 3. Section (소분류)

#### 3.1. 소분류 조회

```http
GET /api/v1/search/section/{sectionId}
```

#### 3.2. 소분류 생성

```http
POST /api/v1/create/section/{lessonId}
Content-Type: application/json
```

**요청 본문**

```json
{
  "sectionNumber": 1,
  "sectionTitle": "구석기 시대와 신석기 시대",
  "subsections": []
}
```

---

### 4. Subsection (서브섹션)

#### 4.1. 서브섹션 생성

```http
POST /api/v1/create/subsection/{sectionId}
Content-Type: application/json
```

**요청 본문**

```json
{
  "subsectionNumber": 1,
  "subsectionTitle": "구석기 시대",
  "topics": []
}
```

---

### 5. Keyword (키워드)

#### 5.1. 키워드 검색

```http
GET /api/v1/search/keywords?keyword=뗀석기
```

**쿼리 파라미터**
- `keyword`: 검색할 키워드 (부분 일치 검색)

**응답 예시 (200 OK)**

```json
[
  {
    "id": 1,
    "keywordNumber": 1,
    "keywords": ["뗀석기"]
  },
  {
    "id": 2,
    "keywordNumber": 2,
    "keywords": ["주요 뗀석기", "주먹 도끼", "찍개", "슴베찌르개"]
  }
]
```

#### 5.2. 키워드 생성

```http
POST /api/v1/create/keyword?topicTitle=도구
Content-Type: application/json
```

**쿼리 파라미터**
- `topicTitle`: 부모 Topic의 제목

**요청 본문**

```json
{
  "keywordNumber": 1,
  "keywords": ["뗀석기", "돌도구"],
  "contents": []
}
```

**응답 예시 (200 OK)**

```json
{
  "id": 1,
  "keywordNumber": 1,
  "keywords": ["뗀석기", "돌도구"],
  "contents": []
}
```

#### 5.3. 키워드 추가 (수정)

```http
PATCH /api/v1/keyword/update/{keywordId}
Content-Type: application/json
```

**요청 본문**

```json
{
  "keyword": "석기"
}
```

**응답 예시 (200 OK)**

```json
{
  "id": 1,
  "keywordNumber": 1,
  "updatedKeywords": ["뗀석기", "돌도구", "석기"]
}
```

#### 5.4. 키워드 삭제

```http
DELETE /api/v1/delete/keyword/{keywordId}
Content-Type: application/json
```

**요청 본문**

```json
{
  "targetKeyword": "석기"
}
```

**응답 예시 (200 OK)**

```json
{
  "id": 1,
  "resultKeywords": ["뗀석기", "돌도구"],
  "message": "성공적으로 삭제 되었습니다."
}
```

---

## 📁 프로젝트 구조

```
KoreaHistory/
├── src/
│   ├── main/
│   │   ├── java/com/kobe/koreahistory/
│   │   │   ├── controller/              # REST API 컨트롤러
│   │   │   │   └── KoreaHistoryController.java
│   │   │   ├── service/                 # 비즈니스 로직
│   │   │   │   ├── ChapterService.java
│   │   │   │   ├── LessonService.java
│   │   │   │   ├── SectionService.java
│   │   │   │   ├── SubsectionService.java
│   │   │   │   └── KeywordService.java
│   │   │   ├── repository/              # JPA 리포지토리
│   │   │   │   ├── ChapterRepository.java
│   │   │   │   ├── LessonRepository.java
│   │   │   │   ├── SectionRepository.java
│   │   │   │   ├── SubsectionRepository.java
│   │   │   │   ├── TopicRepository.java
│   │   │   │   └── KeywordRepository.java
│   │   │   ├── domain/entity/           # JPA 엔티티
│   │   │   │   ├── Chapter.java
│   │   │   │   ├── Lesson.java
│   │   │   │   ├── Section.java
│   │   │   │   ├── Subsection.java
│   │   │   │   ├── Topic.java
│   │   │   │   ├── Keyword.java
│   │   │   │   └── Content.java
│   │   │   └── dto/                     # DTO 클래스
│   │   │       ├── request/
│   │   │       │   ├── chapter/
│   │   │       │   ├── lesson/
│   │   │       │   ├── section/
│   │   │       │   ├── subsection/
│   │   │       │   ├── topic/
│   │   │       │   ├── keyword/
│   │   │       │   └── content/
│   │   │       └── response/
│   │   │           ├── chapter/
│   │   │           ├── lesson/
│   │   │           ├── section/
│   │   │           ├── subsection/
│   │   │           ├── topic/
│   │   │           ├── keyword/
│   │   │           └── content/
│   │   └── resources/
│   │       ├── application.yml          # 애플리케이션 설정
│   │       └── data.sql                 # 초기 데이터
│   └── test/
│       └── java/com/kobe/koreahistory/
│           └── KoreaHistoryApplicationTests.java
├── build.gradle                         # Gradle 빌드 설정
├── settings.gradle
├── gradlew                              # Gradle Wrapper
├── gradlew.bat
├── LICENCE                              # MIT 라이센스
└── README.md                            # 프로젝트 문서
```

---

## 🔧 개발 환경 설정

### IDE 설정 (IntelliJ IDEA)

1. 프로젝트를 IntelliJ IDEA로 엽니다
2. Gradle 프로젝트로 인식되면 자동으로 의존성을 다운로드합니다
3. Lombok 플러그인이 설치되어 있는지 확인합니다
   - `File` → `Settings` → `Plugins` → `Lombok` 검색 및 설치
4. Annotation Processing 활성화
   - `File` → `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
   - `Enable annotation processing` 체크
5. `KoreaHistoryApplication.java`를 실행합니다

### 데이터베이스 초기화

애플리케이션 시작 시 `data.sql` 파일이 자동으로 실행되어 초기 데이터가 생성됩니다:

- **Chapter**: 선사시대, 고대
- **Lesson**: 구석기 시대 ~ 철기 시대, 고조선과 여러 나라의 성장
- **Section**: 구석기 시대와 신석기 시대, 청동기 시대와 철기 시대
- **Subsection**: 구석기 시대
- **Topic**: 도구, 생활 모습, 사회, 주요 유적
- **Keyword**: 6개 그룹 (37개 키워드 문자열)
- **Content**: 각 키워드별 상세 내용

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
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

이 프로젝트는 Conventional Commits를 따릅니다:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 수정
- `test`: 테스트 코드
- `chore`: 빌드 설정, 기타

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

### 단기 목표
- [ ] RESTful API 문서화 (Swagger/OpenAPI)
- [ ] 단위 테스트 및 통합 테스트 확대
- [ ] 예외 처리 개선 및 표준화

### 중기 목표
- [ ] 사용자 인증 및 권한 관리
- [ ] 검색 기능 고도화 (전문 검색)
- [ ] 페이징 및 정렬 기능

### 장기 목표
- [ ] 학습 진도 추적 기능
- [ ] 퀴즈 및 테스트 기능
- [ ] 이미지 및 멀티미디어 지원
- [ ] 모바일 앱 연동

---

## 📚 참고 자료

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [RESTful API Design](https://restfulapi.net/)

---

**Built with ❤️ for Korean History Education**
# Korean History API 🇰🇷

한국사 주요 개념과 흐름을 학습하고 관리하기 위한 RESTful API 서버입니다.

이 프로젝트는 Spring Boot, JPA(Hibernate), H2 데이터베이스를 기반으로 구축되었으며, 한국사 시대별 대분류(Chapter), 소분류(DetailChapter), 핵심 키워드(Keyword) 및 상세 내용(Content)을 계층적으로 관리하는 기능을 제공합니다.

---

## 📑 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [시작하기](#-시작하기)
- [API 명세](#-api-명세)
  - [Chapter API](#1-chapter-대분류)
  - [DetailChapter API](#2-detailchapter-소분류)
  - [Keyword API](#3-keyword-키워드)

---

## ✨ 주요 기능

- **생성 (Create)**: 대분류(Chapter)와 하위 소분류(DetailChapter)를 한 번에 생성합니다
- **조회 (Read)**: 대분류, 키워드, 키워드 상세 내용을 이름으로 조회합니다
- **수정 (Update)**: 대분류 및 소분류의 번호와 제목을 부분적으로 수정합니다

---

## 🛠️ 기술 스택

- **언어**: Java 17
- **프레임워크**: Spring Boot 3.x
- **데이터베이스**: H2 In-Memory Database
- **ORM**: Spring Data JPA (Hibernate)
- **빌드 도구**: Gradle
- **기타**: Lombok

---

## 🚀 시작하기

### 사전 요구 사항

- Java 17 (JDK)
- IDE (IntelliJ, VSCode 등)

### 실행 방법

#### 1. 프로젝트 클론

```bash
git clone [저장소 URL]
cd KoreaHistory
```

#### 2. 애플리케이션 실행

아래 Gradle 명령어를 사용하여 애플리케이션을 실행합니다.

```bash
./gradlew bootRun
```

서버는 `localhost:8080`에서 실행됩니다.

### 데이터베이스 확인

애플리케이션 실행 후, 웹 브라우저에서 `http://localhost:8080/h2-console`로 접속하여 H2 데이터베이스 콘솔을 사용할 수 있습니다.

- **JDBC URL**: `jdbc:h2:mem:koreahistory`
- **초기 데이터**: `src/main/resources/data.sql` 파일에 의해 자동으로 생성됩니다

---

## 📖 API 명세

### 1. Chapter (대분류)

#### 대분류 생성

대분류(Chapter)와 하위 소분류(DetailChapter)들을 생성합니다.

```
POST /api/v1/create/chapter
```

**Request Body**

```json
{
  "chapterNumber": 2,
  "chapterTitle": "고대",
  "detailChapters": [
    {
      "number": 3,
      "title": "고구려"
    },
    {
      "number": 4,
      "title": "백제"
    }
  ]
}
```

**Response (200 OK)**

```json
{
  "id": 2,
  "chapterNumber": 2,
  "chapterTitle": "고대",
  "detailChapters": [
    {
      "id": 3,
      "number": 3,
      "title": "고구려"
    },
    {
      "id": 4,
      "number": 4,
      "title": "백제"
    }
  ]
}
```

---

#### 대분류 조회

대분류 제목으로 해당 대분류와 포함된 모든 소분류를 조회합니다.

```
POST /api/v1/search/chapters
```

**Request Body**

```json
{
  "chapterName": "선사시대"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "chapterNumber": 1,
  "chapterTitle": "선사시대",
  "detailChapters": [
    {
      "id": 1,
      "number": 1,
      "title": "구석기 시대 ~ 철기 시대"
    },
    {
      "id": 2,
      "number": 2,
      "title": "고조선과 여러 나라의 성장"
    }
  ]
}
```

---

#### 대분류 번호 수정

ID에 해당하는 대분류의 번호(`chapterNumber`)를 수정합니다.

```
PATCH /api/v1/chapters/{id}/number
```

**Path Parameters**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | Long | 수정할 Chapter ID |

**Request Body**

```json
{
  "chapterNumber": 10
}
```

**Response (200 OK)**

```json
{
  "chapterId": 1,
  "chapterNumber": 10
}
```

---

#### 대분류 제목 수정

ID에 해당하는 대분류의 제목(`chapterTitle`)을 수정합니다.

```
PATCH /api/v1/chapters/{id}/title
```

**Path Parameters**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | Long | 수정할 Chapter ID |

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
  "title": "수정된 대분류 제목"
}
```

---

### 2. DetailChapter (소분류)

#### 소분류 제목 수정

ID에 해당하는 소분류의 제목(`title`)을 수정합니다.

```
PATCH /api/v1/chapters/details/{id}
```

**Path Parameters**

| Parameter | Type | Description |
|:---|:---|:---|
| `id` | Long | 수정할 DetailChapter ID |

**Request Body**

```json
{
  "toChangeDetailTitle": "수정된 소분류 제목"
}
```

**Response (200 OK)**

```json
{
  "detailId": 1,
  "detailNumber": 1,
  "detailTitle": "수정된 소분류 제목"
}
```

---

### 3. Keyword (키워드)

#### 키워드 조회

키워드 이름으로 관련 정보를 조회합니다.

```
POST /api/v1/search/keywords
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
    "number": 1,
    "title": "구석기 시대 ~ 철기 시대"
  },
  "keyword": "뗀석기",
  "keywordContents": [
    {
      "id": 1,
      "content": "돌을 깨뜨리고 떼어 내어 날을 만든 도구인 \"뗀석기를 주로 사용\"하였다."
    }
  ]
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
│   │   │       ├── controller/     # REST API 컨트롤러
│   │   │       ├── service/        # 비즈니스 로직
│   │   │       ├── repository/     # JPA 리포지토리
│   │   │       ├── entity/         # JPA 엔티티
│   │   │       └── dto/            # DTO 클래스
│   │   └── resources/
│   │       ├── application.yml     # 애플리케이션 설정
│   │       └── data.sql            # 초기 데이터
│   └── test/
└── build.gradle
```

---

## 🤝 기여하기

이슈나 PR은 언제나 환영합니다!

---

## 📝 라이센스

이 프로젝트는 [라이센스 유형]에 따라 라이센스가 부여됩니다.
# 🇰🇷 한국사 아띠 (KoreaHistory)

<div align="center">

**체계적인 한국사 학습을 위한 계층형 데이터 관리 플랫폼 & RESTful API**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Gradle](https://img.shields.io/badge/Gradle-8.14.3-02303A.svg?logo=gradle)](https://gradle.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C.svg?logo=hibernate)](https://hibernate.org/)
[![Flyway](https://img.shields.io/badge/Flyway-DB%20Migration-CC0200.svg?logo=flyway)](https://flywaydb.org/)
[![AWS](https://img.shields.io/badge/AWS-Secrets%20Manager-FF9900.svg?logo=amazonaws)](https://aws.amazon.com/secrets-manager/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

• [기능 소개](#-주요-기능)
• [데이터 구조](#-데이터-구조)
• [기술 스택](#-기술-스택)
• [시작하기](#-시작하기-getting-started)
• [API 명세](#-api-명세-endpoints)

</div>

---

## 📖 프로젝트 소개

**한국사 아띠(KoreaHistory)** 는 한국사의 방대한 데이터를 **7단계 계층 구조(Hierarchy)** 로 체계화하여 관리하고 제공하는 웹 플랫폼입니다.

단순한 텍스트 나열이 아닌, 시대(Chapter)부터 세부 내용(Content)까지 논리적으로 연결된 학습 경험을 제공합니다. 관리자는 전용 대시보드를 통해 데이터를 시각적으로 관리할 수 있으며, 학습자는 웹 페이지를 통해 구조화된 한국사 콘텐츠를 학습할 수 있습니다.

---

## ✨ 주요 기능

### 1. 7단계 계층적 데이터 관리

한국사의 흐름을 끊김 없이 연결하기 위해 정교한 7단계 구조를 설계했습니다.

- **구조:** `Chapter` > `Lesson` > `Section` > `Subsection` > `Topic` > `Keyword` > `Content`
- 상위 개념 삭제 시 하위 데이터가 함께 정리되는 **Cascade** 정책 적용

### 2. 다형성(Polymorphism) 기반 ContentBlock 시스템

학습 내용은 단순 텍스트에 그치지 않고, 다양한 형태의 블록으로 구성됩니다. (JSON 기반 저장)

- **TEXT:** 일반 텍스트 설명
- **TABLE:** 키-값 형태의 정보 테이블
- **COMPARISON_TABLE:** 국가/시대 간 비교표
- **TIMELINE:** 역사적 사건의 흐름 (연표)
- **HERITAGE:** 문화재 정보 및 이미지
- **IMAGE_GALLERY:** 관련 유물/유적 갤러리

### 3. 관리자(Admin) & 학습자(Web) 듀얼 인터페이스

- **Admin Dashboard:** 데이터 CRUD, JSON 템플릿 생성기, 실시간 미리보기 제공
- **Web Learning:** 반응형 디자인, 학습 진도 체크, 키워드 검색 및 하이라이팅

### 4. 강력한 검색 시스템

- 키워드 조합 검색 지원 (예: "빗살무늬토기 + 신석기")
- 계층 구조 역추적 검색 (Content 내용을 통해 상위 Chapter 찾기)

---

## 🗂 데이터 구조

이 프로젝트의 핵심은 **7-Layer Hierarchy** 입니다.

<img src = "https://github.com/devKobe24/images2/blob/main/core_seven_layer.jpeg?raw=true">

### 계층 구조 상세

|     엔티티     | 설명                          | 예시                          |
| :------------: | :---------------------------- | :---------------------------- |
|  **Chapter**   | 가장 큰 시대적 구분           | 선사시대, 고대, 고려...       |
|   **Lesson**   | 시대 내의 주요 강의 단위      | 구석기~철기 시대, 삼국의 성립 |
|  **Section**   | 강의를 구성하는 소주제        | 구석기와 신석기               |
| **Subsection** | 구체적인 학습 파트            | 구석기 시대                   |
|   **Topic**    | 학습할 핵심 주제              | 도구, 생활, 사회              |
|  **Keyword**   | 검색 및 학습의 핵심 어휘      | [뗀석기, 주먹도끼]            |
|  **Content**   | 실제 학습 데이터 (JSON Block) | 텍스트, 이미지, 표 등         |

---

## 🛠 기술 스택

### Backend

- **Framework:** Spring Boot 3.5.6 (Java 17)
- **Database:** MySQL 8.x (Prod), H2 (Dev)
- **ORM:** Spring Data JPA
- **Migration:** Flyway (DB 스키마 버전 관리)
- **Cloud:** AWS Secrets Manager (환경 변수 보안 관리)
- **Build:** Gradle 8.14.3

### Frontend (Admin/Web)

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling:** Custom CSS (Responsive), CSS Grid/Flexbox
- **Communication:** Fetch API (RESTful)

---

## 🚀 시작하기 (Getting Started)

### 사전 요구사항

- JDK 17 이상
- MySQL 8.0 이상 (Prod 프로필 사용 시)

### 1. 프로젝트 클론

```bash
git clone https://github.com/devKobe24/KoreaHistory.git
cd KoreaHistory
```

### 2. 설정 파일 (Local 개발)

로컬 개발 환경(`dev` 프로필)은 H2 인메모리 DB를 사용하므로 별도 설정 없이 바로 실행 가능합니다.

- Admin 계정 자동 생성: `admin` / `admin123`

### 3. 애플리케이션 실행

```bash
# Mac/Linux
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

### 4. 접속 주소

- **학습자 웹:** https://a-tti.com/
- **관리자 대시보드:** https://a-tti-admin.com/
- **H2 콘솔:** http://localhost:8080/h2-console

---

## 🔌 API 명세 (Endpoints)

주요 REST API 엔드포인트입니다.

### 📚 Hierarchy Search

| Method | Endpoint                                 | Description         |
| :----: | :--------------------------------------- | :------------------ |
| `GET`  | `/api/v1/chapters/search/all`            | 전체 계층 구조 조회 |
| `GET`  | `/api/v1/search/lessons?title={title}`   | 강의 제목 검색      |
| `GET`  | `/api/v1/search/keywords?keyword={word}` | 키워드 검색         |
| `GET`  | `/api/v1/search/contents?detail={text}`  | 내용 본문 검색      |

### 📝 Management (Admin)

|  Method  | Endpoint                             | Description                       |
| :------: | :----------------------------------- | :-------------------------------- |
|  `POST`  | `/api/v1/create/chapter`             | 대분류 생성 (하위 계층 포함 가능) |
|  `POST`  | `/api/v1/create/content/{keywordId}` | 특정 키워드 하위에 컨텐츠 생성    |
| `PATCH`  | `/api/v1/content/{id}`               | 컨텐츠 수정 (JSON Block 업데이트) |
| `DELETE` | `/api/v1/chapters/{id}`              | 챕터 및 하위 데이터 전체 삭제     |

---

## 📂 프로젝트 구조

### Java 패키지 구조

```
src/main/java/com/kobe/koreahistory
├── config          # Flyway, WebMvc(CORS) 설정
├── controller      # REST API 및 View Controller
├── domain/entity   # JPA Entity (7-Layer + Admin)
├── dto             # Request/Response DTO
├── repository      # Spring Data JPA Repositories
├── service         # 비즈니스 로직 (Transaction 관리)
└── util            # ContentBlockUtil (JSON 처리), JwtUtil
```

### 리소스 구조

```
src/main/resources
├── application.yml         # 공통 설정
├── application-dev.yml     # 개발 프로필 (H2)
├── db/migration/mysql      # Flyway SQL 스크립트
└── static                  # 정적 리소스
    ├── admin               # 관리자 페이지 (HTML/CSS/JS)
    └── web                 # 사용자 페이지 (HTML/CSS/JS)
```

---

## 📜 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

Copyright (c) 2025 Minseong Kang

---
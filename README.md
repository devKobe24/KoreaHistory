# Korean History API 🇰🇷

<div align="center">

한국사 학습을 위한 **계층적 데이터 관리 RESTful API**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[주요 기능](#-주요-기능) •
[시작하기](#-시작하기) •
[API 문서](#-api-명세) •
[기여하기](#-기여하기)

</div>

---

## 📌 프로젝트 소개

Spring Boot와 JPA를 기반으로 한국사의 시대별 대분류(Chapter)부터 세부 키워드(Keyword)까지 **7단계 계층 구조**로 관리하는 API 서버입니다.

### 핵심 특징

- ✅ **계층적 데이터 구조** - Chapter → Lesson → Section → Subsection → Topic → Keyword → Content
- ✅ **완전한 CRUD 지원** - 모든 계층에서 생성, 조회, 수정, 삭제 가능
- ✅ **다중 키워드 관리** - `@ElementCollection`을 활용한 유연한 키워드 저장
- ✅ **Cascade 적용** - 상위 엔티티 삭제 시 하위 데이터 자동 삭제
- ✅ **부분 검색 지원** - 키워드 부분 일치 검색 기능

---

## 🛠️ 기술 스택

| 분류 | 기술 | 버전 |
|:----:|:----:|:----:|
| **Backend** | Java | 17 |
| **Framework** | Spring Boot | 3.5.6 |
| **ORM** | Spring Data JPA | - |
| **Database** | H2 (In-Memory) | - |
| **Build** | Gradle | 8.14.3 |
| **Util** | Lombok | - |

---

## 🗂️ 데이터 구조

### 계층 관계도

```
Chapter (대분류 - 선사시대, 고대)
  │
  └── Lesson (중분류 - 구석기~철기 시대)
        │
        └── Section (소분류 - 구석기와 신석기)
              │
              └── Subsection (서브섹션 - 구석기 시대)
                    │
                    └── Topic (토픽 - 도구, 생활, 사회)
                          │
                          └── Keyword (키워드 그룹)
                                │
                                ├── keywords[] (뗀석기, 주먹도끼...)
                                └── Content (상세 설명)
                                      └── details[] (사용법, 특징...)
```

### 주요 엔티티

| 엔티티 | 설명 | 예시 |
|:------:|:----:|:----:|
| `Chapter` | 시대별 대분류 | 선사시대, 고대 |
| `Lesson` | 시대 내 주제 | 구석기~철기 시대 |
| `Section` | 세부 분류 | 구석기와 신석기 |
| `Subsection` | 상세 주제 | 구석기 시대 |
| `Topic` | 학습 주제 | 도구, 생활, 사회 |
| `Keyword` | 키워드 묶음 | [뗀석기, 주먹도끼, 찍개] |
| `Content` | 학습 내용 | [뗀석기의 사용법, 특징] |

---

## 🚀 시작하기

### 사전 요구사항

```
✓ Java 17 이상 설치
✓ IDE (IntelliJ IDEA 권장)
```

### 설치 및 실행

#### 1️⃣ 프로젝트 클론

```bash
git clone https://github.com/your-username/KoreaHistory.git
cd KoreaHistory
```

#### 2️⃣ 애플리케이션 실행

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

#### 3️⃣ 서버 확인

```
🌐 API 서버: http://localhost:8080
💾 H2 콘솔: http://localhost:8080/h2-console
```

### H2 데이터베이스 접속 정보

| 항목 | 값 |
|:----:|:----|
| **JDBC URL** | `jdbc:h2:mem:koreahistory` |
| **Username** | `sa` |
| **Password** | *(공백)* |

> 💡 **초기 데이터**: `data.sql` 파일로 선사시대 관련 샘플 데이터가 자동 생성됩니다.

---

## 📖 API 명세

### Base URL

```
http://localhost:8080/api/v1
```

### 주요 엔드포인트

#### 📚 Chapter (대분류)

| 메서드 | 엔드포인트 | 설명 |
|:------:|:----------|:-----|
| `GET` | `/chapters/search/all` | 전체 대분류 조회 |
| `POST` | `/search/chapters` | 제목으로 대분류 검색 |
| `POST` | `/create/chapter` | 대분류 생성 (계층 포함) |
| `PATCH` | `/chapters/{id}/number` | 대분류 번호 수정 |
| `PATCH` | `/chapters/{id}/title` | 대분류 제목 수정 |
| `DELETE` | `/chapters/{id}` | 대분류 삭제 |

#### 📖 Lesson (중분류)

| 메서드 | 엔드포인트 | 설명 |
|:------:|:----------|:-----|
| `GET` | `/detail/search?lessonNumber=1&lessonTitle=구석기` | 중분류 검색 |
| `POST` | `/chapters/{chapterId}/details` | 중분류 생성 |
| `PATCH` | `/chapter/lesson/{id}/title` | 중분류 제목 수정 |
| `PATCH` | `/chapter/lesson/{id}/number` | 중분류 번호 수정 |
| `DELETE` | `/lesson/{lessonId}` | 중분류 삭제 |

#### 📄 Section (소분류)

| 메서드 | 엔드포인트 | 설명 |
|:------:|:----------|:-----|
| `GET` | `/search/section/{sectionId}` | 소분류 조회 |
| `POST` | `/create/section/{lessonId}` | 소분류 생성 |
| `PATCH` | `/section/{sectionId}/number` | 소분류 번호 수정 |
| `PATCH` | `/section/{sectionId}/title` | 소분류 제목 수정 |
| `DELETE` | `/section/{sectionId}` | 소분류 삭제 |

#### 🔖 Keyword (키워드)

| 메서드 | 엔드포인트 | 설명 |
|:------:|:----------|:-----|
| `GET` | `/search/keywords?keyword=뗀석기` | 키워드 검색 (부분 일치) |
| `POST` | `/create/keyword?topicTitle=도구` | 키워드 생성 |
| `PATCH` | `/keywords/{keywordId}/update` | 키워드 추가 |
| `PATCH` | `/keyword/number/{keywordId}/update` | 키워드 번호 수정 |
| `DELETE` | `/delete/keyword/{keywordId}` | 특정 키워드 삭제 |
| `DELETE` | `/keyword/group/{id}` | 키워드 그룹 삭제 |

### 요청/응답 예시

<details>
<summary><b>대분류 생성 (POST /create/chapter)</b></summary>

**요청:**
```json
[
  {
    "chapterNumber": 2,
    "chapterTitle": "고대",
    "lessons": [
      {
        "lessonNumber": 1,
        "lessonTitle": "고구려",
        "sections": []
      }
    ]
  }
]
```

**응답 (201 Created):**
```json
[
  {
    "id": 2,
    "chapterNumber": 2,
    "chapterTitle": "고대",
    "lessons": [
      {
        "id": 3,
        "lessonNumber": 1,
        "lessonTitle": "고구려",
        "sections": []
      }
    ]
  }
]
```
</details>

<details>
<summary><b>키워드 검색 (GET /search/keywords?keyword=뗀석기)</b></summary>

**응답 (200 OK):**
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
</details>

> 📘 **전체 API 문서**는 추후 Swagger UI로 제공 예정입니다.

---

## 📁 프로젝트 구조

```
src/main/java/com/kobe/koreahistory/
├── controller/          # REST API 컨트롤러
├── service/            # 비즈니스 로직
├── repository/         # JPA 리포지토리
├── domain/entity/      # JPA 엔티티
└── dto/
    ├── request/        # 요청 DTO
    └── response/       # 응답 DTO
```

---

## 🧪 테스트

```bash
# 전체 테스트 실행
./gradlew test

# 특정 테스트 실행
./gradlew test --tests KoreaHistoryApplicationTests
```

---

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 

### 기여 절차

1. Fork the Project
2. Create Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Convention

이 프로젝트는 **Conventional Commits**를 따릅니다:

```
feat:     새로운 기능 추가
fix:      버그 수정
refactor: 코드 리팩토링
docs:     문서 수정
test:     테스트 코드
chore:    빌드 설정, 기타
```

---

## 🗺️ 로드맵

### v1.0 (현재)
- [x] 기본 CRUD API 구현
- [x] 7단계 계층 구조 구축
- [x] 키워드 검색 기능

### v1.1 (예정)
- [ ] Swagger/OpenAPI 문서화
- [ ] 단위/통합 테스트 확대
- [ ] 예외 처리 표준화
- [ ] 페이징 및 정렬 기능

### v2.0 (계획)
- [ ] 사용자 인증/권한 관리
- [ ] 검색 기능 고도화
- [ ] 학습 진도 추적
- [ ] 이미지 업로드 지원

---

## 📝 라이센스

이 프로젝트는 **MIT 라이센스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📧 문의

프로젝트 관련 문의나 버그 리포트는 [Issues](https://github.com/your-username/KoreaHistory/issues)에 남겨주세요.

**Author**: Minseong Kang

---

## 📚 참고 자료

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [RESTful API Design Best Practices](https://restfulapi.net/)

---

<div align="center">

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!

</div>
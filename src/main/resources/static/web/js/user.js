// ===== 전역 변수 =====
const API_BASE_URL = "http://localhost:8080/api/v1";
let currentFilter = "all";
let searchResults = [];

// ===== DOM 로드 완료 시 실행 =====
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// ===== 앱 초기화 =====
function initializeApp() {
  // 페이지 로드 애니메이션
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);

  setupEventListeners();
  loadChapters();
  loadStats();
  setupScrollToTop();
  setupSmoothScrolling();
  setupMobileMenu();
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
  // 검색 관련
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.querySelector(".search-btn");

  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });

    searchInput.addEventListener("input", function () {
      if (this.value.length > 2) {
        debounceSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
  }

  // 필터 버튼
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      
      // "시대" 필터가 활성화된 경우 모든 Chapter를 로드
      if (currentFilter === "chapter") {
        await loadAllChapters();
      } else {
        filterSearchResults();
      }
    });
  });

  // 스크롤 이벤트
  window.addEventListener("scroll", handleScroll);
}

// ===== 스무스 스크롤링 =====
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== 모바일 메뉴 =====
function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.classList.toggle("active");
    });
  }
}

// ===== 스크롤 투 탑 =====
function setupScrollToTop() {
  const scrollBtn = document.getElementById("scrollToTop");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

function handleScroll() {
  const scrollBtn = document.getElementById("scrollToTop");
  if (scrollBtn) {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  }

  // 헤더 스타일 변경
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }
  }
}

// ===== 챕터 로드 =====
async function loadChapters() {
  const chaptersGrid = document.getElementById("chaptersGrid");
  if (!chaptersGrid) return;

  try {
    showLoading(chaptersGrid);

    const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
    if (!response.ok) throw new Error("챕터를 불러오는데 실패했습니다.");

    const chapters = await response.json();

    if (chapters && chapters.length > 0) {
      displayChapters(chapters);
    } else {
      showEmptyState(chaptersGrid, "아직 등록된 시대가 없습니다.");
    }
  } catch (error) {
    console.error("챕터 로드 오류:", error);
    showError(chaptersGrid, "챕터를 불러오는데 실패했습니다.");
  }
}

function displayChapters(chapters) {
  const chaptersGrid = document.getElementById("chaptersGrid");
  if (!chaptersGrid) return;

  chaptersGrid.innerHTML = "";

  chapters.forEach((chapter, index) => {
    const chapterCard = createChapterCard(chapter, index);
    chaptersGrid.appendChild(chapterCard);
  });

  // 애니메이션 효과
  animateCards(chaptersGrid.children);
}

function createChapterCard(chapter, index) {
  const card = document.createElement("div");
  card.className = "chapter-card";
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";

  const eraIcon = getEraIcon(chapter.title);

  card.innerHTML = `
        <div class="chapter-header">
            <div class="chapter-icon">${eraIcon}</div>
            <div>
                <h3 class="chapter-title">${chapter.chapterTitle}</h3>
                <p class="chapter-description">${
                  chapter.description || "한국사의 중요한 시대입니다."
                }</p>
            </div>
        </div>
        <div class="chapter-stats">
            <div class="stat">
                <div class="stat-number">${chapter.lessons?.length || 0}</div>
                <div class="stat-label">강의</div>
            </div>
            <div class="stat">
                <div class="stat-number">${getTotalSections(chapter)}</div>
                <div class="stat-label">세부주제</div>
            </div>
            <div class="stat">
                <div class="stat-number">${getTotalKeywords(chapter)}</div>
                <div class="stat-label">키워드</div>
            </div>
        </div>
    `;

  card.addEventListener("click", () => {
    openChapterDetail(chapter);
  });

  return card;
}

function getEraIcon(title) {
  if (!title) return "📚";

  const iconMap = {
    선사시대: "🏺",
    고대: "🏛️",
    중세: "🏰",
    근세: "🏮",
    근현대: "🏭",
    현대: "🌆",
  };

  for (const [era, icon] of Object.entries(iconMap)) {
    if (title.includes(era)) {
      return icon;
    }
  }

  return "📚";
}

function getTotalSections(chapter) {
  if (!chapter.lessons) return 0;
  return chapter.lessons.reduce((total, lesson) => {
    return total + (lesson.sections?.length || 0);
  }, 0);
}

function getTotalKeywords(chapter) {
  if (!chapter.lessons) return 0;
  let total = 0;
  chapter.lessons.forEach((lesson) => {
    if (lesson.sections) {
      lesson.sections.forEach((section) => {
        if (section.subsections) {
          section.subsections.forEach((subsection) => {
            if (subsection.topics) {
              subsection.topics.forEach((topic) => {
                // topic.keywords는 키워드 객체 배열
                if (topic.keywords && Array.isArray(topic.keywords)) {
                  topic.keywords.forEach((keyword) => {
                    // keyword.keywords는 문자열 배열
                    if (keyword.keywords && Array.isArray(keyword.keywords)) {
                      total += keyword.keywords.length;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  return total;
}

// ===== 검색 기능 =====
let searchTimeout;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500);
}

async function performSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchResults) return;

  const query = searchInput.value.trim();
  if (query.length < 2) {
    showNoSearch();
    return;
  }

  try {
    showSearchLoading();

    // 여러 검색 API를 병렬로 호출
    const [
      keywordsResponse,
      chaptersResponse,
      contentsResponse,
      lessonsResponse,
      sectionsResponse,
      subsectionsResponse,
      topicsResponse,
    ] = await Promise.all([
      fetch(
        `${API_BASE_URL}/search/keywords?keyword=${encodeURIComponent(query)}`
      ),
      fetch(
        `${API_BASE_URL}/search/chapters?title=${encodeURIComponent(query)}`
      ),
      fetch(
        `${API_BASE_URL}/search/contents?detail=${encodeURIComponent(query)}`
      ),
      fetch(
        `${API_BASE_URL}/search/lessons?title=${encodeURIComponent(query)}`
      ),
      fetch(
        `${API_BASE_URL}/search/sections?title=${encodeURIComponent(query)}`
      ),
      fetch(
        `${API_BASE_URL}/search/subsections?title=${encodeURIComponent(query)}`
      ),
      fetch(`${API_BASE_URL}/search/topics?title=${encodeURIComponent(query)}`),
    ]);

    const keywordsResults = keywordsResponse.ok
      ? await keywordsResponse.json()
      : [];
    const chaptersResults = chaptersResponse.ok
      ? await chaptersResponse.json()
      : [];
    const contentsResults = contentsResponse.ok
      ? await contentsResponse.json()
      : [];
    const lessonsResults = lessonsResponse.ok
      ? await lessonsResponse.json()
      : [];
    const sectionsResults = sectionsResponse.ok
      ? await sectionsResponse.json()
      : [];
    const subsectionsResults = subsectionsResponse.ok
      ? await subsectionsResponse.json()
      : [];
    const topicsResults = topicsResponse.ok ? await topicsResponse.json() : [];

    // 결과를 통합하여 표시
    const allResults = [
      ...chaptersResults.map((chapter) => ({
        id: chapter.id,
        title: chapter.chapterTitle,
        description: `Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`,
        type: "chapter",
        data: chapter,
      })),
      ...lessonsResults.map((lesson) => ({
        id: lesson.id,
        title: lesson.lessonTitle,
        description: `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`,
        type: "lesson",
        data: lesson,
      })),
      ...sectionsResults.map((section) => ({
        id: section.id,
        title: section.sectionTitle,
        description: `Section ${section.sectionNumber}: ${section.sectionTitle}`,
        type: "section",
        data: section,
      })),
      ...subsectionsResults.map((subsection) => ({
        id: subsection.id,
        title: subsection.subsectionTitle,
        description: `Subsection ${subsection.subsectionNumber}: ${subsection.subsectionTitle}`,
        type: "subsection",
        data: subsection,
      })),
      ...topicsResults.map((topic) => ({
        id: topic.id,
        title: topic.topicTitle,
        description: `Topic ${topic.topicNumber}: ${topic.topicTitle}`,
        type: "topic",
        data: topic,
      })),
      ...keywordsResults.map((keyword) => ({
        id: keyword.id,
        title: keyword.keywords ? keyword.keywords.join(", ") : "키워드",
        description: `키워드 그룹`,
        type: "keyword",
        data: keyword,
      })),
      ...contentsResults.map((content) => ({
        id: content.id,
        title: content.details ? content.details.join(", ") : "내용",
        description: `상세 내용`,
        type: "content",
        data: content,
      })),
    ];

    displaySearchResults(allResults);
  } catch (error) {
    console.error("검색 오류:", error);
    showSearchError();
  }
}

function showSearchLoading() {
  const searchResults = document.getElementById("searchResults");
  if (searchResults) {
    searchResults.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>검색 중...</p>
            </div>
        `;
  }
}

function displaySearchResults(results) {
  const searchResults = document.getElementById("searchResults");
  if (!searchResults) return;

  if (!results || results.length === 0) {
    showNoResults();
    return;
  }

  searchResults.innerHTML = "";

  results.forEach((result) => {
    const resultItem = createResultItem(result);
    searchResults.appendChild(resultItem);
  });

  // 애니메이션 효과
  animateCards(searchResults.children);
}

function createResultItem(result) {
  const item = document.createElement("div");
  item.className = `result-item result-${result.type || "default"}`;

  let typeIcon, typeLabel;
  switch (result.type) {
    case "chapter":
      typeIcon = "📚";
      typeLabel = "시대";
      break;
    case "lesson":
      typeIcon = "📖";
      typeLabel = "강의";
      break;
    case "section":
      typeIcon = "📑";
      typeLabel = "소분류";
      break;
    case "subsection":
      typeIcon = "📋";
      typeLabel = "상세분류";
      break;
    case "topic":
      typeIcon = "🎯";
      typeLabel = "강의";
      break;
    case "keyword":
      typeIcon = "🏷️";
      typeLabel = "키워드";
      break;
    case "content":
      typeIcon = "📄";
      typeLabel = "내용";
      break;
    default:
      typeIcon = "📝";
      typeLabel = "기타";
  }

  item.innerHTML = `
        <div class="result-header">
            <span class="result-icon">${typeIcon}</span>
            <h4 class="result-title">${
              result.title || result.name || "제목 없음"
            }</h4>
            <span class="result-type">${typeLabel}</span>
        </div>
        <p class="result-description">${
          result.description || result.content || "설명이 없습니다."
        }</p>
    `;

  item.addEventListener("click", () => {
    openResultDetail(result);
  });

  return item;
}

// 모든 Chapter를 검색 결과 영역에 표시
async function loadAllChapters() {
  const searchResults = document.getElementById("searchResults");
  if (!searchResults) return;

  try {
    showSearchLoading();

    const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
    if (!response.ok) throw new Error("챕터를 불러오는데 실패했습니다.");

    const chapters = await response.json();

    if (chapters && chapters.length > 0) {
      const allResults = chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.chapterTitle,
        description: `Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`,
        type: "chapter",
        data: chapter,
      }));

      displaySearchResults(allResults);
    } else {
      showNoResults();
    }
  } catch (error) {
    console.error("Chapter 로드 오류:", error);
    showSearchError();
  }
}

function filterSearchResults() {
  const resultItems = document.querySelectorAll(".result-item");
  resultItems.forEach((item) => {
    if (currentFilter === "all") {
      item.style.display = "block";
    } else if (currentFilter === "chapter") {
      item.style.display = item.classList.contains("result-chapter")
        ? "block"
        : "none";
    } else if (currentFilter === "lesson") {
      item.style.display = item.classList.contains("result-lesson")
        ? "block"
        : "none";
    } else if (currentFilter === "section") {
      item.style.display = item.classList.contains("result-section")
        ? "block"
        : "none";
    } else if (currentFilter === "subsection") {
      item.style.display = item.classList.contains("result-subsection")
        ? "block"
        : "none";
    } else if (currentFilter === "topic") {
      item.style.display = item.classList.contains("result-topic")
        ? "block"
        : "none";
    } else if (currentFilter === "keyword") {
      item.style.display = item.classList.contains("result-keyword")
        ? "block"
        : "none";
    } else if (currentFilter === "content") {
      item.style.display = item.classList.contains("result-content")
        ? "block"
        : "none";
    } else {
      item.style.display = "block";
    }
  });
}

function showNoSearch() {
  const searchResults = document.getElementById("searchResults");
  if (searchResults) {
    searchResults.innerHTML = `
            <div class="no-search">
                <div class="no-search-icon">🔍</div>
                <p>검색어를 입력하여 관련 학습 자료를 찾아보세요</p>
            </div>
        `;
  }
}

function showNoResults() {
  const searchResults = document.getElementById("searchResults");
  if (searchResults) {
    searchResults.innerHTML = `
            <div class="no-search">
                <div class="no-search-icon">😔</div>
                <p>검색 결과가 없습니다. 다른 검색어를 시도해보세요.</p>
            </div>
        `;
  }
}

function showSearchError() {
  const searchResults = document.getElementById("searchResults");
  if (searchResults) {
    searchResults.innerHTML = `
            <div class="no-search">
                <div class="no-search-icon">⚠️</div>
                <p>검색 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
        `;
  }
}

// ===== 통계 로드 =====
async function loadStats() {
  try {
    const [chaptersRes, lessonsRes, keywordsRes, contentsRes] =
      await Promise.all([
        fetch(`${API_BASE_URL}/chapters/search/all`),
        fetch(`${API_BASE_URL}/lessons/search/all`),
        fetch(`${API_BASE_URL}/keywords/search/all`),
        fetch(`${API_BASE_URL}/contents/search/all`),
      ]);

    const chapters = chaptersRes.ok ? await chaptersRes.json() : [];
    const lessons = lessonsRes.ok ? await lessonsRes.json() : [];
    const keywords = keywordsRes.ok ? await keywordsRes.json() : [];
    const contents = contentsRes.ok ? await contentsRes.json() : [];

    // 키워드 총 개수 계산: 각 Keyword 객체의 keywords 배열의 길이 합산
    const totalKeywords = keywords.reduce((total, keyword) => {
      return total + (keyword.keywords?.length || 0);
    }, 0);

    updateStats({
      chapters: chapters.length,
      lessons: lessons.length,
      keywords: totalKeywords, // 키워드 객체 개수가 아닌 keywords_value 총 개수
      contents: contents.length,
    });
  } catch (error) {
    console.error("통계 로드 오류:", error);
    updateStats({ chapters: 0, lessons: 0, keywords: 0, contents: 0 });
  }
}

function updateStats(stats) {
  const elements = {
    totalChapters: document.getElementById("totalChapters"),
    totalLessons: document.getElementById("totalLessons"),
    totalKeywords: document.getElementById("totalKeywords"),
    totalContents: document.getElementById("totalContents"),
  };

  Object.entries(elements).forEach(([key, element]) => {
    if (element) {
      const statKey = key.replace("total", "").toLowerCase();
      const targetNumber = stats[statKey] || 0;
      // 애니메이션 없이 바로 목표값 표시
      element.textContent = targetNumber;
    }
  });
}

function animateNumber(element, targetNumber) {
  // 이미 표시된 숫자가 있으면 그 숫자부터 시작
  const startNumber = parseInt(element.textContent) || 0;
  const duration = 1000;
  const increment = (targetNumber - startNumber) / (duration / 16);
  let currentNumber = startNumber;

  const timer = setInterval(() => {
    currentNumber += increment;
    if (
      (increment > 0 && currentNumber >= targetNumber) ||
      (increment < 0 && currentNumber <= targetNumber)
    ) {
      currentNumber = targetNumber;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentNumber);
  }, 16);
}

// ===== 유틸리티 함수 =====
function showLoading(container) {
  container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>데이터를 불러오는 중...</p>
        </div>
    `;
}

function showEmptyState(container, message) {
  container.innerHTML = `
        <div class="no-search">
            <div class="no-search-icon">📚</div>
            <p>${message}</p>
        </div>
    `;
}

function showError(container, message) {
  container.innerHTML = `
        <div class="no-search">
            <div class="no-search-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
}

function animateCards(cards) {
  Array.from(cards).forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// ===== 섹션 스크롤 =====
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// ===== 상세 페이지 열기 =====
function openChapterDetail(chapter) {
  // 실제 구현에서는 상세 페이지로 이동
  alert(
    `"${chapter.title}" 상세 페이지로 이동합니다.\n\n(실제 구현에서는 별도 페이지로 이동)`
  );
}

function openResultDetail(result) {
  // result.html로 이동하면서 제목을 URL 파라미터로 전달
  const title = encodeURIComponent(result.title || result.name || "제목 없음");
  const type = result.type || "default";
  window.location.href = `pages/result.html?title=${title}&type=${type}`;
}

// ===== 에러 처리 =====
window.addEventListener("error", function (e) {
  console.error("전역 오류:", e.error);
});

// ===== 네트워크 상태 확인 =====
window.addEventListener("online", function () {
  console.log("네트워크 연결됨");
});

window.addEventListener("offline", function () {
  console.log("네트워크 연결 끊어짐");
  showError(document.body, "네트워크 연결을 확인해주세요.");
});

// ===== 성능 모니터링 =====
window.addEventListener("load", function () {
  const loadTime = performance.now();
  console.log(`페이지 로드 시간: ${Math.round(loadTime)}ms`);
});

// ===== 키보드 단축키 =====
document.addEventListener("keydown", function (e) {
  // Ctrl + K로 검색 포커스
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.focus();
    }
  }

  // ESC로 검색 초기화
  if (e.key === "Escape") {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
      showNoSearch();
    }
  }
});

// ===== 페이지 전환 애니메이션 =====
function navigateToChapter() {
  // 페이드 아웃 애니메이션
  document.body.classList.add("page-fade-out");

  // 애니메이션 완료 후 페이지 이동
  setTimeout(() => {
    window.location.href = "pages/chapter.html";
  }, 300);
}

// 페이지 전환 애니메이션을 위한 전역 함수로 등록
window.navigateToChapter = navigateToChapter;

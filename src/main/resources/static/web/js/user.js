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
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      filterSearchResults();
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
                <p class="chapter-description">${chapter.description || "한국사의 중요한 시대입니다."}</p>
            </div>
        </div>
        <div class="chapter-stats">
            <div class="stat">
                <div class="stat-number">${chapter.lessons?.length || 0}</div>
                <div class="stat-label">주제</div>
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
                total += topic.keywords?.length || 0;
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

    const response = await fetch(
      `${API_BASE_URL}/search/keywords?keyword=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("검색에 실패했습니다.");

    const results = await response.json();
    displaySearchResults(results);
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
  item.className = "result-item";

  item.innerHTML = `
        <h4 class="result-title">${result.title || result.name || "제목 없음"}</h4>
        <p class="result-description">${result.description || result.content || "설명이 없습니다."}</p>
        <div class="result-meta">
            <span>타입: ${result.type || "알 수 없음"}</span>
            <span>ID: ${result.id || "N/A"}</span>
        </div>
    `;

  item.addEventListener("click", () => {
    openResultDetail(result);
  });

  return item;
}

function filterSearchResults() {
  const resultItems = document.querySelectorAll(".result-item");
  resultItems.forEach((item) => {
    if (currentFilter === "all") {
      item.style.display = "block";
    } else {
      // 실제 구현에서는 결과 타입에 따라 필터링
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

    updateStats({
      chapters: chapters.length,
      lessons: lessons.length,
      keywords: keywords.length,
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
      animateNumber(element, stats[statKey] || 0);
    }
  });
}

function animateNumber(element, targetNumber) {
  const startNumber = 0;
  const duration = 2000;
  const increment = targetNumber / (duration / 16);
  let currentNumber = startNumber;

  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= targetNumber) {
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
  // 실제 구현에서는 결과 상세 페이지로 이동
  alert(
    `"${result.title || result.name}" 상세 정보를 표시합니다.\n\n(실제 구현에서는 상세 모달 또는 페이지 표시)`
  );
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

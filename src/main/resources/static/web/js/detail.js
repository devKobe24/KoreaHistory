// ===== Detail Page JavaScript =====

(function () {
  "use strict";

  const API_BASE_URL = "/api/v1";
  let currentItem = null;
  let isBookmarked = false;

  // ===== DOM Elements =====
  const elements = {
    // Navigation
    navTitle: document.getElementById("navTitle"),
    breadcrumbCategory: document.getElementById("breadcrumbCategory"),
    breadcrumbTitle: document.getElementById("breadcrumbTitle"),

    // Detail Info
    detailMainImage: document.getElementById("detailMainImage"),
    metaType: document.getElementById("metaType"),
    detailCategory: document.getElementById("detailCategory"),
    detailTitle: document.getElementById("detailTitle"),
    detailSubtitle: document.getElementById("detailSubtitle"),
    detailDescription: document.getElementById("detailDescription"),

    // Actions
    bookmarkBtn: document.getElementById("bookmarkBtn"),
    shareBtn: document.getElementById("shareBtn"),
    startLearningBtn: document.getElementById("startLearningBtn"),
    addToListBtn: document.getElementById("addToListBtn"),

    // Modal
    shareModal: document.getElementById("shareModal"),
    shareModalOverlay: document.getElementById("shareModalOverlay"),
    closeShareModal: document.getElementById("closeShareModal"),

    // Related
    relatedGrid: document.getElementById("relatedGrid"),
  };

  // ===== Initialize =====
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setupPage();
        setupEventListeners();
        setupAccordion();
        document.body.classList.add("loaded");
      });
    } else {
      setupPage();
      setupEventListeners();
      setupAccordion();
      document.body.classList.add("loaded");
    }
  }

  // ===== Setup Page =====
  function setupPage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const title = urlParams.get("title");
      const type = urlParams.get("type");

      console.log("Detail Page - Title:", title, "Type:", type);

      if (title && type) {
        loadDetailData(title, type);
      } else {
        // 기본 데이터 표시
        showDefaultData();
      }
    } catch (error) {
      console.error("Error in setupPage:", error);
      showDefaultData();
    }
  }

  // ===== Load Detail Data =====
  function loadDetailData(title, type) {
    // 실제 API 호출 대신 더미 데이터 사용
    currentItem = {
      type: type,
      title: decodeURIComponent(title),
      subtitle: getSubtitleByType(type),
      description: getDescriptionByType(type),
      icon: getIconByType(type),
      category: getCategoryLabel(type),
    };

    updatePageContent(currentItem);
    loadRelatedItems(type);
  }

  // ===== Update Page Content =====
  function updatePageContent(item) {
    // Update title
    document.title = item.title + " - 한국사 아띠";

    // Update navigation
    if (elements.navTitle) {
      elements.navTitle.textContent = "🇰🇷 " + item.title;
    }

    // Update breadcrumb
    if (elements.breadcrumbCategory) {
      elements.breadcrumbCategory.textContent = item.category;
    }
    if (elements.breadcrumbTitle) {
      elements.breadcrumbTitle.textContent = item.title;
    }

    // Update detail content
    if (elements.detailMainImage) {
      elements.detailMainImage.innerHTML = `<span class="detail-icon">${item.icon}</span>`;
    }
    if (elements.metaType) {
      elements.metaType.textContent = item.category;
    }
    if (elements.detailCategory) {
      elements.detailCategory.textContent = item.category;
    }
    if (elements.detailTitle) {
      elements.detailTitle.textContent = item.title;
    }
    if (elements.detailSubtitle) {
      elements.detailSubtitle.textContent = item.subtitle;
    }
    if (elements.detailDescription) {
      elements.detailDescription.innerHTML = `<p>${item.description}</p>`;
    }
  }

  // ===== Helper Functions =====
  function getIconByType(type) {
    const icons = {
      chapter: "📚",
      lesson: "📖",
      section: "📑",
      subsection: "📋",
      topic: "🎯",
      keyword: "🏷️",
      content: "📄",
    };
    return icons[type] || "📝";
  }

  function getCategoryLabel(type) {
    const labels = {
      chapter: "시대",
      lesson: "주제",
      section: "소분류",
      subsection: "상세분류",
      topic: "주제",
      keyword: "키워드",
      content: "내용",
    };
    return labels[type] || "학습 자료";
  }

  function getSubtitleByType(type) {
    const subtitles = {
      chapter: "한국사의 주요 시대를 학습합니다",
      lesson: "시대별 주요 주제를 깊이 있게 학습합니다",
      section: "세부적인 역사적 사건과 내용을 학습합니다",
      subsection: "상세한 역사적 배경과 의미를 이해합니다",
      topic: "특정 주제에 대해 집중적으로 학습합니다",
      keyword: "핵심 키워드를 통해 역사를 이해합니다",
      content: "구체적인 역사 내용을 학습합니다",
    };
    return subtitles[type] || "한국사 학습 자료입니다";
  }

  function getDescriptionByType(type) {
    const descriptions = {
      chapter:
        "한국사의 주요 시대를 개괄적으로 이해하고, 시대별 특징과 주요 사건들을 학습합니다. 각 시대의 정치, 경제, 사회, 문화적 특징을 파악하여 역사의 흐름을 이해할 수 있습니다.",
      lesson:
        "시대를 대표하는 주요 주제들을 심도 있게 학습합니다. 역사적 사건의 배경과 전개 과정, 그리고 그 영향을 종합적으로 이해할 수 있습니다.",
      section:
        "세부적인 역사적 사건과 내용을 구체적으로 학습합니다. 관련 사료와 자료를 통해 역사적 사실을 정확하게 이해할 수 있습니다.",
      subsection:
        "역사적 사건의 상세한 배경과 의미를 깊이 있게 탐구합니다. 다양한 관점에서 역사를 바라보고 비판적으로 사고할 수 있습니다.",
      topic:
        "특정 주제에 초점을 맞추어 집중적으로 학습합니다. 주제와 관련된 다양한 역사적 사실들을 연결하여 이해할 수 있습니다.",
      keyword:
        "핵심 키워드를 중심으로 역사적 내용을 체계적으로 정리합니다. 키워드를 통해 역사의 중요 개념을 효과적으로 학습할 수 있습니다.",
      content:
        "구체적인 역사 내용과 사실을 상세하게 학습합니다. 관련 자료와 해석을 통해 역사를 깊이 있게 이해할 수 있습니다.",
    };
    return descriptions[type] || "한국사 학습을 위한 자료입니다.";
  }

  function showDefaultData() {
    const defaultItem = {
      type: "chapter",
      title: "고대 한국사",
      subtitle: "한국 고대사의 전반적인 흐름과 주요 사건들을 학습합니다",
      description:
        "고대 한국사는 선사시대부터 통일신라 시대까지를 포괄합니다. 고조선의 건국으로부터 시작하여 삼국시대를 거쳐 통일신라에 이르는 한국 고대의 역사적 발전 과정을 이해할 수 있습니다.",
      icon: "🏛️",
      category: "시대",
    };

    currentItem = defaultItem;
    updatePageContent(defaultItem);
    loadRelatedItems("chapter");
  }

  // ===== Event Listeners =====
  function setupEventListeners() {
    // Bookmark button
    if (elements.bookmarkBtn) {
      elements.bookmarkBtn.addEventListener("click", handleBookmark);
    }

    // Share button
    if (elements.shareBtn) {
      elements.shareBtn.addEventListener("click", openShareModal);
    }

    // Modal close
    if (elements.closeShareModal) {
      elements.closeShareModal.addEventListener("click", closeShareModal);
    }
    if (elements.shareModalOverlay) {
      elements.shareModalOverlay.addEventListener("click", closeShareModal);
    }

    // Share options
    document.querySelectorAll(".share-option").forEach((btn) => {
      btn.addEventListener("click", function () {
        handleShare(this.dataset.platform);
      });
    });

    // CTA buttons
    if (elements.startLearningBtn) {
      elements.startLearningBtn.addEventListener("click", handleStartLearning);
    }
    if (elements.addToListBtn) {
      elements.addToListBtn.addEventListener("click", handleAddToList);
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", handleKeyboard);
  }

  // ===== Accordion =====
  function setupAccordion() {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const item = this.parentElement;
        const isActive = item.classList.contains("active");

        // Close all accordion items
        document.querySelectorAll(".accordion-item").forEach((i) => {
          i.classList.remove("active");
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add("active");
          
          // "주요 학습 내용" 아코디언이 활성화되면 관련 Lesson 로드
          const accordionTitle = this.querySelector(".accordion-title");
          if (accordionTitle && accordionTitle.textContent.includes("주요 학습 내용")) {
            loadLessonCards();
          }
        }
      });
    });

    // 아코디언을 기본적으로 비활성화 상태로 설정
    // 사용자가 직접 클릭해야만 아코디언이 열리도록 함
  }

  // ===== Bookmark Handler =====
  function handleBookmark() {
    isBookmarked = !isBookmarked;

    if (elements.bookmarkBtn) {
      if (isBookmarked) {
        elements.bookmarkBtn.classList.add("active");
        showToast("북마크에 추가되었습니다", "✓");
      } else {
        elements.bookmarkBtn.classList.remove("active");
        showToast("북마크에서 제거되었습니다", "ℹ");
      }
    }

    // 실제로는 서버에 저장
    console.log("Bookmark:", isBookmarked, currentItem);
  }

  // ===== Share Modal =====
  function openShareModal() {
    if (elements.shareModal) {
      elements.shareModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeShareModal() {
    if (elements.shareModal) {
      elements.shareModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function handleShare(platform) {
    const url = window.location.href;
    const title = currentItem ? currentItem.title : "한국사 아띠";
    const text = currentItem ? currentItem.subtitle : "한국사 학습 플랫폼";

    switch (platform) {
      case "kakao":
        // Kakao Share API
        showToast("카카오톡 공유 준비 중...", "💬");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "copy":
        copyToClipboard(url);
        showToast("링크가 복사되었습니다", "✓");
        break;
    }

    closeShareModal();
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }

  // ===== CTA Handlers =====
  function handleStartLearning() {
    console.log("Start Learning:", currentItem);
    showToast("학습 페이지로 이동합니다", "📖");

    // study.html로 이동
    setTimeout(() => {
      const title = currentItem ? encodeURIComponent(currentItem.title) : "";
      const type = currentItem ? currentItem.type : "chapter";
      window.location.href = `study.html?title=${title}&type=${type}`;
    }, 800);
  }

  function handleAddToList() {
    console.log("Add to List:", currentItem);
    showToast("학습 목록에 추가되었습니다", "✓");

    // 실제로는 서버에 저장
  }

  // ===== Toast Notification =====
  function showToast(message, icon = "ℹ") {
    // Remove existing toast
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Hide toast
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // ===== Load Lesson Cards =====
  async function loadLessonCards() {
    try {
      if (!currentItem) return;
      
      // "주요 학습 내용" 아코디언의 컨텐츠 찾기
      const accordionItems = document.querySelectorAll(".accordion-item");
      let targetAccordionContent = null;
      
      for (const item of accordionItems) {
        const title = item.querySelector(".accordion-title");
        if (title && title.textContent.includes("주요 학습 내용")) {
          targetAccordionContent = item.querySelector(".accordion-content");
          break;
        }
      }
      
      if (!targetAccordionContent) return;
      
      // 로딩 상태 표시
      targetAccordionContent.innerHTML = '<div class="lesson-loading"><div class="spinner"></div><p>관련 강의를 불러오는 중...</p></div>';
      
      let lessons = [];
      
      // Chapter 타입인 경우 해당 Chapter의 Lesson들을 가져오기
      if (currentItem.type === "chapter") {
        const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
        if (response.ok) {
          const chapters = await response.json();
          const chapter = chapters.find(c => c.chapterTitle === currentItem.title);
          if (chapter && chapter.lessons) {
            lessons = chapter.lessons.map(lesson => ({
              type: "lesson",
              id: lesson.id,
              title: lesson.lessonTitle,
              description: `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`,
              number: lesson.lessonNumber,
              icon: "📖"
            }));
          }
        }
      } else {
        // 다른 타입의 경우 검색으로 Lesson 찾기
        const searchPromises = [
          fetch(`${API_BASE_URL}/search/lessons?title=${encodeURIComponent(currentItem.title)}`).then(r => r.ok ? r.json() : []),
        ];
        
        const results = await Promise.all(searchPromises);
        lessons = results[0].map(lesson => ({
          type: "lesson",
          id: lesson.id,
          title: lesson.lessonTitle,
          description: `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`,
          number: lesson.lessonNumber,
          icon: "📖"
        }));
      }
      
      // Lesson 카드들 표시
      if (lessons.length > 0) {
        displayLessonCards(lessons, targetAccordionContent);
      } else {
        targetAccordionContent.innerHTML = '<div class="lesson-empty"><p>관련 강의가 없습니다.</p></div>';
      }
      
    } catch (error) {
      console.error("Error loading lesson cards:", error);
      const accordionItems = document.querySelectorAll(".accordion-item");
      let targetAccordionContent = null;
      
      for (const item of accordionItems) {
        const title = item.querySelector(".accordion-title");
        if (title && title.textContent.includes("주요 학습 내용")) {
          targetAccordionContent = item.querySelector(".accordion-content");
          break;
        }
      }
      
      if (targetAccordionContent) {
        targetAccordionContent.innerHTML = '<div class="lesson-error"><p>강의를 불러오는 중 오류가 발생했습니다.</p></div>';
      }
    }
  }

  // ===== Display Lesson Cards =====
  function displayLessonCards(lessons, container) {
    container.innerHTML = '<div class="lesson-cards-container"></div>';
    const cardsContainer = container.querySelector('.lesson-cards-container');
    
    lessons.forEach((lesson, index) => {
      const card = createLessonCard(lesson, index);
      cardsContainer.appendChild(card);
    });
  }

  // ===== Create Lesson Card =====
  function createLessonCard(lesson, index) {
    const card = document.createElement("div");
    card.className = "lesson-card";
    
    // 인라인 스타일로 새로운 디자인 강제 적용
    card.style.cssText = `
      padding: 1rem;
      min-height: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    
    // 상단 파란색 라인 추가
    const topLine = document.createElement("div");
    topLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #3b82f6;
      border-radius: 8px 8px 0 0;
    `;
    card.appendChild(topLine);
    
    // 헤더 (아이콘 + 태그)
    const header = document.createElement("div");
    header.className = "lesson-card-header";
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
    
    const icon = document.createElement("span");
    icon.className = "lesson-card-icon";
    icon.textContent = lesson.icon;
    icon.style.cssText = `
      font-size: 1.25rem;
      color: #4b5563;
    `;
    
    const type = document.createElement("span");
    type.className = "lesson-card-type";
    type.textContent = "강의";
    type.style.cssText = `
      padding: 0.25rem 0.75rem;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    `;
    
    header.appendChild(icon);
    header.appendChild(type);
    
    // 제목
    const title = document.createElement("h4");
    title.className = "lesson-card-title";
    title.textContent = lesson.title;
    title.style.cssText = `
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
    `;
    
    // 설명
    const description = document.createElement("p");
    description.className = "lesson-card-description";
    description.textContent = lesson.description;
    description.style.cssText = `
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.4;
      margin: 0;
    `;
    
    // 하단 (번호 + 액션)
    const bottom = document.createElement("div");
    bottom.className = "lesson-card-bottom";
    bottom.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    const number = document.createElement("span");
    number.className = "lesson-card-number";
    number.textContent = `${lesson.number}강`;
    number.style.cssText = `
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      margin: 0;
    `;
    
    const action = document.createElement("button");
    action.className = "lesson-card-action";
    action.textContent = "학습하기→";
    action.style.cssText = `
      font-size: 0.875rem;
      color: #3b82f6;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
    `;
    
    bottom.appendChild(number);
    bottom.appendChild(action);
    
    // 모든 요소를 카드에 추가
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(bottom);
    
    // 클릭 이벤트
    card.addEventListener("click", () => {
      const title = encodeURIComponent(lesson.title);
      window.location.href = `detail.html?title=${title}&type=lesson`;
    });
    
    // 호버 효과
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-1px)";
      card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      card.style.borderColor = "#3b82f6";
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
      card.style.borderColor = "#e5e7eb";
    });
    
    // 애니메이션
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
    
    return card;
  }

  // ===== Load Related Items =====
  function loadRelatedItems(type) {
    // 더미 데이터
    const relatedItems = [
      {
        type: "lesson",
        title: "삼국시대의 문화",
        description: "삼국의 독특한 문화적 특징을 학습합니다",
        icon: "📖",
      },
      {
        type: "section",
        title: "고구려의 건국",
        description: "고구려의 건국 과정과 초기 발전을 알아봅니다",
        icon: "📑",
      },
      {
        type: "topic",
        title: "신라의 삼국통일",
        description: "신라가 삼국을 통일하는 과정을 이해합니다",
        icon: "🎯",
      },
      {
        type: "content",
        title: "백제의 문화유산",
        description: "백제가 남긴 다양한 문화유산을 살펴봅니다",
        icon: "📄",
      },
    ];

    if (elements.relatedGrid) {
      elements.relatedGrid.innerHTML = "";
      relatedItems.forEach((item) => {
        const card = createRelatedCard(item);
        elements.relatedGrid.appendChild(card);
      });
    }
  }

  function createRelatedCard(item) {
    const card = document.createElement("div");
    card.className = "related-card";

    const categoryLabel = getCategoryLabel(item.type);

    card.innerHTML = `
            <div class="related-image">
                <span class="related-icon">${item.icon}</span>
            </div>
            <div class="related-info">
                <span class="related-category">${categoryLabel}</span>
                <h3 class="related-title">${item.title}</h3>
                <p class="related-desc">${item.description}</p>
                <a href="#" class="related-link">자세히 보기 →</a>
            </div>
        `;

    card.addEventListener("click", function (e) {
      e.preventDefault();
      const title = encodeURIComponent(item.title);
      window.location.href = `detail.html?title=${title}&type=${item.type}`;
    });

    return card;
  }

  // ===== Keyboard Shortcuts =====
  function handleKeyboard(e) {
    // ESC to close modal
    if (e.key === "Escape") {
      closeShareModal();
    }

    // Ctrl/Cmd + D to bookmark
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      handleBookmark();
    }

    // Ctrl/Cmd + S to share
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      openShareModal();
    }

    // Enter to start learning
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleStartLearning();
    }
  }

  // ===== Initialize =====
  init();
})();

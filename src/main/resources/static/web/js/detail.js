(function () {
  "use strict";

  const API_BASE_URL = "/api/v1";
  let currentItem = null;
  let isBookmarked = false;
  let currentHierarchyData = null;

  const hierarchyEndpoints = {
    chapter: "/chapters/hierarchy",
    lesson: "/lessons/hierarchy",
    section: "/sections/hierarchy",
    subsection: "/subsections/hierarchy",
    topic: "/topics/hierarchy",
    keyword: "/keywords/hierarchy",
    content: "/contents/hierarchy",
  };

  const hierarchyMeta = {
    chapter: { badge: "시대", icon: "📚", accentColor: "#6366f1", numberSuffix: "장" },
    lesson: { badge: "강의", icon: "📖", accentColor: "#3b82f6", numberSuffix: "강" },
    section: { badge: "소분류", icon: "📑", accentColor: "#f59e0b", numberSuffix: "절" },
    subsection: { badge: "상세분류", icon: "📋", accentColor: "#10b981", numberSuffix: "항" },
    topic: { badge: "주제", icon: "🎯", accentColor: "#ef4444", numberSuffix: "편" },
    keyword: { badge: "키워드", icon: "🏷️", accentColor: "#8b5cf6", numberSuffix: "번" },
    content: { badge: "내용", icon: "📄", accentColor: "#0ea5e9", numberSuffix: "번" },
  };

  async function renderHierarchyByType(container) {
    if (!currentItem || !currentItem.type) return false;

    currentHierarchyData = null;
    let hierarchyData = null;
    switch (currentItem.type) {
      case "chapter":
      case "lesson":
      case "section":
      case "subsection":
      case "topic":
      case "keyword":
      case "content":
        hierarchyData = await fetchHierarchyData(
          currentItem.type,
          currentItem.title,
          currentItem.id
        );
        break;
      default:
        return false;
    }

    if (!hierarchyData) {
      return false;
    }

    currentHierarchyData = hierarchyData;
    renderHierarchyCards(container, hierarchyData);
    updateDataAttributes(currentItem);
    return true;
  }

  async function preloadHierarchyData(type, title, id) {
    if (!type || (!title && !id)) return;
    if (!hierarchyEndpoints[type]) return;

    try {
      currentHierarchyData = await fetchHierarchyData(type, title, id);
      return currentHierarchyData;
    } catch (error) {
      console.warn("Hierarchy preload failed:", error);
      currentHierarchyData = null;
      return null;
    }
  }

  async function ensureHierarchyData(type, title, id) {
    if (currentHierarchyData) {
      return currentHierarchyData;
    }

    if (!type || (!title && !id)) {
      return null;
    }

    try {
      currentHierarchyData = await fetchHierarchyData(type, title, id);
      return currentHierarchyData;
    } catch (error) {
      console.warn("Failed to ensure hierarchy data:", error);
      currentHierarchyData = null;
      return null;
    }
  }

  async function fetchHierarchyData(type, title, id) {
    try {
      const endpoint = hierarchyEndpoints[type];
      if (!endpoint) return null;

      const params = new URLSearchParams();
      if (id !== undefined && id !== null && id !== "") {
        params.set("id", id);
      }
      if (title) {
        params.set("title", title);
      }
      const queryString = params.toString();
      const response = await fetch(
        `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch hierarchy data:", error);
      return null;
    }
  }

  function renderHierarchyCards(container, hierarchyData) {
    const cardsData = buildHierarchyCardData(hierarchyData);

    if (!cardsData.length) {
      container.innerHTML =
        '<div class="lesson-empty"><p>관련 학습 카드가 없습니다.</p></div>';
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "chapter-cards-container";
    wrapper.style.cssText = `
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      margin-top: 0.5rem;
    `;

    container.innerHTML = "";
    cardsData.forEach((cardData, index) => {
      const cardElement = createHierarchyCard(cardData, index);
      wrapper.appendChild(cardElement);
    });
    container.appendChild(wrapper);
  }

  function buildHierarchyCardData(hierarchyData) {
    const cards = [];
    const chainOrder = ["chapter", "lesson", "section", "subsection", "topic", "keyword", "content"];

    chainOrder.forEach((type) => {
      const info = hierarchyData[type];
      if (info) {
        const card = createCardDefinition(type, info, {
          isCurrent: hierarchyData.type === type,
          isPrimary: true,
        });
        if (card) {
          cards.push(card);
        }
      }
    });

    if (hierarchyData.chapter?.lessons?.length) {
      uniqueById(hierarchyData.chapter.lessons).forEach((lesson) => {
        if (hierarchyData.lesson && hierarchyData.lesson.id === lesson.id) return;
        const card = createCardDefinition("lesson", lesson, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    if (hierarchyData.lesson?.sections?.length) {
      uniqueById(hierarchyData.lesson.sections).forEach((section) => {
        if (hierarchyData.section && hierarchyData.section.id === section.id) return;
        const card = createCardDefinition("section", section, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    if (hierarchyData.section?.subsections?.length) {
      uniqueById(hierarchyData.section.subsections).forEach((subsection) => {
        if (hierarchyData.subsection && hierarchyData.subsection.id === subsection.id) return;
        const card = createCardDefinition("subsection", subsection, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    if (hierarchyData.subsection?.topics?.length) {
      uniqueById(hierarchyData.subsection.topics).forEach((topic) => {
        if (hierarchyData.topic && hierarchyData.topic.id === topic.id) return;
        const card = createCardDefinition("topic", topic, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    if (hierarchyData.topic?.keywords?.length) {
      uniqueById(hierarchyData.topic.keywords).forEach((keyword) => {
        if (hierarchyData.keyword && hierarchyData.keyword.id === keyword.id) return;
        const card = createCardDefinition("keyword", keyword, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    if (hierarchyData.keyword?.contents?.length) {
      uniqueById(hierarchyData.keyword.contents).forEach((content) => {
        if (hierarchyData.content && hierarchyData.content.id === content.id) return;
        const card = createCardDefinition("content", content, { isPrimary: false });
        if (card) cards.push(card);
      });
    }

    return cards;
  }

  function createCardDefinition(type, info, { isCurrent = false, isPrimary = false } = {}) {
    if (!info) return null;
    const meta = hierarchyMeta[type] || hierarchyMeta.content;

    const title = extractTitle(info, type);
    if (!title) return null;

    const numberValue = extractNumber(info, type);
    const numberLabel = formatNumberLabel(type, numberValue);
    const description = formatDescription(type, info, title, numberValue);

    return {
      badge: meta.badge,
      icon: meta.icon,
      accentColor: meta.accentColor,
      title,
      description,
      numberLabel,
      navigateType: type,
      navigateTitle: title,
      isCurrent,
      isPrimary,
    };
  }

  function extractTitle(info, type) {
    const titleFieldMap = {
      chapter: "chapterTitle",
      lesson: "lessonTitle",
      section: "sectionTitle",
      subsection: "subsectionTitle",
      topic: "topicTitle",
      keyword: "keywordTitle",
      content: "contentTitle",
    };

    const field = titleFieldMap[type];
    if (field && info[field]) {
      return info[field];
    }

    if (info.title) {
      return info.title;
    }

    return null;
  }

  function extractNumber(info, type) {
    const numberFieldMap = {
      chapter: "chapterNumber",
      lesson: "lessonNumber",
      section: "sectionNumber",
      subsection: "subsectionNumber",
      topic: "topicNumber",
      keyword: "keywordNumber",
      content: "contentNumber",
    };

    const field = numberFieldMap[type];
    return field && info[field] !== undefined ? info[field] : null;
  }

  function formatNumberLabel(type, numberValue) {
    if (numberValue === null || numberValue === undefined) {
      return "";
    }
    const suffix = hierarchyMeta[type]?.numberSuffix || "";
    return `${numberValue}${suffix}`;
  }

  function formatDescription(type, info, title, numberValue) {
    const label = hierarchyMeta[type]?.badge || "학습";
    let description = numberValue
      ? `${label} ${numberValue}: ${title}`
      : title;

    if (type === "keyword" && Array.isArray(info.keywords) && info.keywords.length > 0) {
      description += ` • ${info.keywords.join(", ")}`;
    }

    if (type === "content" && info.contentType) {
      description += ` (${info.contentType})`;
    }

    return description;
  }

  function uniqueById(items) {
    const map = new Map();
    items.forEach((item) => {
      if (item && item.id !== undefined && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }

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
    detailInfo: document.querySelector(".detail-info"),

    // Actions
    bookmarkBtn: document.getElementById("bookmarkBtn"),
    shareBtn: document.getElementById("shareBtn"),
    startLearningBtn: document.getElementById("startLearningBtn"),
    addToListBtn: document.getElementById("addToListBtn"),
    detailCta: document.querySelector(".detail-cta"),

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
      const id = urlParams.get("id");

      console.log("Detail Page - Title:", title, "Type:", type);

      if (title && type) {
        loadDetailData(title, type, id);
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
  async function loadDetailData(title, type, id) {
    // id가 있으면 실제 API에서 데이터를 가져오고, 없으면 더미 데이터 사용
    let itemData = {
      type: type,
      title: decodeURIComponent(title),
      subtitle: getSubtitleByType(type),
      description: getDescriptionByType(type),
      icon: getIconByType(type),
      category: getCategoryLabel(type),
      id: id || null,
    };
    
    // id가 있고 type이 chapter인 경우 실제 API에서 데이터 가져오기
    if (id && type === "chapter") {
      try {
        const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
        if (response.ok) {
          const chapters = await response.json();
          const chapter = chapters.find(c => c.id === parseInt(id));
          if (chapter) {
            itemData.title = chapter.chapterTitle || itemData.title;
            itemData.description = `Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`;
          }
        }
      } catch (error) {
        console.warn("Failed to load chapter data:", error);
      }
    }
    
    currentItem = itemData;

    updatePageContent(currentItem);
    // 계층 데이터 로드 후 data 속성 업데이트
    await preloadHierarchyData(type, currentItem.title, currentItem.id);
    // 계층 데이터 로드 완료 후 data 속성 다시 업데이트
    updateDataAttributes(currentItem);
    // type이 chapter, lesson, section, subsection, topic, keyword, 또는 content가 아닐 때만 관련 항목 로드
    if (type !== "chapter" && type !== "lesson" && type !== "section" && type !== "subsection" && type !== "topic" && type !== "keyword" && type !== "content") {
    loadRelatedItems(type);
    }
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

    updateCtaVisibility(item.type);
    updateTypeSpecificVisibility(item.type);
    updateDataAttributes(item);
  }

  function updateTypeSpecificVisibility(type) {
    // type이 chapter, lesson, section, subsection, topic, keyword, 또는 content일 때 detail-meta, detail-actions, related-section 제거
    if (type === "chapter" || type === "lesson" || type === "section" || type === "subsection" || type === "topic" || type === "keyword" || type === "content") {
      const detailMeta = document.querySelector(".detail-meta");
      if (detailMeta) {
        detailMeta.remove();
      }
      
      const detailActions = document.querySelector(".detail-actions");
      if (detailActions) {
        detailActions.remove();
      }
      
      const relatedSection = document.querySelector(".related-section");
      if (relatedSection) {
        relatedSection.remove();
      }
    }
    
    // type이 chapter, lesson, section, subsection, topic, keyword, 또는 content일 때 특정 accordion 항목 제거
    if (type === "chapter" || type === "lesson" || type === "section" || type === "subsection" || type === "topic" || type === "keyword" || type === "content") {
      const accordionItems = document.querySelectorAll(".accordion-item");
      accordionItems.forEach((item) => {
        const titleElement = item.querySelector(".accordion-title");
        if (titleElement) {
          const titleText = titleElement.textContent.trim();
          if (titleText === "주요 키워드" || titleText === "학습 목표" || titleText === "참고 자료") {
            item.remove();
          }
        }
      });
    }
  }

  function updateCtaVisibility(type) {
    if (!elements.detailCta) return;

    if (type === "chapter") {
      elements.detailCta.style.display = "none";
    } else {
      elements.detailCta.style.display = "";
    }
  }

  function updateDataAttributes(item) {
    if (!elements.detailInfo) return;

    // 기존 data 속성 제거
    elements.detailInfo.removeAttribute("data-topic-id");
    elements.detailInfo.removeAttribute("data-keyword-id");
    elements.detailInfo.removeAttribute("data-content-id");

    if (item.type === "topic") {
      if (currentHierarchyData?.topic?.id) {
        elements.detailInfo.dataset.topicId = currentHierarchyData.topic.id;
      } else if (item.id) {
        elements.detailInfo.dataset.topicId = item.id;
      }
    }

    if (item.type === "keyword") {
      if (currentHierarchyData?.keyword?.id) {
        elements.detailInfo.dataset.keywordId = currentHierarchyData.keyword.id;
      } else if (item.id) {
        elements.detailInfo.dataset.keywordId = item.id;
      }
    }

    if (item.type === "content") {
      if (currentHierarchyData?.content?.id) {
        elements.detailInfo.dataset.contentId = currentHierarchyData.content.id;
      } else if (item.id) {
        elements.detailInfo.dataset.contentId = item.id;
      }
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
  async function handleStartLearning() {
    if (!currentItem) return;

    const { type, title } = currentItem;
    await ensureHierarchyData(type, title, currentItem.id);

    if (type === "section") {
      const lessonTitle =
        currentHierarchyData?.lesson?.lessonTitle ||
        currentHierarchyData?.lesson?.title ||
        "";
      const sectionTitle =
        currentHierarchyData?.section?.sectionTitle ||
        currentHierarchyData?.section?.title ||
        title ||
        "";

      if (!lessonTitle) {
        showToast("연결된 강의를 찾을 수 없습니다", "❌");
        return;
      }

      showToast("학습 페이지로 이동합니다", "📖");

      setTimeout(() => {
        const encodedLesson = encodeURIComponent(lessonTitle);
        const encodedSection = encodeURIComponent(sectionTitle);
        window.location.href = `study.html?title=${encodedLesson}&type=lesson&sectionTitle=${encodedSection}`;
      }, 800);
          return;
        }
        
    if (type === "subsection") {
      const lessonTitle =
        currentHierarchyData?.lesson?.lessonTitle ||
        currentHierarchyData?.lesson?.title ||
        "";
      const sectionTitle =
        currentHierarchyData?.section?.sectionTitle ||
        currentHierarchyData?.section?.title ||
        "";
      const subsectionTitle =
        currentHierarchyData?.subsection?.subsectionTitle ||
        currentHierarchyData?.subsection?.title ||
        title ||
        "";

      if (!lessonTitle) {
        showToast("연결된 강의를 찾을 수 없습니다", "❌");
          return;
        }
        
      showToast("학습 페이지로 이동합니다", "📖");

      setTimeout(() => {
        const encodedLesson = encodeURIComponent(lessonTitle);
        const sectionParam = sectionTitle
          ? `&sectionTitle=${encodeURIComponent(sectionTitle)}`
          : "";
        const subsectionParam = `&subsectionTitle=${encodeURIComponent(subsectionTitle)}`;
        window.location.href = `study.html?title=${encodedLesson}&type=lesson${sectionParam}${subsectionParam}`;
      }, 800);
      return;
    }

    if (type === "topic") {
      const lessonTitle =
        currentHierarchyData?.lesson?.lessonTitle ||
        currentHierarchyData?.lesson?.title ||
        "";
      const sectionTitle =
        currentHierarchyData?.section?.sectionTitle ||
        currentHierarchyData?.section?.title ||
        "";
      const subsectionTitle =
        currentHierarchyData?.subsection?.subsectionTitle ||
        currentHierarchyData?.subsection?.title ||
        "";
      const topicTitle =
        currentHierarchyData?.topic?.topicTitle ||
        currentHierarchyData?.topic?.title ||
        title ||
        "";
      const topicId = currentHierarchyData?.topic?.id;

      if (!lessonTitle) {
        showToast("연결된 강의를 찾을 수 없습니다", "❌");
        return;
      }
        
        showToast("학습 페이지로 이동합니다", "📖");
        
        setTimeout(() => {
        const encodedLesson = encodeURIComponent(lessonTitle);
        const sectionParam = sectionTitle
          ? `&sectionTitle=${encodeURIComponent(sectionTitle)}`
          : "";
        const subsectionParam = subsectionTitle
          ? `&subsectionTitle=${encodeURIComponent(subsectionTitle)}`
          : "";
        const topicTitleParam = `&topicTitle=${encodeURIComponent(topicTitle)}`;
        const topicIdParam = topicId ? `&topicId=${encodeURIComponent(topicId)}` : "";
        window.location.href = `study.html?title=${encodedLesson}&type=lesson${sectionParam}${subsectionParam}${topicTitleParam}${topicIdParam}`;
        }, 800);
      return;
      }

    if (type === "keyword") {
      const keywordInfo = currentHierarchyData?.keyword;
      const lessonTitle =
        currentHierarchyData?.lesson?.lessonTitle ||
        currentHierarchyData?.lesson?.title ||
        "";
      const sectionTitle =
        currentHierarchyData?.section?.sectionTitle ||
        currentHierarchyData?.section?.title ||
        "";
      const subsectionTitle =
        currentHierarchyData?.subsection?.subsectionTitle ||
        currentHierarchyData?.subsection?.title ||
        "";
      const topicTitle =
        currentHierarchyData?.topic?.topicTitle ||
        currentHierarchyData?.topic?.title ||
        "";
      const topicId = currentHierarchyData?.topic?.id;
      const keywordId = keywordInfo?.id;
      const keywordValues = Array.isArray(keywordInfo?.keywords)
        ? keywordInfo.keywords
        : [];
      const keywordValueJoined = keywordValues.join(", ");
      const detailTitleText =
        (elements.detailTitle?.textContent || currentItem.title || "").trim();
      const keywordIdFromDom =
        elements.detailInfo?.dataset?.keywordId || currentItem.id || null;

      if (!lessonTitle) {
        showToast("연결된 강의를 찾을 수 없습니다", "❌");
        return;
      }

      if (
        !keywordId ||
        !keywordIdFromDom ||
        String(keywordId) !== String(keywordIdFromDom)
      ) {
        showToast("키워드 정보를 확인할 수 없습니다", "❌");
        return;
      }

      if (!keywordValueJoined || keywordValueJoined !== detailTitleText) {
        showToast("연결된 학습 데이터를 찾을 수 없습니다", "ℹ");
        return;
      }

      showToast("학습 페이지로 이동합니다", "📖");

      setTimeout(() => {
        const encodedLesson = encodeURIComponent(lessonTitle);
        const sectionParam = sectionTitle
          ? `&sectionTitle=${encodeURIComponent(sectionTitle)}`
          : "";
        const subsectionParam = subsectionTitle
          ? `&subsectionTitle=${encodeURIComponent(subsectionTitle)}`
          : "";
        const topicTitleParam = topicTitle
          ? `&topicTitle=${encodeURIComponent(topicTitle)}`
          : "";
        const topicIdParam = topicId ? `&topicId=${encodeURIComponent(topicId)}` : "";
        const keywordIdParam = `&keywordId=${encodeURIComponent(keywordId)}`;
        const keywordTitleParam = keywordInfo?.keywordTitle
          ? `&keywordTitle=${encodeURIComponent(keywordInfo.keywordTitle)}`
          : "";
        window.location.href = `study.html?title=${encodedLesson}&type=lesson${sectionParam}${subsectionParam}${topicTitleParam}${topicIdParam}${keywordIdParam}${keywordTitleParam}`;
      }, 800);
      return;
    }

    if (type === "content") {
      const contentInfo = currentHierarchyData?.content;
      const lessonTitle =
        currentHierarchyData?.lesson?.lessonTitle ||
        currentHierarchyData?.lesson?.title ||
        "";
      const sectionTitle =
        currentHierarchyData?.section?.sectionTitle ||
        currentHierarchyData?.section?.title ||
        "";
      const subsectionTitle =
        currentHierarchyData?.subsection?.subsectionTitle ||
        currentHierarchyData?.subsection?.title ||
        "";
      const topicTitle =
        currentHierarchyData?.topic?.topicTitle ||
        currentHierarchyData?.topic?.title ||
        "";
      const topicId = currentHierarchyData?.topic?.id;
      const keywordId = currentHierarchyData?.keyword?.id;
      const keywordTitle = currentHierarchyData?.keyword?.keywordTitle || "";
      const contentId = contentInfo?.id;
      const contentTitle = contentInfo?.contentTitle || "";
      const detailTitleText =
        (elements.detailTitle?.textContent || currentItem.title || "").trim();
      const contentIdFromDom =
        elements.detailInfo?.dataset?.contentId || currentItem.id || null;

      if (!lessonTitle) {
        showToast("연결된 강의를 찾을 수 없습니다", "❌");
        return;
      }

      if (
        !contentId ||
        !contentIdFromDom ||
        String(contentId) !== String(contentIdFromDom)
      ) {
        showToast("내용 정보를 확인할 수 없습니다", "❌");
        return;
      }

      if (!contentTitle || contentTitle !== detailTitleText) {
        showToast("연결된 학습 데이터를 찾을 수 없습니다", "ℹ");
        return;
      }

      showToast("학습 페이지로 이동합니다", "📖");

      setTimeout(() => {
        const encodedLesson = encodeURIComponent(lessonTitle);
        const sectionParam = sectionTitle
          ? `&sectionTitle=${encodeURIComponent(sectionTitle)}`
          : "";
        const subsectionParam = subsectionTitle
          ? `&subsectionTitle=${encodeURIComponent(subsectionTitle)}`
          : "";
        const topicTitleParam = topicTitle
          ? `&topicTitle=${encodeURIComponent(topicTitle)}`
          : "";
        const topicIdParam = topicId ? `&topicId=${encodeURIComponent(topicId)}` : "";
        const keywordIdParam = keywordId ? `&keywordId=${encodeURIComponent(keywordId)}` : "";
        const keywordTitleParam = keywordTitle
          ? `&keywordTitle=${encodeURIComponent(keywordTitle)}`
          : "";
        const contentIdParam = `&contentId=${encodeURIComponent(contentId)}`;
        const contentTitleParam = `&contentTitle=${encodeURIComponent(contentTitle)}`;
        window.location.href = `study.html?title=${encodedLesson}&type=lesson${sectionParam}${subsectionParam}${topicTitleParam}${topicIdParam}${keywordIdParam}${keywordTitleParam}${contentIdParam}${contentTitleParam}`;
      }, 800);
      return;
    }

      showToast("학습 페이지로 이동합니다", "📖");

      setTimeout(() => {
      const encodedTitle = encodeURIComponent(title || "");
      const encodedType = type || "chapter";
      window.location.href = `study.html?title=${encodedTitle}&type=${encodedType}`;
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
      
      const hierarchyRendered = await renderHierarchyByType(targetAccordionContent);
      if (hierarchyRendered) {
        return;
      }

      // 계층 데이터를 가져오지 못한 경우 기존 Lesson 카드 로직으로 폴백
      let lessons = [];
      
      if (currentItem.type === "chapter") {
        const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
        if (response.ok) {
          const chapters = await response.json();
          const chapter = chapters.find((c) => c.chapterTitle === currentItem.title);
          if (chapter && chapter.lessons) {
            lessons = chapter.lessons.map((lesson) => ({
              type: "lesson",
              id: lesson.id,
              title: lesson.lessonTitle,
              description: `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`,
              number: lesson.lessonNumber,
              icon: "📖",
            }));
          }
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/search/lessons?title=${encodeURIComponent(currentItem.title)}`
        );
        if (response.ok) {
          const data = await response.json();
          lessons = data.map((lesson) => ({
          type: "lesson",
          id: lesson.id,
          title: lesson.lessonTitle,
          description: `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`,
          number: lesson.lessonNumber,
            icon: "📖",
        }));
        }
      }
      
      if (lessons.length > 0) {
        displayLessonCards(lessons, targetAccordionContent);
      } else {
        targetAccordionContent.innerHTML =
          '<div class="lesson-empty"><p>관련 학습 카드가 없습니다.</p></div>';
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

  function createHierarchyCard(cardData, index = 0) {
    const {
      title,
      description,
      badge,
      numberLabel,
      accentColor,
      icon,
      navigateType,
      navigateTitle,
      isCurrent = false,
      isPrimary = false,
    } = cardData;

    const card = document.createElement("div");
    card.className = "chapter-card";
    card.style.cssText = `
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
      transition: all 0.25s ease;
      cursor: ${isCurrent ? "default" : "pointer"};
      opacity: 0;
      transform: translateY(20px);
    `;

    const topLine = document.createElement("div");
    topLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: ${accentColor};
      border-radius: 10px 10px 0 0;
      opacity: ${isPrimary ? 1 : 0.7};
    `;
    card.appendChild(topLine);

    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;

    const iconEl = document.createElement("span");
    iconEl.textContent = icon || "📘";
    iconEl.style.cssText = `
      font-size: 1.25rem;
      color: #4b5563;
    `;

    const badgeEl = document.createElement("span");
    badgeEl.textContent = badge || "학습";
    badgeEl.style.cssText = `
      padding: 0.25rem 0.75rem;
      background: rgba(99, 102, 241, 0.1);
      color: ${accentColor};
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    `;

    header.appendChild(iconEl);
    header.appendChild(badgeEl);

    const titleEl = document.createElement("h4");
    titleEl.textContent = title || "제목 없음";
    titleEl.style.cssText = `
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.35;
      margin: 0;
    `;

    const descEl = document.createElement("p");
    descEl.textContent = description || "";
    descEl.style.cssText = `
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.45;
      margin: 0;
    `;

    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    `;

    const numberEl = document.createElement("span");
    numberEl.textContent = numberLabel || "";
    numberEl.style.cssText = `
      font-size: 0.85rem;
      color: #6b7280;
      font-weight: 500;
    `;
    if (!numberLabel) {
      numberEl.style.visibility = "hidden";
    }

    const actionEl = document.createElement("span");
    actionEl.textContent = isCurrent ? "현재 위치" : "자세히 보기 →";
    actionEl.style.cssText = `
      font-size: 0.85rem;
      color: ${accentColor};
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      opacity: ${isCurrent ? 0.6 : 1};
    `;

    footer.appendChild(numberEl);
    footer.appendChild(actionEl);

    card.appendChild(header);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    card.appendChild(footer);

    if (!isCurrent && navigateType && navigateTitle) {
      card.addEventListener("click", () => {
        const encodedTitle = encodeURIComponent(navigateTitle);
        if (
          navigateType === "lesson" &&
          currentItem &&
          currentItem.type === "lesson" &&
          currentItem.title === navigateTitle
        ) {
          window.location.href = `study.html?title=${encodedTitle}&type=lesson`;
        } else {
          window.location.href = `detail.html?title=${encodedTitle}&type=${navigateType}`;
        }
      });

      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-2px)";
        card.style.boxShadow = "0 10px 20px rgba(15, 23, 42, 0.12)";
        card.style.borderColor = accentColor;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 2px 6px rgba(15, 23, 42, 0.08)";
        card.style.borderColor = "#e5e7eb";
      });
    }

    if (isCurrent) {
      card.style.borderColor = accentColor;
      card.style.boxShadow = "0 2px 10px rgba(245, 158, 11, 0.2)";
    }

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 80);

    return card;
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

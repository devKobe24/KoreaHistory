// ===== Study Page JavaScript =====

(function () {
  "use strict";

  const API_BASE_URL = "/api/v1";

  // ===== State =====
  let currentSection = "1";
  let currentSubsection = "1-1";
  let currentSubsectionId = null;
  let completedSubsections = new Set();
  let totalSubsections = 0;
  let targetSectionTitle = null;
  let targetSubsectionTitle = null;
  let targetTopicTitle = null;
  let targetTopicId = null;
  let suppressToast = false;
  // Section 배지 표기를 위한 최소 상태
  let loadedLesson = null; // lesson 로드시 섹션/서브섹션 구조 보관
  let loadedChapter = null; // chapter 로드시 lessons 구조 보관

  // ===== DOM Elements =====
  const elements = {
    // Sidebar
    sectionHeaders: document.querySelectorAll(".section-header"),
    subsectionItems: document.querySelectorAll(".subsection-item"),
    progressFill: document.getElementById("progressFill"),
    progressText: document.getElementById("progressText"),

    // Content
    currentTopic: document.getElementById("currentTopic"),
    topicBadge: document.getElementById("topicBadge"),
    topicTitle: document.getElementById("topicTitle"),
    keywordGrid: document.getElementById("keywordGrid"),
    detailSection: document.getElementById("detailSection"),

    // Navigation
    prevButton: document.getElementById("prevButton"),
    nextButton: document.getElementById("nextButton"),
    completeButton: document.getElementById("completeButton"),

    // Toast
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toastIcon"),
    toastMessage: document.getElementById("toastMessage"),
  };

  // ===== Utility Functions =====
  /**
   * 카드 개수에 따라 적절한 grid-column 수를 반환
   * @param {number} itemCount - 카드 아이템 개수
   * @returns {number} grid-column 수
   */
  function getOptimalGridColumns(itemCount) {
    if (itemCount <= 0) return 1;
    if (itemCount === 1) return 1;
    if (itemCount === 2) return 2;
    if (itemCount === 3) return 3;
    if (itemCount >= 4) return 4;
    return itemCount;
  }

  function focusTopicBadge(topicId, topicTitle) {
    if (!topicId && !topicTitle) return;

    const detailSectionEl = document.getElementById("detailSection");
    if (!detailSectionEl) return;

    const badges = detailSectionEl.querySelectorAll(".topic-section .subsection-badge");
    let targetBadge = null;

    badges.forEach((badge) => {
      if (targetBadge) return;
      const section = badge.closest(".topic-section");
      const badgeTopicId = section?.dataset?.topicId;

      if (topicId && badgeTopicId && String(badgeTopicId) === String(topicId)) {
        targetBadge = badge;
        return;
      }

      if (topicTitle) {
        const normalized = topicTitle.trim().toLowerCase();
        if (!normalized) return;
        const text = (badge.textContent || "").toLowerCase();
        if (text.includes(normalized)) {
          targetBadge = badge;
        }
      }
    });

    if (!targetBadge) {
      return;
    }

    const previousTabIndex = targetBadge.getAttribute("tabindex");
    targetBadge.setAttribute("tabindex", "-1");

    try {
      targetBadge.focus({ preventScroll: true });
    } catch (e) {
      // focus may fail silently
    }

    targetBadge.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const originalTransition = targetBadge.style.transition;
    const originalBoxShadow = targetBadge.style.boxShadow;
    targetBadge.style.transition = originalTransition || "box-shadow 0.3s ease";
    targetBadge.style.boxShadow = "0 0 0 4px rgba(102, 126, 234, 0.4)";

    setTimeout(() => {
      targetBadge.style.boxShadow = originalBoxShadow || "";
      if (previousTabIndex !== null) {
        targetBadge.setAttribute("tabindex", previousTabIndex);
      } else {
        targetBadge.removeAttribute("tabindex");
      }
    }, 2000);
  }

  /**
   * grid 요소에 동적으로 column 수를 설정
   * @param {HTMLElement} gridElement - grid 요소
   * @param {number} itemCount - 카드 아이템 개수
   */
  function setGridColumns(gridElement, itemCount) {
    const columns = getOptimalGridColumns(itemCount);
    gridElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  // ===== Initialize =====
  function init() {
    // type=lesson일 때 study-info-card 제거
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type === "lesson") {
      const studyInfoCard = document.querySelector(".study-info-card");
      if (studyInfoCard) {
        studyInfoCard.remove();
      }
    }
    
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setupEventListeners();
        calculateTotalSubsections();
        updateProgress();
        loadStudyData();
        document.body.classList.add("loaded");
      });
    } else {
      setupEventListeners();
      calculateTotalSubsections();
      updateProgress();
      loadStudyData();
      document.body.classList.add("loaded");
    }
  }

  // ===== Event Listeners =====
  function setupEventListeners() {
    // Section headers (동적으로 생성된 요소들 포함)
    const sectionHeaders = document.querySelectorAll(".section-header");
    sectionHeaders.forEach((header) => {
      // 기존 이벤트 리스너 제거
      header.removeEventListener("click", handleSectionClick);
      // 새 이벤트 리스너 추가
      header.addEventListener("click", handleSectionClick);
    });

    // Subsection items (동적으로 생성된 요소들 포함)
    const subsectionItems = document.querySelectorAll(".subsection-item");
    subsectionItems.forEach((item) => {
      // 기존 이벤트 리스너 제거
      item.removeEventListener("click", handleSubsectionClick);
      // 새 이벤트 리스너 추가
      item.addEventListener("click", handleSubsectionClick);
    });

    // Navigation buttons
    if (elements.prevButton) {
      elements.prevButton.addEventListener("click", navigateToPrevious);
    }
    if (elements.nextButton) {
      elements.nextButton.addEventListener("click", navigateToNext);
    }

    // Complete button
    if (elements.completeButton) {
      elements.completeButton.addEventListener("click", completeCurrentSection);
    }

    // Quiz options
    setupQuizOptions();

    // Keyboard shortcuts
    document.addEventListener("keydown", handleKeyboard);
  }

  // ===== Event Handlers =====
  function handleSectionClick() {
    const sectionId = this.dataset.sectionId || this.dataset.section;
    if (!sectionId) {
      console.warn("section-header에 data-section-id가 없습니다.");
      return;
    }
    toggleSection(sectionId, this);
    
    // Chapter 구조인 경우
    if (loadedChapter) {
      const parts = sectionId.split("-");
      if (parts.length === 1) {
        // Lesson이 클릭된 경우 (data-section-id가 "1" 형식)
        const lessonIdx = Math.max(1, parseInt(parts[0] || "1", 10)) - 1;
        if (loadedChapter.lessons && loadedChapter.lessons[lessonIdx]) {
          loadedLesson = loadedChapter.lessons[lessonIdx];
        }
      } else if (parts.length === 2) {
        // Section이 클릭된 경우 (data-section-id가 "1-1" 형식)
        const [lessonIdx, sectionIdx] = parts;
        const lessonIndex = Math.max(1, parseInt(lessonIdx || "1", 10)) - 1;
        const sectionIndex = Math.max(1, parseInt(sectionIdx || "1", 10)) - 1;
        if (loadedChapter.lessons && loadedChapter.lessons[lessonIndex]) {
          loadedLesson = loadedChapter.lessons[lessonIndex];
          // Section 배지 갱신
          updateSectionBadgeByIndex(sectionIndex);
          // Topic 제목을 해당 Section 제목으로 반영
          updateTopicTitleFromApi(sectionIndex);
        }
        return; // Chapter 구조는 여기서 완료
      }
    }
    
    // Lesson 구조인 경우
    const index = Math.max(1, parseInt(sectionId || "1", 10)) - 1;
    updateSectionBadgeByIndex(index);
    // Topic 제목을 해당 Section 제목으로 반영
    updateTopicTitleFromApi(index);
  }

  function handleSubsectionClick() {
    const subsectionKey = this.dataset.subsection || this.dataset.subsectionId;
    if (!subsectionKey) {
      console.warn("subsection-item에 data-subsection-id를 찾을 수 없습니다.");
      return;
    }
    navigateToSubsection(subsectionKey);
  }

  // ===== Section Toggle =====
  function toggleSection(sectionId, headerElement) {
    // Section 헤더의 직접적인 nextElementSibling이 subsection-list인지 확인
    let subsectionList = headerElement.nextElementSibling;
    
    // nextElementSibling이 subsection-list가 아니거나 null인 경우,
    // 부모 nav-section 내에서 해당 Section의 직접적인 subsection-list를 찾음
    if (!subsectionList || !subsectionList.classList.contains("subsection-list")) {
      const parentNavSection = headerElement.closest(".nav-section");
      
      if (parentNavSection) {
        // parentNavSection의 직접 자식 중에서 subsection-list 찾기
        // 단, headerElement 바로 다음에 오는 것만 찾기
        subsectionList = Array.from(parentNavSection.children).find(
          child => child.classList.contains("subsection-list") && child.previousElementSibling === headerElement
        );
      }
    }
    
    // 여전히 찾지 못하면 nextElementSibling 사용
    if (!subsectionList) {
      subsectionList = headerElement.nextElementSibling;
    }
    
    // subsectionList가 없으면 에러 방지
    if (!subsectionList) {
      console.warn("subsection-list를 찾을 수 없습니다:", sectionId);
      return;
    }
    
    const isActive = headerElement.classList.contains("active");

    if (isActive) {
      // deactive: section-header와 subsection-list를 deactive하고,
      // 해당 subsection-list 내부의 모든 subsection-item도 deactive
      headerElement.classList.remove("active");
      subsectionList.classList.remove("active");
      
      // 해당 subsection-list 내부의 모든 subsection-item도 deactive
      const subsectionItems = subsectionList.querySelectorAll(".subsection-item");
      subsectionItems.forEach(item => {
        item.classList.remove("active");
      });
      
      // 중첩된 section-header들도 모두 deactive (하위 section-header가 있는 경우)
      const nestedSectionHeaders = subsectionList.querySelectorAll(".section-header");
      nestedSectionHeaders.forEach(nestedHeader => {
        nestedHeader.classList.remove("active");
        // 중첩된 section-header의 subsection-list도 deactive
        const nestedSubsectionList = nestedHeader.nextElementSibling;
        if (nestedSubsectionList && nestedSubsectionList.classList.contains("subsection-list")) {
          nestedSubsectionList.classList.remove("active");
          // 중첩된 subsection-list 내부의 모든 subsection-item도 deactive
          const nestedSubsectionItems = nestedSubsectionList.querySelectorAll(".subsection-item");
          nestedSubsectionItems.forEach(item => {
            item.classList.remove("active");
          });
        }
      });
    } else {
      // active: section-header와 subsection-list를 active
      // 단, 하위 section-header들은 자동으로 active하지 않음
      headerElement.classList.add("active");
      subsectionList.classList.add("active");
    }
  }

  // ===== Navigation =====
  function navigateToSubsection(subsectionKey) {
    currentSubsection = subsectionKey;

    // Update active state (동적으로 생성된 요소들 포함)
    const subsectionItems = document.querySelectorAll(".subsection-item");
    let matchedSubsectionData = null;
    subsectionItems.forEach((item) => {
      item.classList.remove("active");
      const itemSubsectionKey = item.dataset.subsection || item.dataset.subsectionId;
      if (itemSubsectionKey === subsectionKey) {
        item.classList.add("active");
        matchedSubsectionData = item.dataset;
      }
    });

    currentSubsectionId = matchedSubsectionData
      ? matchedSubsectionData.subsectionId || currentSubsectionId
      : currentSubsectionId;

    // 현재 subsection이 속한 section 찾기
    const subsectionKeyForSection =
      matchedSubsectionData?.subsection || subsectionKey;
    const [secStr] = (subsectionKeyForSection || "1-1").split("-");
    const sectionNumber = secStr;

    // 모든 section-header와 subsection-list의 active 상태 업데이트
    const sectionHeaders = document.querySelectorAll(".section-header");
    sectionHeaders.forEach((header) => {
      const headerSection = header.dataset.sectionId || header.dataset.section;
      
      // 현재 subsection이 속한 section인지 확인
      if (headerSection === sectionNumber) {
        // 해당 section-header를 active로 설정
        header.classList.add("active");
        
        // 해당 section-header의 subsection-list 찾기
        let subsectionList = header.nextElementSibling;
        if (!subsectionList || !subsectionList.classList.contains("subsection-list")) {
          const parentNavSection = header.closest(".nav-section");
          if (parentNavSection) {
            subsectionList = Array.from(parentNavSection.children).find(
              child => child.classList.contains("subsection-list") && child.previousElementSibling === header
            );
          }
        }
        
        if (subsectionList) {
          subsectionList.classList.add("active");
        }
      } else {
        // 다른 section-header는 deactive
        header.classList.remove("active");
        
        // 해당 section-header의 subsection-list도 deactive
        let subsectionList = header.nextElementSibling;
        if (!subsectionList || !subsectionList.classList.contains("subsection-list")) {
          const parentNavSection = header.closest(".nav-section");
          if (parentNavSection) {
            subsectionList = Array.from(parentNavSection.children).find(
              child => child.classList.contains("subsection-list") && child.previousElementSibling === header
            );
          }
        }
        
        if (subsectionList) {
          subsectionList.classList.remove("active");
          // 해당 subsection-list 내부의 모든 subsection-item도 deactive
          const subsectionItems = subsectionList.querySelectorAll(".subsection-item");
          subsectionItems.forEach(item => {
            item.classList.remove("active");
          });
        }
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Load content
    loadSubsectionContent(subsectionKey);

    // Update navigation buttons
    updateNavigationButtons();

    // Show toast
    showToast("학습 내용이 변경되었습니다", "📖");

    // 현재 subsection이 속한 Section 기준으로 제목 갱신
    const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
    updateTopicTitleFromApi(sIdx);

    // Subsection 배지 갱신
    updateSubsectionBadgeFromApi();
    
    // Subsection 제목 갱신
    updateSubsectionTitleFromApi();
    
    // type이 lesson일 때 subsection-keyword 관계를 로드하여 업데이트
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type === "lesson") {
      setTimeout(() => {
        loadSubsectionKeywordRelations();
      }, 300);
    }
  }

  function navigateToPrevious() {
    const allSubsections = Array.from(document.querySelectorAll(".subsection-item"));
    const currentIndex = allSubsections.findIndex(
      (item) => item.dataset.subsection === currentSubsection
    );

    if (currentIndex > 0) {
      const prevSubsection =
        allSubsections[currentIndex - 1].dataset.subsection ||
        allSubsections[currentIndex - 1].dataset.subsectionId;
      navigateToSubsection(prevSubsection);
    }
  }

  function navigateToNext() {
    const allSubsections = Array.from(document.querySelectorAll(".subsection-item"));
    const currentIndex = allSubsections.findIndex(
      (item) => item.dataset.subsection === currentSubsection
    );

    if (currentIndex < allSubsections.length - 1) {
      const nextSubsection =
        allSubsections[currentIndex + 1].dataset.subsection ||
        allSubsections[currentIndex + 1].dataset.subsectionId;
      navigateToSubsection(nextSubsection);
    }
  }

  function updateNavigationButtons() {
    const allSubsections = Array.from(document.querySelectorAll(".subsection-item"));
    const currentIndex = allSubsections.findIndex(
      (item) => item.dataset.subsection === currentSubsection
    );

    // Prev button
    if (elements.prevButton) {
      elements.prevButton.disabled = currentIndex === 0;
    }

    // Next button
    if (elements.nextButton) {
      elements.nextButton.disabled = currentIndex === allSubsections.length - 1;
    }
  }

  // ===== Move Keyword Section Above Detail =====
  function moveKeywordSectionAboveDetail() {
    // keyword-section과 detail-section 요소 찾기
    const keywordSection = document.querySelector(".keyword-section");
    const detailSection = document.getElementById("detailSection");
    
    if (!keywordSection || !detailSection) {
      console.warn("keyword-section 또는 detail-section을 찾을 수 없습니다.");
      return;
    }
    
    // keyword-section이 이미 detail-section 위에 있는지 확인
    if (keywordSection.parentElement === detailSection.parentElement) {
      // 같은 부모 요소 안에 있는 경우, 순서 확인
      const parent = keywordSection.parentElement;
      const keywordIndex = Array.from(parent.children).indexOf(keywordSection);
      const detailIndex = Array.from(parent.children).indexOf(detailSection);
      
      // 이미 keyword-section이 detail-section 위에 있으면 종료
      if (keywordIndex < detailIndex) {
        return;
      }
    }
    
    // keyword-section을 detail-section 바로 위로 이동
    const parent = detailSection.parentElement;
    if (parent) {
      parent.insertBefore(keywordSection, detailSection);
    }
  }

  // ===== Load Study Data =====
  function loadStudyData() {
    // URL 파라미터에서 데이터 로드
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    const type = urlParams.get("type");
    const section = urlParams.get("section");
    const sectionTitleParam = urlParams.get("sectionTitle");
    const subsectionTitleParam = urlParams.get("subsectionTitle");
    const topicTitleParam = urlParams.get("topicTitle");
    const topicIdParam = urlParams.get("topicId");

    if (title) {
      updatePageTitle(decodeURIComponent(title));
    }

    if (sectionTitleParam) {
      targetSectionTitle = decodeURIComponent(sectionTitleParam);
    }
    if (subsectionTitleParam) {
      targetSubsectionTitle = decodeURIComponent(subsectionTitleParam);
    }
    if (topicTitleParam) {
      targetTopicTitle = decodeURIComponent(topicTitleParam);
    }
    if (topicIdParam) {
      targetTopicId = decodeURIComponent(topicIdParam);
    }

    if (section) {
      currentSection = section;
    }

    // type에 따라 적절한 데이터 로드
    if (type === "chapter" && title) {
      // Chapter 타입인 경우 해당 Chapter의 Lesson들을 로드
      loadChapterLessons(decodeURIComponent(title));
    } else if (type === "lesson" && title) {
      // Lesson 타입인 경우 실제 API에서 Section 데이터 로드
      loadLessonSections(decodeURIComponent(title));
      // moveKeywordSectionAboveDetail과 loadSubsectionKeywordRelations는 loadLessonSections 내부에서 호출됨
    } else if (type === "section" && title) {
      // Section 타입인 경우 해당 Section의 Subsection들을 로드
      loadSectionSubsections(decodeURIComponent(title));
    } else if (type === "subsection" && title) {
      // Subsection 타입인 경우 해당 Subsection의 Topic들을 로드
      loadSubsectionTopics(decodeURIComponent(title));
    } else {
      // 기본적으로 현재 subsection 콘텐츠 로드
      loadSubsectionContent(currentSubsection);
    }
  }

  // ===== Load Chapter Lessons =====
  async function loadChapterLessons(chapterTitle) {
    try {
      console.log("Loading lessons for chapter:", chapterTitle);
      
      // 로딩 스피너 표시
      showLoadingSpinner();
      
      // Chapter API에서 해당 Chapter 찾기
      const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      
      const chapters = await response.json();
      const targetChapter = chapters.find(c => c.chapterTitle === chapterTitle);
      
      if (!targetChapter) {
        console.warn("Chapter not found:", chapterTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>시대 정보를 찾을 수 없습니다.</p></div>';
        }
        return;
      }
      
      console.log("Found chapter:", targetChapter);
      loadedChapter = targetChapter; // Chapter 전체 구조 저장
      
      // Lesson 데이터가 있는지 확인
      if (targetChapter.lessons && targetChapter.lessons.length > 0) {
        // study-nav를 동적으로 생성
        generateChapterNav(targetChapter.lessons);
        // 첫 번째 Lesson을 loadedLesson에 저장
        loadedLesson = targetChapter.lessons[0];
        
        // 첫 번째 Lesson의 첫 번째 Section의 첫 번째 Subsection으로 설정
        const firstLesson = targetChapter.lessons[0];
        if (firstLesson.sections && firstLesson.sections.length > 0) {
          const firstSection = firstLesson.sections[0];
          if (firstSection.subsections && firstSection.subsections.length > 0) {
            currentSection = "1-1";
            currentSubsection = "1-1-1"; // Chapter에서는 1-1-1 형식 사용
            loadSubsectionContent(currentSubsection);
          }
        }

        // 배지 초기값: 첫 번째 섹션 기준
        updateSectionBadgeByIndex(0);
        // Subsection 배지 초기값 설정
        updateSubsectionBadgeFromApi();
        // Subsection 제목 초기값 설정
        updateSubsectionTitleFromApi();
      } else {
        console.warn("No lessons found for chapter:", chapterTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>해당 시대에 등록된 강의(Lesson)가 없습니다.</p></div>';
        }
      }
      
    } catch (error) {
      console.error("Error loading chapter lessons:", error);
      hideLoadingSpinner();
      // 에러 상태 표시
      const studyNav = document.getElementById("studyNav");
      if (studyNav) {
        studyNav.innerHTML = '<div class="loading-spinner"><p>학습 목차를 불러올 수 없습니다.</p></div>';
      }
    }
  }

  // ===== Load Lesson Sections =====
  async function loadLessonSections(lessonTitle) {
    try {
      console.log("Loading sections for lesson:", lessonTitle);
      
      // 로딩 스피너 표시
      showLoadingSpinner();
      
      // Chapter API에서 해당 Lesson 찾기
      const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      
      const chapters = await response.json();
      let targetLesson = null;
      
      // 모든 Chapter에서 해당 Lesson 찾기
      for (const chapter of chapters) {
        if (chapter.lessons) {
          const foundLesson = chapter.lessons.find(l => l.lessonTitle === lessonTitle);
          if (foundLesson) {
            targetLesson = foundLesson;
            break;
          }
        }
      }
      
      if (!targetLesson) {
        console.warn("Lesson not found:", lessonTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>강의 정보를 찾을 수 없습니다.</p></div>';
        }
        return;
      }
      
      console.log("Found lesson:", targetLesson);
      loadedLesson = targetLesson;
      
      // Section 데이터가 있는지 확인
      if (targetLesson.sections && targetLesson.sections.length > 0) {
        // study-nav를 동적으로 생성
        generateStudyNav(targetLesson.sections);
        
        // 첫 번째 Section의 첫 번째 Subsection으로 설정
        if (targetLesson.sections[0].subsections && targetLesson.sections[0].subsections.length > 0) {
          currentSection = "1";
          currentSubsection = "1-1";
          loadSubsectionContent(currentSubsection);
        }
        
        // type이 lesson일 때 keyword-section을 detail-section 위로 이동 (DOM 렌더링 완료 후)
        setTimeout(() => {
          moveKeywordSectionAboveDetail();
        }, 100);
        
        // type이 lesson일 때 subsection-keyword 관계를 로드하여 업데이트 (DOM 렌더링 완료 후)
        setTimeout(() => {
          loadSubsectionKeywordRelations();
        }, 300);
        
        // 배지 초기값: 첫 번째 섹션 기준
        updateSectionBadgeByIndex(0);
        // Subsection 배지 초기값 설정
        updateSubsectionBadgeFromApi();
        // Subsection 제목 초기값 설정
        updateSubsectionTitleFromApi();
      } else {
        console.warn("No sections found for lesson:", lessonTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>해당 강의에 등록된 소분류(Section)가 없습니다.</p></div>';
        }
      }
      
    } catch (error) {
      console.error("Error loading lesson sections:", error);
      hideLoadingSpinner();
      // 에러 상태 표시
      const studyNav = document.getElementById("studyNav");
      if (studyNav) {
        studyNav.innerHTML = '<div class="loading-spinner"><p>학습 목차를 불러올 수 없습니다.</p></div>';
      }
    }
  }

  // ===== Load Section Subsections =====
  async function loadSectionSubsections(sectionTitle) {
    try {
      console.log("Loading subsections for section:", sectionTitle);
      
      // 로딩 스피너 표시
      showLoadingSpinner();
      
      // Chapter API에서 해당 Section 찾기
      const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      
      const chapters = await response.json();
      let targetSection = null;
      
      // 모든 Chapter에서 해당 Section 찾기
      for (const chapter of chapters) {
        if (chapter.lessons) {
          for (const lesson of chapter.lessons) {
            if (lesson.sections) {
              const foundSection = lesson.sections.find(s => s.sectionTitle === sectionTitle);
              if (foundSection) {
                targetSection = foundSection;
                break;
              }
            }
          }
          if (targetSection) break;
        }
      }
      
      if (!targetSection) {
        console.warn("Section not found:", sectionTitle);
        return;
      }
      
      console.log("Found section:", targetSection);
      
      // Subsection 데이터가 있는지 확인
      if (targetSection.subsections && targetSection.subsections.length > 0) {
        // 단일 Section으로 네비게이션 생성
        generateSingleSectionNav(targetSection);
        
        // 첫 번째 Subsection으로 설정
        currentSection = "1";
        currentSubsection = "1-1";
        loadSubsectionContent(currentSubsection);
      } else {
        console.warn("No subsections found for section:", sectionTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>이 소분류(Section)에 등록된 상세분류가 없습니다.</p></div>';
        }
      }
      
    } catch (error) {
      console.error("Error loading section subsections:", error);
      hideLoadingSpinner();
      // 에러 상태 표시
      const studyNav = document.getElementById("studyNav");
      if (studyNav) {
        studyNav.innerHTML = '<div class="loading-spinner"><p>학습 목차를 불러올 수 없습니다.</p></div>';
      }
    }
  }

  // ===== Load Subsection Topics =====
  async function loadSubsectionTopics(subsectionTitle) {
    try {
      console.log("Loading topics for subsection:", subsectionTitle);
      
      // 로딩 스피너 표시
      showLoadingSpinner();
      
      // Chapter API에서 해당 Subsection 찾기
      const response = await fetch(`${API_BASE_URL}/chapters/search/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      
      const chapters = await response.json();
      let targetSubsection = null;
      
      // 모든 Chapter에서 해당 Subsection 찾기
      for (const chapter of chapters) {
        if (chapter.lessons) {
          for (const lesson of chapter.lessons) {
            if (lesson.sections) {
              for (const section of lesson.sections) {
                if (section.subsections) {
                  const foundSubsection = section.subsections.find(sub => sub.subsectionTitle === subsectionTitle);
                  if (foundSubsection) {
                    targetSubsection = foundSubsection;
                    break;
                  }
                }
              }
              if (targetSubsection) break;
            }
          }
          if (targetSubsection) break;
        }
      }
      
      if (!targetSubsection) {
        console.warn("Subsection not found:", subsectionTitle);
        return;
      }
      
      console.log("Found subsection:", targetSubsection);
      
      // Topic 데이터가 있는지 확인
      if (targetSubsection.topics && targetSubsection.topics.length > 0) {
        // 단일 Subsection으로 네비게이션 생성
        generateSingleSubsectionNav(targetSubsection);
        
        // 첫 번째 Topic으로 설정
        currentSection = "1";
        currentSubsection = "1-1";
        loadSubsectionContent(currentSubsection);
      } else {
        console.warn("No topics found for subsection:", subsectionTitle);
        hideLoadingSpinner();
        const studyNav = document.getElementById("studyNav");
        if (studyNav) {
          studyNav.innerHTML = '<div class="loading-spinner"><p>이 상세분류(Subsection)에 등록된 주제가 없습니다.</p></div>';
        }
      }
      
    } catch (error) {
      console.error("Error loading subsection topics:", error);
      hideLoadingSpinner();
      // 에러 상태 표시
      const studyNav = document.getElementById("studyNav");
      if (studyNav) {
        studyNav.innerHTML = '<div class="loading-spinner"><p>학습 목차를 불러올 수 없습니다.</p></div>';
      }
    }
  }

  // ===== Loading Spinner Functions =====
  function showLoadingSpinner() {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    studyNav.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>학습 목차를 불러오는 중...</p>
      </div>
    `;
  }

  function hideLoadingSpinner() {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    // 로딩 스피너가 있으면 제거
    const loadingSpinner = studyNav.querySelector(".loading-spinner");
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
  }

  // ===== Generate Chapter Navigation =====
  function generateChapterNav(lessons) {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    // 로딩 스피너 제거
    hideLoadingSpinner();
    
    // 기존 네비게이션 제거
    studyNav.innerHTML = "";
    
    lessons.forEach((lesson, lessonIndex) => {
      const lessonNumber = String(lessonIndex + 1).padStart(2, '0');
      
      // Lesson 헤더 생성
      const navLesson = document.createElement("div");
      navLesson.className = "nav-section";
      
      const lessonHeader = document.createElement("div");
      lessonHeader.className = "section-header";
      // 기본적으로 모든 header는 inactive 상태
      lessonHeader.dataset.sectionId = lessonIndex + 1; // Section처럼 처리
      
      lessonHeader.innerHTML = `
        <span class="section-number">${lessonNumber}</span>
        <span class="section-title">${lesson.lessonTitle}</span>
        <span class="section-icon">▼</span>
      `;
      
      // Section 리스트 생성 (Lesson 내부의 모든 Section)
      const lessonContent = document.createElement("div");
      lessonContent.className = "subsection-list";
      // 기본적으로 모든 list는 collapsed 상태
      
      if (lesson.sections && lesson.sections.length > 0) {
        lesson.sections.forEach((section, sectionIndex) => {
          const sectionNumber = String(sectionIndex + 1).padStart(2, '0');
          
          // Section 헤더 생성
          const sectionNavSection = document.createElement("div");
          sectionNavSection.className = "nav-section";
          
          const sectionHeader = document.createElement("div");
          sectionHeader.className = "section-header";
          // 기본적으로 모든 header는 inactive 상태
          sectionHeader.dataset.sectionId = `${lessonIndex + 1}-${sectionIndex + 1}`;
          
          sectionHeader.innerHTML = `
            <span class="section-number">${sectionNumber}</span>
            <span class="section-title">${section.sectionTitle}</span>
            <span class="section-icon">▼</span>
          `;
          
          // Subsection 리스트 생성
          const subsectionList = document.createElement("div");
          subsectionList.className = "subsection-list";
          // 기본적으로 모든 list는 collapsed 상태
          
          // 첫 번째 subsection-item이 active인 경우, 해당 section-header와 subsection-list도 active로 설정
          let hasActiveSubsectionItem = false;
          
          if (section.subsections && section.subsections.length > 0) {
            section.subsections.forEach((subsection, subsectionIndex) => {
              const subsectionItem = document.createElement("div");
              subsectionItem.className = "subsection-item";
              if (lessonIndex === 0 && sectionIndex === 0 && subsectionIndex === 0) {
                subsectionItem.classList.add("active");
                hasActiveSubsectionItem = true;
              }
              
              const subsectionIdValue =
                subsection.id ??
                subsection.subsectionId ??
                `${lessonIndex + 1}-${sectionIndex + 1}-${subsectionIndex + 1}`;
              subsectionItem.dataset.subsectionId = String(subsectionIdValue);
              subsectionItem.dataset.subsection = `${lessonIndex + 1}-${sectionIndex + 1}-${subsectionIndex + 1}`;
              
              subsectionItem.innerHTML = `
                <span class="subsection-bullet">•</span>
                <span class="subsection-title">${subsection.subsectionTitle}</span>
              `;
              
              subsectionList.appendChild(subsectionItem);
            });
          }
          
          // 첫 번째 subsection-item이 active인 경우, 해당 section-header와 subsection-list도 active로 설정
          // 하지만 사용자 요구사항에 따라 기본값은 deactive로 유지
          // 주석 처리: if (hasActiveSubsectionItem) {
          //   sectionHeader.classList.add("active");
          //   subsectionList.classList.add("active");
          // }
          
          sectionNavSection.appendChild(sectionHeader);
          sectionNavSection.appendChild(subsectionList);
          lessonContent.appendChild(sectionNavSection);
        });
      }
      
      navLesson.appendChild(lessonHeader);
      navLesson.appendChild(lessonContent);
      studyNav.appendChild(navLesson);
    });
    
    // 이벤트 리스너 재설정
    setupEventListeners();
    
    // 총 subsection 수 재계산
    calculateTotalSubsections();
    updateProgress();
    // 네비게이션 버튼 상태 업데이트
    updateNavigationButtons();

    if (targetSubsectionTitle) {
      const subsectionItems = subsectionList.querySelectorAll(".subsection-item");
      const targetItem = Array.from(subsectionItems).find((item) => {
        const titleEl = item.querySelector(".subsection-title");
        return titleEl && titleEl.textContent === targetSubsectionTitle;
      });

      const datasetSource = targetItem
        ? targetItem.dataset
        : subsectionItems.length > 0
        ? subsectionItems[0].dataset
        : null;
      const navigateKey =
        datasetSource?.subsection || datasetSource?.subsectionId || null;

      if (navigateKey) {
        if (targetItem) {
          subsectionItems.forEach((item) => item.classList.remove("active"));
          targetItem.classList.add("active");
        }

        suppressToast = true;
        navigateToSubsection(navigateKey);
        suppressToast = false;
      }

      targetSubsectionTitle = null;
    }
  }

  // ===== Generate Study Navigation =====
  function generateStudyNav(sections) {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    // 로딩 스피너 제거
    hideLoadingSpinner();
    
    // 기존 네비게이션 제거
    studyNav.innerHTML = "";
    
    sections.forEach((section, sectionIndex) => {
      const sectionNumber = String(sectionIndex + 1).padStart(2, '0');
      
      // Section 헤더 생성
      const navSection = document.createElement("div");
      navSection.className = "nav-section";
      
      const sectionHeader = document.createElement("div");
      sectionHeader.className = "section-header";
      if (sectionIndex === 0) sectionHeader.classList.add("active");
      sectionHeader.dataset.sectionId = sectionIndex + 1;
      
      sectionHeader.innerHTML = `
        <span class="section-number">${sectionNumber}</span>
        <span class="section-title">${section.sectionTitle}</span>
        <span class="section-icon">▼</span>
      `;
      
      // Subsection 리스트 생성
      const subsectionList = document.createElement("div");
      subsectionList.className = "subsection-list";
      if (sectionIndex === 0) subsectionList.classList.add("active");
      
      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach((subsection, subsectionIndex) => {
          const subsectionItem = document.createElement("div");
          subsectionItem.className = "subsection-item";
          if (sectionIndex === 0 && subsectionIndex === 0) subsectionItem.classList.add("active");
          const subsectionIdValue =
            subsection.id ??
            subsection.subsectionId ??
            `${sectionIndex + 1}-${subsectionIndex + 1}`;
          subsectionItem.dataset.subsectionId = String(subsectionIdValue);
          subsectionItem.dataset.subsection = `${sectionIndex + 1}-${subsectionIndex + 1}`;
          
          subsectionItem.innerHTML = `
            <span class="subsection-bullet">•</span>
            <span class="subsection-title">${subsection.subsectionTitle}</span>
          `;
          
          subsectionList.appendChild(subsectionItem);
        });
      }
      
      navSection.appendChild(sectionHeader);
      navSection.appendChild(subsectionList);
      studyNav.appendChild(navSection);
    });
    
    // 이벤트 리스너 재설정
    setupEventListeners();
    
    // 총 subsection 수 재계산
    calculateTotalSubsections();
    updateProgress();
    // 생성 직후 배지(섹션 0번) 갱신 시도
    updateSectionBadgeByIndex(0);
    // 생성 직후 제목(섹션 0번) 갱신 시도
    updateTopicTitleFromApi(0);
    // 네비게이션 버튼 상태 업데이트
    updateNavigationButtons();

    if (targetSectionTitle || targetSubsectionTitle) {
      activateSectionByTitle(targetSectionTitle, targetSubsectionTitle);
      targetSectionTitle = null;
      targetSubsectionTitle = null;
    }
  }

  // ===== Generate Single Section Navigation =====
  function generateSingleSectionNav(section) {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    // 로딩 스피너 제거
    hideLoadingSpinner();
    
    // 기존 네비게이션 제거
    studyNav.innerHTML = "";
    
    const sectionNumber = "01";
    
    // Section 헤더 생성
    const navSection = document.createElement("div");
    navSection.className = "nav-section";
    
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header active";
    sectionHeader.dataset.sectionId = "1";
    
    sectionHeader.innerHTML = `
      <span class="section-number">${sectionNumber}</span>
      <span class="section-title">${section.sectionTitle}</span>
      <span class="section-icon">▼</span>
    `;
    
    // Subsection 리스트 생성
    const subsectionList = document.createElement("div");
    subsectionList.className = "subsection-list active";
    
    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((subsection, subsectionIndex) => {
        const subsectionItem = document.createElement("div");
        subsectionItem.className = "subsection-item";
        if (subsectionIndex === 0) subsectionItem.classList.add("active");
        const subsectionIdValue =
          subsection.id ??
          subsection.subsectionId ??
          `1-${subsectionIndex + 1}`;
        subsectionItem.dataset.subsectionId = String(subsectionIdValue);
        subsectionItem.dataset.subsection = `1-${subsectionIndex + 1}`;
        
        subsectionItem.innerHTML = `
          <span class="subsection-bullet">•</span>
          <span class="subsection-title">${subsection.subsectionTitle}</span>
        `;
        
        subsectionList.appendChild(subsectionItem);
      });
    }
    
    navSection.appendChild(sectionHeader);
    navSection.appendChild(subsectionList);
    studyNav.appendChild(navSection);
    
    // 이벤트 리스너 재설정
    setupEventListeners();
    
    // 총 subsection 수 재계산
    calculateTotalSubsections();
    updateProgress();
    // 네비게이션 버튼 상태 업데이트
    updateNavigationButtons();

    if (targetSectionTitle || targetSubsectionTitle) {
      activateSectionByTitle(targetSectionTitle, targetSubsectionTitle);
      targetSectionTitle = null;
      targetSubsectionTitle = null;
    }
  }

  function activateSectionByTitle(sectionTitle, subsectionTitle) {
    if (!loadedLesson || !loadedLesson.sections) {
      return;
    }

    let targetSectionIndex = -1;
    let targetSubsectionIndex = -1;

    loadedLesson.sections.forEach((section, index) => {
      if (targetSectionIndex === -1 && sectionTitle && section.sectionTitle === sectionTitle) {
        targetSectionIndex = index;
      }

      if (
        subsectionTitle &&
        section.subsections &&
        targetSubsectionIndex === -1
      ) {
        const foundIndex = section.subsections.findIndex(
          (subsection) => subsection.subsectionTitle === subsectionTitle
        );
        if (foundIndex !== -1) {
          targetSubsectionIndex = foundIndex;
          if (targetSectionIndex === -1) {
            targetSectionIndex = index;
          }
        }
      }
    });

    if (targetSectionIndex === -1) {
      return;
    }

    const sectionHeaders = document.querySelectorAll(".section-header");
    const subsectionLists = document.querySelectorAll(".subsection-list");

    sectionHeaders.forEach((header, index) => {
      header.classList.toggle("active", index === targetSectionIndex);
    });

    subsectionLists.forEach((list, index) => {
      list.classList.toggle("active", index === targetSectionIndex);
    });

    currentSection = String(targetSectionIndex + 1);
    updateSectionBadgeByIndex(targetSectionIndex);
    updateTopicTitleFromApi(targetSectionIndex);

    const targetList = subsectionLists[targetSectionIndex];
    if (!targetList) {
      return;
    }

    const subsectionItems = targetList.querySelectorAll(".subsection-item");
    subsectionItems.forEach((item) => item.classList.remove("active"));

    let targetDataset = null;

    if (
      subsectionTitle &&
      targetSubsectionIndex !== -1 &&
      subsectionItems[targetSubsectionIndex]
    ) {
      targetDataset = subsectionItems[targetSubsectionIndex].dataset;
    }

    if (!targetDataset && subsectionItems.length > 0) {
      targetDataset = subsectionItems[0].dataset;
    }

    if (targetDataset) {
      const navigateKey =
        targetDataset.subsection || targetDataset.subsectionId || null;
      const targetItem = navigateKey
        ? Array.from(subsectionItems).find((item) => {
            const itemKey = item.dataset.subsection || item.dataset.subsectionId;
            return itemKey === navigateKey;
          })
        : null;

      if (targetItem) {
        targetItem.classList.add("active");
      }

      if (navigateKey) {
        suppressToast = true;
        navigateToSubsection(navigateKey);
        suppressToast = false;
      }
    }
  }

  // ===== Generate Single Subsection Navigation =====
  function generateSingleSubsectionNav(subsection) {
    const studyNav = document.getElementById("studyNav");
    if (!studyNav) return;
    
    // 로딩 스피너 제거
    hideLoadingSpinner();
    
    // 기존 네비게이션 제거
    studyNav.innerHTML = "";
    
    const sectionNumber = "01";
    
    // Section 헤더 생성 (Subsection을 Section으로 표시)
    const navSection = document.createElement("div");
    navSection.className = "nav-section";
    
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header active";
    sectionHeader.dataset.sectionId = "1";
    
    sectionHeader.innerHTML = `
      <span class="section-number">${sectionNumber}</span>
      <span class="section-title">${subsection.subsectionTitle}</span>
      <span class="section-icon">▼</span>
    `;
    
    // Topic 리스트 생성 (Topic을 Subsection으로 표시)
    const subsectionList = document.createElement("div");
    subsectionList.className = "subsection-list active";
    
    if (subsection.topics && subsection.topics.length > 0) {
      subsection.topics.forEach((topic, topicIndex) => {
        const subsectionItem = document.createElement("div");
        subsectionItem.className = "subsection-item";
        if (topicIndex === 0) subsectionItem.classList.add("active");
        subsectionItem.dataset.subsection = `1-${topicIndex + 1}`;
        
        subsectionItem.innerHTML = `
          <span class="subsection-bullet">•</span>
          <span class="subsection-title">${topic.topicTitle}</span>
        `;
        
        subsectionList.appendChild(subsectionItem);
      });
    }
    
    navSection.appendChild(sectionHeader);
    navSection.appendChild(subsectionList);
    studyNav.appendChild(navSection);
    
    // 이벤트 리스너 재설정
    setupEventListeners();
    
    // 총 subsection 수 재계산
    calculateTotalSubsections();
    updateProgress();
    // 네비게이션 버튼 상태 업데이트
    updateNavigationButtons();
  }

  function loadSubsectionContent(subsectionId) {
    // 실제로는 API에서 데이터를 가져옴
    // 여기서는 더미 데이터 사용

    const contentData = getSubsectionData(subsectionId);

    // 더미 데이터는 API 데이터가 없는 경우에만 반영하도록 가드 처리
    if (!loadedLesson) {
      if (elements.topicBadge) {
        elements.topicBadge.textContent = contentData.badge;
      }
      if (elements.topicTitle) {
        elements.topicTitle.textContent = contentData.title;
      }
      if (elements.currentTopic) {
        elements.currentTopic.textContent = contentData.title;
      }
    }

    console.log("Loaded content for:", subsectionId);
    // Topics, Keywords, Contents를 topic-section 구조로 렌더링
    renderTopicsFromApi()
      .then(() => {
        // 토픽 데이터가 최신 cache에 반영된 뒤 키워드 렌더링
        return renderKeywordsFromApi();
      })
      .catch((error) => {
        console.warn('Failed to render topics before keywords:', error);
        // 토픽 렌더링 실패 시에도 키워드 렌더링은 시도
        renderKeywordsFromApi();
      });
  }

  // ===== LearningPage API로 렌더링 (ContentBlock 다형성 지원) =====
  // NOTE: 현재는 renderTopicsFromApi()를 사용하므로 이 함수는 사용하지 않음
  // 만약 ContentBlock 타입을 사용하려면 topic-section 구조 안에서 사용해야 함
  async function renderLearningPageFromApi() {
    // 이 함수는 현재 사용하지 않음 - renderTopicsFromApi()가 대신 사용됨
    return;
  }

  // ===== ContentBlock 타입별 렌더링 =====
  function renderContentBlock(block) {
    if (!block || !block.type) return null;
    
    const box = document.createElement('div');
    box.className = 'detail-content-box';
    
    switch (block.type) {
      case 'TEXT':
        return renderTextBlock(box, block);
      case 'TABLE':
        return renderTableBlock(box, block);
      case 'COMPARISON_TABLE':
        return renderComparisonTableBlock(box, block);
      case 'TIMELINE':
        return renderTimelineBlock(box, block);
      case 'HERITAGE':
        return renderHeritageBlock(box, block);
      case 'IMAGE_GALLERY':
        return renderImageGalleryBlock(box, block);
      default:
        console.warn('Unknown block type:', block.type);
        return null;
    }
  }

  // ===== TEXT Block 렌더링 =====
  function renderTextBlock(box, block) {
    if (!block.title || !block.text) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    const text = document.createElement('p');
    text.className = 'content-text';
    text.textContent = block.text;
    box.appendChild(text);
    
    return box;
  }

  // ===== TABLE Block 렌더링 =====
  function renderTableBlock(box, block) {
    if (!block.title || !block.rows || block.rows.length === 0) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    const table = document.createElement('div');
    table.className = 'info-table';
    
    block.rows.forEach((row) => {
      const tableRow = document.createElement('div');
      tableRow.className = 'table-row';
      
      const keyCell = document.createElement('div');
      keyCell.className = 'table-cell header';
      keyCell.textContent = row.key || '';
      
      const valueCell = document.createElement('div');
      valueCell.className = 'table-cell';
      valueCell.textContent = row.value || '';
      
      tableRow.appendChild(keyCell);
      tableRow.appendChild(valueCell);
      table.appendChild(tableRow);
    });
    
    box.appendChild(table);
    return box;
  }

  // ===== COMPARISON_TABLE Block 렌더링 =====
  function renderComparisonTableBlock(box, block) {
    if (!block.title || !block.headers || !block.rows) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    const table = document.createElement('div');
    table.className = 'info-table comparison-table';
    
    // 동적 grid columns 설정: 첫 번째 열은 150px 고정, 나머지는 균등 분할
    const columnCount = block.headers.length;
    const gridTemplateColumns = `150px ${'1fr '.repeat(columnCount - 1).trim()}`;
    
    // 헤더 행: headers 배열의 모든 요소를 사용
    const headerRow = document.createElement('div');
    headerRow.className = 'table-row';
    headerRow.style.gridTemplateColumns = gridTemplateColumns;
    
    block.headers.forEach((header) => {
      const headerCell = document.createElement('div');
      headerCell.className = 'table-cell header';
      headerCell.textContent = header || '';
      headerRow.appendChild(headerCell);
    });
    
    table.appendChild(headerRow);
    
    // 데이터 행
    block.rows.forEach((row) => {
      const tableRow = document.createElement('div');
      tableRow.className = 'table-row';
      tableRow.style.gridTemplateColumns = gridTemplateColumns;
      
      const categoryCell = document.createElement('div');
      categoryCell.className = 'table-cell header';
      categoryCell.textContent = row.category || '';
      tableRow.appendChild(categoryCell);
      
      if (row.items && row.items.length > 0) {
        row.items.forEach((cell) => {
          const cellElement = document.createElement('div');
          cellElement.className = 'table-cell';
          
          if (cell && cell.details && Array.isArray(cell.details)) {
            const content = cell.details.join('<br>');
            cellElement.innerHTML = content;
          } else {
            cellElement.textContent = '';
          }
          
          tableRow.appendChild(cellElement);
        });
      }
      
      table.appendChild(tableRow);
    });
    
    box.appendChild(table);
    return box;
  }

  // ===== TIMELINE Block 렌더링 =====
  function renderTimelineBlock(box, block) {
    if (!block.title || !block.rows) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    // 타임라인 컨테이너
    const timelineContainer = document.createElement('div');
    timelineContainer.style.cssText = 'margin: 1.5rem 0; padding-left: 0;';
    
    block.rows.forEach((row, rowIndex) => {
      if (!row.events || row.events.length === 0) return;
      
      const timelineGrid = document.createElement('div');
      timelineGrid.className = 'law-grid';
      timelineGrid.style.cssText = 'margin-bottom: 2rem;';
      
      // 카드 개수에 따라 grid-column 동적 설정
      setGridColumns(timelineGrid, row.events.length);
      
      row.events.forEach((event, eventIndex) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'law-card';
        
        // 헤더 스타일 적용
        let headerStyle = '';
        if (event.style) {
          const styleMap = {
            'GRAY': 'background: #f5f5f5; border-color: #ccc; padding: 0.75rem 1rem; border-radius: var(--border-radius) 0 0 0;',
            'YELLOW': 'background: #fff9e6; border-color: #ffd700; padding: 0.75rem 1rem; border-radius: var(--border-radius) 0 0 0;',
            'PURPLE': 'background: #f3e5f5; border-color: #9c27b0; padding: 0.75rem 1rem; border-radius: var(--border-radius) 0 0 0;'
          };
          headerStyle = styleMap[event.style] || '';
        }
        
        let html = '';
        
        // 헤더 부분 (title + subtitle)
        if (event.title || event.subtitle) {
          html += '<div class="law-timeline-header" style="' + headerStyle + '">';
          html += '<div class="law-number">' + (eventIndex + 1) + '</div>';
          if (event.title) {
            html += '<h6 style="margin: 0; font-weight: 700; font-size: 1rem;">' + event.title + '</h6>';
          }
          if (event.subtitle) {
            html += '<p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; font-weight: 500;">' + event.subtitle + '</p>';
          }
          html += '</div>';
        }
        
        // 본문 부분 (details)
        if (event.details && Array.isArray(event.details) && event.details.length > 0) {
          html += '<div class="law-content" style="padding: 1rem;">';
          event.details.forEach((detail) => {
            html += '<p style="margin: 0.5rem 0; font-size: 0.875rem; color: var(--text-secondary);">' + detail + '</p>';
          });
          html += '</div>';
        }
        
        eventCard.innerHTML = html;
        
        timelineGrid.appendChild(eventCard);
      });
      
      timelineContainer.appendChild(timelineGrid);
    });
    
    box.appendChild(timelineContainer);
    return box;
  }

  // ===== HERITAGE Block 렌더링 =====
  function renderHeritageBlock(box, block) {
    if (!block.title || !block.categories) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    const heritageContainer = document.createElement('div');
    heritageContainer.style.cssText = 'margin: 1.5rem 0;';
    
    block.categories.forEach((category, categoryIndex) => {
      // 카테고리별 그리드
      if (category.items && category.items.length > 0) {
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'law-grid';
        itemsGrid.style.cssText = 'margin-bottom: 2rem;';
        
        // 카드 개수에 따라 grid-column 동적 설정
        setGridColumns(itemsGrid, category.items.length);
        
        category.items.forEach((item) => {
          const itemCard = document.createElement('div');
          itemCard.className = 'law-card';
          itemCard.style.cssText = 'text-align: center; padding: 0;';
          
          let html = '';
          
          // 카테고리 제목 (헤더)
          if (category.categoryTitle) {
            // 카테고리별 다른 배경색 (이미지 참고)
            const categoryColors = [
              'background: #fff4e6; border-bottom: 2px solid #ff9800;', // 주황
              'background: #f3e5f5; border-bottom: 2px solid #9c27b0;'  // 보라
            ];
            const headerStyle = categoryColors[categoryIndex % 2] || 'background: #f5f5f5; border-bottom: 2px solid #666;';
            
            html += '<div class="heritage-header" style="' + headerStyle + '">';
            html += '<h6 style="margin: 0; font-weight: 700; font-size: 0.9rem; padding: 0.75rem 1rem; color: #333;">' + category.categoryTitle + '</h6>';
            html += '</div>';
          }
          
          // 본문 내용
          html += '<div class="law-content" style="padding: 1rem;">';
          
          if (item.name) {
            html += '<h6 style="margin: 0 0 0.5rem 0; font-weight: 600; font-size: 0.95rem;">' + item.name + '</h6>';
          }
          
          if (item.imageUrl) {
            html += '<img src="' + item.imageUrl + '" alt="' + (item.name || '문화재') + '" style="width: 100%; max-width: 200px; height: auto; border-radius: 4px;">';
          }
          
          html += '</div>';
          itemCard.innerHTML = html;
          
          itemsGrid.appendChild(itemCard);
        });
        
        heritageContainer.appendChild(itemsGrid);
      }
    });
    
    box.appendChild(heritageContainer);
    return box;
  }

  // ===== IMAGE_GALLERY Block 렌더링 =====
  function renderImageGalleryBlock(box, block) {
    if (!block.title || !block.items) return null;
    
    const subtitle = document.createElement('h5');
    subtitle.className = 'content-subtitle';
    subtitle.textContent = block.title;
    box.appendChild(subtitle);
    
    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'law-grid';
    galleryGrid.style.cssText = 'margin: 1.5rem 0;';
    
    // 카드 개수에 따라 grid-column 동적 설정
    setGridColumns(galleryGrid, block.items.length);
    
    block.items.forEach((item) => {
      const galleryCard = document.createElement('div');
      galleryCard.className = 'law-card';
      
      // 스타일 적용
      if (item.style) {
        const styleMap = {
          'DEFAULT': '',
          'ORANGE': 'background: #fff4e6; border-color: #ff9800;',
          'GREEN': 'background: #e8f5e9; border-color: #4caf50;',
          'YELLOW': 'background: #fff9e6; border-color: #ffd700;'
        };
        galleryCard.style.cssText = styleMap[item.style] || '';
      }
      
      let html = '<div class="law-content">';
      
      if (item.imageUrl) {
        html += '<img src="' + item.imageUrl + '" alt="' + (item.name || '이미지') + '" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 0.5rem;">';
      }
      
      if (item.name) {
        html += '<h6 style="margin-bottom: 0;">' + item.name + '</h6>';
      }
      
      html += '</div>';
      galleryCard.innerHTML = html;
      
      galleryGrid.appendChild(galleryCard);
    });
    
    box.appendChild(galleryGrid);
    return box;
  }

  // ===== Topic content boxes from API (기존 방식, 백워드 호환) =====
  async function renderTopicsFromApi() {
    try {
      if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return;
      
      // 현재 subsection 정보 가져오기
      const [secStr, subStr] = (currentSubsection || "1-1").split("-");
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
      const section = loadedLesson.sections[sIdx];
      if (!section || !Array.isArray(section.subsections)) return;
      const subsection = section.subsections[subIdx];
      if (!subsection) return;
      
      const subsectionId = subsection.id;
      if (!subsectionId) return;
      
      // detail-section에 로딩 스피너 표시
      const detailSectionEl = document.getElementById('detailSection');
      let detailLoadingOverlay = null;
      if (detailSectionEl) {
        // 기존 스피너가 있으면 제거
        const existingOverlay = detailSectionEl.querySelector('.detail-loading-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        detailLoadingOverlay = document.createElement('div');
        detailLoadingOverlay.className = 'detail-loading-overlay';
        detailLoadingOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 8px;
        `;
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.cssText = `
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        `;
        
        detailLoadingOverlay.appendChild(spinner);
        detailSectionEl.style.position = 'relative';
        detailSectionEl.appendChild(detailLoadingOverlay);
      }
      
      // Subsection에 속한 topics 가져오기 - API에서 모든 topics 가져와서 필터링
      let allTopics = [];
      try {
        const topicsRes = await fetch(`${API_BASE_URL}/topics/search/all`);
      if (topicsRes.ok) {
        const topicsArr = await topicsRes.json();
        if (Array.isArray(topicsArr)) {
      const normalizedSubsectionId = String(subsectionId);
      const normalizedCurrentSubsectionId = currentSubsectionId ? String(currentSubsectionId) : null;
      const subsectionIdToMatch = normalizedCurrentSubsectionId || normalizedSubsectionId;

          const extractSubsectionId = (topic) => {
            if (typeof topic.subsectionId !== 'undefined' && topic.subsectionId !== null) {
              return String(topic.subsectionId);
            }
            if (!topic) return null;
            if (topic.subsection && (topic.subsection.id || topic.subsection.subsectionId)) {
              return String(topic.subsection.id ?? topic.subsection.subsectionId);
            }
            if (topic.parentSubsection && (topic.parentSubsection.id || topic.parentSubsection.subsectionId)) {
              return String(topic.parentSubsection.id ?? topic.parentSubsection.subsectionId);
            }
            if (typeof topic.subsection_id !== 'undefined' && topic.subsection_id !== null) {
              return String(topic.subsection_id);
            }
            if (topic.subsectionDto && (topic.subsectionDto.id || topic.subsectionDto.subsectionId)) {
              return String(topic.subsectionDto.id ?? topic.subsectionDto.subsectionId);
            }
            return null;
          };

          const extractTopicId = (topic) => {
            if (!topic) return null;
            if (typeof topic.id !== 'undefined' && topic.id !== null) {
              return String(topic.id);
            }
            if (typeof topic.topicId !== 'undefined' && topic.topicId !== null) {
              return String(topic.topicId);
            }
            if (typeof topic.topic_id !== 'undefined' && topic.topic_id !== null) {
              return String(topic.topic_id);
            }
            return null;
          };

          // 현재 subsection에 속한 topics만 필터링 (id 매칭 실패 시 제목으로 폴백)
          allTopics = topicsArr.filter((topic) => {
            const topicSubsectionId = extractSubsectionId(topic);

            if (subsectionIdToMatch && topicSubsectionId) {
              return topicSubsectionId === subsectionIdToMatch;
            }

            if (!subsectionIdToMatch) {
              const topicSubsectionTitle =
                topic.subsection?.subsectionTitle ??
                topic.parentSubsection?.subsectionTitle ??
                topic.subsectionTitle ??
                topic.subsection_title ??
                null;

              const targetSubsectionTitle =
                subsection.subsectionTitle ??
                subsection.subsection_title ??
                null;

              if (
                topicSubsectionTitle &&
                targetSubsectionTitle &&
                topicSubsectionTitle.trim() === targetSubsectionTitle.trim()
              ) {
                return true;
              }
            }

            if (targetTopicId) {
              const topicIdVal = extractTopicId(topic);
              if (topicIdVal && topicIdVal === String(targetTopicId)) {
                return true;
              }
            }

            return false;
          });

          if (targetTopicId) {
            const targetIdStr = String(targetTopicId);
            const hasTargetTopic = allTopics.some((topic) => extractTopicId(topic) === targetIdStr);
            if (!hasTargetTopic) {
              const topicFromAll = topicsArr.find((topic) => extractTopicId(topic) === targetIdStr);
              if (topicFromAll) {
                if (!topicFromAll.subsection) {
                  topicFromAll.subsection = subsection;
                }
                allTopics.unshift(topicFromAll);
              }
            }
          }

          // topicNumber 순서로 정렬
          allTopics.sort((a, b) => (a.topicNumber || 0) - (b.topicNumber || 0));

          if (subsection) {
            subsection.topics = Array.isArray(allTopics) ? [...allTopics] : [];
          }
        }
      }
      } catch (e) {
        console.warn('Failed to fetch topics:', e);
        return;
      }
      
      if (allTopics.length === 0) {
        console.warn('No topics found for subsection:', subsectionId);
        return;
      }
      
      if (targetTopicId) {
        const targetIndex = allTopics.findIndex(
          (topic) =>
            topic.id !== undefined &&
            topic.id !== null &&
            String(topic.id) === String(targetTopicId)
        );
        if (targetIndex > -1) {
          const [targetTopic] = allTopics.splice(targetIndex, 1);
          allTopics.unshift(targetTopic);
        }
      }

      // Keywords API에서 모든 keywords 가져오기
      let allKeywords = [];
      try {
        const keywordsRes = await fetch(`${API_BASE_URL}/keywords/search/all`);
        if (keywordsRes.ok) {
          const keywordsArr = await keywordsRes.json();
          if (Array.isArray(keywordsArr)) {
            allKeywords = keywordsArr;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch keywords:', e);
      }
      
      // Contents API에서 모든 contents 가져오기
      let allContents = [];
      try {
        const contentsRes = await fetch(`${API_BASE_URL}/contents/search/all`);
        if (contentsRes.ok) {
          const contentsArr = await contentsRes.json();
          if (Array.isArray(contentsArr)) {
            allContents = contentsArr;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch contents:', e);
      }
      
      // detail-section 요소 찾기 (이미 detailSectionEl로 선언했으므로 재사용)
      if (!detailSectionEl) return;
      
      // 현재 subsection 인덱스를 기반으로 정확한 detail-subsection 찾기
      // 모든 detail-subsection 중에서 현재 선택된 subsection에 해당하는 것을 찾음
      const allDetailSubsections = detailSectionEl.querySelectorAll('.detail-subsection');
      let detailSubsection = null;
      
      // subsection 인덱스를 기반으로 해당하는 detail-subsection 찾기
      if (allDetailSubsections.length > 0) {
        // subIdx는 0-based이므로 그대로 사용 가능
        if (subIdx >= 0 && subIdx < allDetailSubsections.length) {
          detailSubsection = allDetailSubsections[subIdx];
        } else {
          // 인덱스가 범위를 벗어나면 첫 번째 것 사용
          detailSubsection = allDetailSubsections[0];
        }
      }
      
      // detail-subsection이 없으면 새로 생성
      if (!detailSubsection) {
        detailSubsection = document.createElement('div');
        detailSubsection.className = 'detail-subsection';
        detailSectionEl.appendChild(detailSubsection);
      }
      
      // 기존 topic-section 제거
      const existingTopicSections = detailSubsection.querySelectorAll('.topic-section');
      existingTopicSections.forEach(section => section.remove());
      
      // 기존 detail-content-box 제거 (하드코딩된 것들 제거)
      const existingBoxes = detailSubsection.querySelectorAll('.detail-content-box');
      existingBoxes.forEach(box => box.remove());
      
      // 기존 subsection-badge와 subsection-title도 제거 (Topic-section 구조로 대체)
      const existingBadge = detailSubsection.querySelector('.subsection-badge');
      if (existingBadge) existingBadge.remove();
      const existingTitle = detailSubsection.querySelector('.subsection-title');
      if (existingTitle) existingTitle.remove();
      
      // 첫 번째 topic의 subsection 정보 저장 (같은 subsection_id를 가진 topic들 중 첫 번째 것)
      let firstSubsectionTitle = null;
      let firstSubsectionId = null;
      
      // 각 Topic에 대해 topic-section 생성
      allTopics.forEach((topic, index) => {
        const topicId = topic.id;
        
        // 첫 번째 topic의 subsection 정보 저장
        if (index === 0 && topic.subsection) {
          firstSubsectionId = topic.subsection.id;
          firstSubsectionTitle = topic.subsection.subsectionTitle;
        }
        
        // 현재 topic에 속한 keywords 필터링
        const topicKeywords = allKeywords.filter(keyword => 
          keyword.topic && keyword.topic.id === topicId
        );
        // keywordNumber 순서로 정렬
        topicKeywords.sort((a, b) => (a.keywordNumber || 0) - (b.keywordNumber || 0));
        
        // topic-section 생성
        const topicSection = document.createElement('div');
        topicSection.className = 'topic-section';
        if (topicId) {
          topicSection.dataset.topicId = topicId;
        }
        const subsectionIdForDataset =
          topic.subsection?.id ??
          topic.subsection?.subsectionId ??
          topic.parentSubsection?.id ??
          topic.parentSubsection?.subsectionId ??
          topic.subsectionId ??
          topic.subsection_id ??
          null;
        if (subsectionIdForDataset) {
          topicSection.dataset.subsectionId = subsectionIdForDataset;
        }
        
        // 첫 번째 topic-section이고 같은 subsection_id를 가진 경우에만 subsection-title 추가 (subsection-badge 위에)
        if (index === 0 && firstSubsectionTitle && topic.subsection && topic.subsection.id === firstSubsectionId) {
          const subsectionTitle = document.createElement('h4');
          subsectionTitle.className = 'subsection-title';
          subsectionTitle.textContent = firstSubsectionTitle;
          topicSection.appendChild(subsectionTitle);
        }
        
        // Topic 제목 (subsection-badge 스타일로) - "Topic: (topic_number) topic_title"
        const topicBadge = document.createElement('div');
        topicBadge.className = 'subsection-badge';
        topicBadge.textContent = `Topic: (${topic.topicNumber || ''}) ${topic.topicTitle || '주제'}`;
        topicSection.appendChild(topicBadge);
        
        // 각 Keyword에 대해 keyword-section 생성
        topicKeywords.forEach((keyword) => {
          const keywordId = keyword.id;
          
          // 현재 keyword에 속한 contents 필터링
          const keywordContents = allContents.filter(content => 
            content.keyword && content.keyword.id === keywordId
          );
          // contentNumber 순서로 정렬
          keywordContents.sort((a, b) => (a.contentNumber || 0) - (b.contentNumber || 0));
          
          // 각 Content에 대해 detail-content-box 생성 (ContentBlock 타입에 따라 다르게 렌더링)
          keywordContents.forEach((content) => {
            const contentBox = document.createElement('div');
            contentBox.className = 'detail-content-box';
            
            // ContentType에 따라 다르게 렌더링
            const contentType = content.contentType;
            
            if (contentType === 'TEXT' && content.blockData) {
              // TEXT 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // h6.content-subtitle: blockData JSON의 "title" 값 (또는 keyword_title)
                // keyword 정보가 있으면 keyword_title 사용, 없으면 blockData.title 사용
                const subtitleText = keyword.keywordTitle || blockData.title;
                if (subtitleText) {
                  const h6Subtitle = document.createElement('h6');
                  h6Subtitle.className = 'content-subtitle';
                  h6Subtitle.textContent = subtitleText;
                  contentBox.appendChild(h6Subtitle);
                }
                
                // p.content-text: blockData JSON의 "text" 값
                if (blockData.text) {
                  const textParagraph = document.createElement('p');
                  textParagraph.className = 'content-text';
                  textParagraph.textContent = blockData.text;
                  contentBox.appendChild(textParagraph);
                }
              } catch (e) {
                console.warn('Failed to parse blockData JSON:', e);
                // JSON 파싱 실패 시 기존 방식으로 폴백
                const fallbackText = document.createElement('p');
                fallbackText.className = 'content-text';
                fallbackText.textContent = content.blockData;
                contentBox.appendChild(fallbackText);
              }
            } else if (contentType === 'HERITAGE' && content.blockData) {
              // HERITAGE 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // HERITAGE 타입은 h5.content-subtitle 제거 (subsection-badge에 이미 topic 정보가 있음)
                
                // heritage 배열 렌더링 - 테이블 형태로
                if (blockData.heritage && Array.isArray(blockData.heritage) && blockData.heritage.length > 0) {
                  // site별로 그룹화 (같은 site를 가진 문화재들을 함께 표시)
                  const siteGroups = {};
                  blockData.heritage.forEach((heritageItem) => {
                    const siteKey = heritageItem.site || '기타';
                    if (!siteGroups[siteKey]) {
                      siteGroups[siteKey] = [];
                    }
                    siteGroups[siteKey].push(heritageItem);
                  });
                  
                  // 각 site 그룹별로 테이블 생성
                  Object.keys(siteGroups).forEach((siteKey) => {
                    const heritageItems = siteGroups[siteKey];
                    
                    // 테이블 컨테이너 생성
                    const heritageTable = document.createElement('div');
                    heritageTable.className = 'heritage-table';
                    heritageTable.style.display = 'grid';
                    heritageTable.style.gridTemplateColumns = `repeat(${heritageItems.length}, 1fr)`;
                    heritageTable.style.gap = '0';
                    heritageTable.style.marginTop = '1rem';
                    heritageTable.style.border = '1px solid #e0e0e0';
                    heritageTable.style.borderRadius = '4px';
                    heritageTable.style.overflow = 'hidden';
                    heritageTable.style.backgroundColor = '#ffffff';
                    
                    // 메인 헤더 행: site 정보 (같은 site를 가진 경우 하나의 헤더로 span)
                    const mainHeaderRow = document.createElement('div');
                    mainHeaderRow.style.display = 'contents';
                    
                    // site가 있는 경우 메인 헤더 추가
                    if (siteKey !== '기타') {
                      const mainHeaderCell = document.createElement('div');
                      mainHeaderCell.style.gridColumn = `1 / ${heritageItems.length + 1}`;
                      mainHeaderCell.style.padding = '0.75rem';
                      mainHeaderCell.style.backgroundColor = '#f5f5f5';
                      mainHeaderCell.style.borderBottom = '1px solid #e0e0e0';
                      mainHeaderCell.style.textAlign = 'center';
                      mainHeaderCell.style.fontWeight = 'bold';
                      mainHeaderCell.style.fontSize = '1rem';
                      mainHeaderCell.style.color = '#333';
                      mainHeaderCell.textContent = siteKey;
                      mainHeaderRow.appendChild(mainHeaderCell);
                    }
                    heritageTable.appendChild(mainHeaderRow);
                    
                    // 서브 헤더 행: item 이름들
                    const subHeaderRow = document.createElement('div');
                    subHeaderRow.style.display = 'contents';
                    
                    heritageItems.forEach((heritageItem, index) => {
                      // 서브 헤더 셀 (item 이름)
                      const subHeaderCell = document.createElement('div');
                      subHeaderCell.style.padding = '0.75rem';
                      subHeaderCell.style.backgroundColor = '#f5f5f5';
                      subHeaderCell.style.borderRight = index < heritageItems.length - 1 ? '1px solid #e0e0e0' : 'none';
                      subHeaderCell.style.borderBottom = '1px solid #e0e0e0';
                      subHeaderCell.style.textAlign = 'center';
                      subHeaderCell.style.fontWeight = 'bold';
                      subHeaderCell.style.fontSize = '0.95rem';
                      subHeaderCell.style.color = '#333';
                      
                      let headerText = heritageItem.item || '문화재';
                      if (heritageItem.period) {
                        headerText += ` (${heritageItem.period})`;
                      }
                      subHeaderCell.textContent = headerText;
                      subHeaderRow.appendChild(subHeaderCell);
                    });
                    
                    heritageTable.appendChild(subHeaderRow);
                    
                    // 이미지 행
                    const imageRow = document.createElement('div');
                    imageRow.style.display = 'contents';
                    
                    heritageItems.forEach((heritageItem, index) => {
                      // 이미지 셀
                      const imageCell = document.createElement('div');
                      imageCell.style.padding = '1rem';
                      imageCell.style.borderRight = index < heritageItems.length - 1 ? '1px solid #e0e0e0' : 'none';
                      imageCell.style.borderTop = '1px solid #e0e0e0';
                      imageCell.style.textAlign = 'center';
                      imageCell.style.display = 'flex';
                      imageCell.style.alignItems = 'center';
                      imageCell.style.justifyContent = 'center';
                      imageCell.style.minHeight = '250px';
                      imageCell.style.backgroundColor = '#ffffff';
                      
                      if (heritageItem.imageUrl) {
                        const img = document.createElement('img');
                        img.src = heritageItem.imageUrl;
                        img.alt = heritageItem.item || '문화재 이미지';
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '200px';
                        img.style.height = 'auto';
                        img.style.objectFit = 'contain';
                        img.onerror = function() {
                          this.style.display = 'none';
                          const errorText = document.createElement('p');
                          errorText.style.color = '#999';
                          errorText.style.fontSize = '0.875rem';
                          errorText.textContent = '이미지를 불러올 수 없습니다.';
                          imageCell.appendChild(errorText);
                        };
                        imageCell.appendChild(img);
                      } else {
                        const noImageText = document.createElement('p');
                        noImageText.style.color = '#999';
                        noImageText.style.fontSize = '0.875rem';
                        noImageText.textContent = '이미지 없음';
                        imageCell.appendChild(noImageText);
                      }
                      
                      imageRow.appendChild(imageCell);
                    });
                    
                    heritageTable.appendChild(imageRow);
                    contentBox.appendChild(heritageTable);
                  });
                }
              } catch (e) {
                console.warn('Failed to parse HERITAGE blockData JSON:', e);
                // JSON 파싱 실패 시 에러 메시지
                const errorText = document.createElement('p');
                errorText.className = 'content-text';
                errorText.style.color = 'var(--text-muted, #666)';
                errorText.textContent = '문화재 정보를 불러올 수 없습니다.';
                contentBox.appendChild(errorText);
              }
            } else if (contentType === 'TABLE' && content.blockData) {
              // TABLE 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // renderTableBlock 함수 사용 (contentBox에 직접 렌더링)
                const tableBox = renderTableBlock(contentBox, {
                  type: 'TABLE',
                  title: blockData.title,
                  rows: blockData.rows
                });
                
                if (!tableBox) {
                  // 렌더링 실패 시 에러 메시지
                  const errorText = document.createElement('p');
                  errorText.className = 'content-text';
                  errorText.style.color = 'var(--text-muted, #666)';
                  errorText.textContent = '테이블 정보를 불러올 수 없습니다.';
                  contentBox.appendChild(errorText);
                }
              } catch (e) {
                console.warn('Failed to parse TABLE blockData JSON:', e);
                // JSON 파싱 실패 시 에러 메시지
                const errorText = document.createElement('p');
                errorText.className = 'content-text';
                errorText.style.color = 'var(--text-muted, #666)';
                errorText.textContent = '테이블 정보를 불러올 수 없습니다.';
                contentBox.appendChild(errorText);
              }
            } else if (contentType === 'COMPARISON_TABLE' && content.blockData) {
              // COMPARISON_TABLE 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // renderComparisonTableBlock 함수 사용 (contentBox에 직접 렌더링)
                const comparisonTableBox = renderComparisonTableBlock(contentBox, {
                  type: 'COMPARISON_TABLE',
                  title: blockData.title,
                  headers: blockData.headers,
                  rows: blockData.rows
                });
                
                if (!comparisonTableBox) {
                  // 렌더링 실패 시 에러 메시지
                  const errorText = document.createElement('p');
                  errorText.className = 'content-text';
                  errorText.style.color = 'var(--text-muted, #666)';
                  errorText.textContent = '비교 테이블 정보를 불러올 수 없습니다.';
                  contentBox.appendChild(errorText);
                }
              } catch (e) {
                console.warn('Failed to parse COMPARISON_TABLE blockData JSON:', e);
                // JSON 파싱 실패 시 에러 메시지
                const errorText = document.createElement('p');
                errorText.className = 'content-text';
                errorText.style.color = 'var(--text-muted, #666)';
                errorText.textContent = '비교 테이블 정보를 불러올 수 없습니다.';
                contentBox.appendChild(errorText);
              }
            } else if (contentType === 'TIMELINE' && content.blockData) {
              // TIMELINE 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // timeline 배열을 rows 형식으로 변환 (renderTimelineBlock이 기대하는 형식)
                let timelineRows = [];
                if (blockData.timeline && Array.isArray(blockData.timeline)) {
                  // timeline 배열을 events 배열로 변환
                  timelineRows = [{
                    events: blockData.timeline.map((item, index) => ({
                      title: item.event || item.title || `이벤트 ${index + 1}`,
                      subtitle: item.year || '',
                      details: item.details || []
                    }))
                  }];
                } else if (blockData.rows && Array.isArray(blockData.rows)) {
                  // 이미 rows 형식인 경우 그대로 사용
                  timelineRows = blockData.rows;
                }
                
                // renderTimelineBlock 함수 사용 (contentBox에 직접 렌더링)
                const timelineBox = renderTimelineBlock(contentBox, {
                  type: 'TIMELINE',
                  title: blockData.title,
                  rows: timelineRows
                });
                
                if (!timelineBox) {
                  // 렌더링 실패 시 에러 메시지
                  const errorText = document.createElement('p');
                  errorText.className = 'content-text';
                  errorText.style.color = 'var(--text-muted, #666)';
                  errorText.textContent = '타임라인 정보를 불러올 수 없습니다.';
                  contentBox.appendChild(errorText);
                }
              } catch (e) {
                console.warn('Failed to parse TIMELINE blockData JSON:', e);
                // JSON 파싱 실패 시 에러 메시지
                const errorText = document.createElement('p');
                errorText.className = 'content-text';
                errorText.style.color = 'var(--text-muted, #666)';
                errorText.textContent = '타임라인 정보를 불러올 수 없습니다.';
                contentBox.appendChild(errorText);
              }
            } else if (contentType === 'IMAGE_GALLERY' && content.blockData) {
              // IMAGE_GALLERY 타입: blockData JSON 파싱
              try {
                const blockData = JSON.parse(content.blockData);
                
                // 스키마 형식을 renderImageGalleryBlock이 기대하는 형식으로 변환
                let galleryItems = [];
                if (blockData.items && Array.isArray(blockData.items)) {
                  galleryItems = blockData.items.map((item) => {
                    // 스키마 형식인지 확인 (images 배열이 있는 경우)
                    if (item.images && Array.isArray(item.images)) {
                      // 스키마 형식: images 배열의 첫 번째 이미지를 imageUrl로 사용
                      const imageUrl = item.images.length > 0 ? item.images[0] : '';
                      
                      // name 또는 id를 name으로 사용
                      const name = item.name || item.id || '이미지';
                      
                      // 추가 정보를 name에 포함 (선택사항)
                      let displayName = name;
                      if (item.category) {
                        displayName += ` (${item.category})`;
                      }
                      if (item.location && item.location.region) {
                        displayName += ` - ${item.location.region}`;
                      }
                      
                      return {
                        imageUrl: imageUrl,
                        name: displayName,
                        style: item.style || 'DEFAULT'
                      };
                    } else {
                      // 이미 올바른 형식인 경우 (imageUrl이 있는 경우) 그대로 사용
                      return {
                        imageUrl: item.imageUrl || '',
                        name: item.name || '이미지',
                        style: item.style || 'DEFAULT'
                      };
                    }
                  });
                }
                
                // renderImageGalleryBlock 함수 사용 (contentBox에 직접 렌더링)
                const galleryBox = renderImageGalleryBlock(contentBox, {
                  type: 'IMAGE_GALLERY',
                  title: blockData.title,
                  items: galleryItems
                });
                
                if (!galleryBox) {
                  // 렌더링 실패 시 에러 메시지
                  const errorText = document.createElement('p');
                  errorText.className = 'content-text';
                  errorText.style.color = 'var(--text-muted, #666)';
                  errorText.textContent = '이미지 갤러리 정보를 불러올 수 없습니다.';
                  contentBox.appendChild(errorText);
                }
              } catch (e) {
                console.warn('Failed to parse IMAGE_GALLERY blockData JSON:', e);
                // JSON 파싱 실패 시 에러 메시지
                const errorText = document.createElement('p');
                errorText.className = 'content-text';
                errorText.style.color = 'var(--text-muted, #666)';
                errorText.textContent = '이미지 갤러리 정보를 불러올 수 없습니다.';
                contentBox.appendChild(errorText);
              }
            } else if (contentType && contentType !== '') {
              // 다른 ContentBlock 타입들
              // 추후 구현 가능
              console.warn('ContentBlock type not yet implemented:', contentType);
              const placeholderText = document.createElement('p');
              placeholderText.className = 'content-text';
              placeholderText.style.color = 'var(--text-muted, #666)';
              placeholderText.textContent = `ContentBlock 타입 "${contentType}"은 아직 구현되지 않았습니다.`;
              contentBox.appendChild(placeholderText);
            } else {
              // 기존 방식: contentType이 없거나 빈 문자열인 경우
              // h6.content-subtitle: keyword_title 표시
              if (keyword.keywordTitle) {
                const keywordSubtitle = document.createElement('h6');
                keywordSubtitle.className = 'content-subtitle';
                keywordSubtitle.textContent = keyword.keywordTitle;
                contentBox.appendChild(keywordSubtitle);
              }
              
              // Content details 표시
              if (content.details && Array.isArray(content.details)) {
                content.details.forEach((detail) => {
                  if (detail) {
                    const detailText = document.createElement('p');
                    detailText.className = 'content-text';
                    detailText.textContent = detail;
                    contentBox.appendChild(detailText);
                  }
                });
              }
            }
            
            topicSection.appendChild(contentBox);
          });
          
          // keyword에 contents가 없는 경우
          if (keywordContents.length === 0) {
            const emptyBox = document.createElement('div');
            emptyBox.className = 'detail-content-box';
            const emptyText = document.createElement('p');
            emptyText.className = 'content-text';
            emptyText.style.color = 'var(--text-muted, #666)';
            emptyText.textContent = '내용이 없습니다.';
            emptyBox.appendChild(emptyText);
            topicSection.appendChild(emptyBox);
          }
        });
        
        // topic에 keywords가 없는 경우
        if (topicKeywords.length === 0) {
          const emptyBox = document.createElement('div');
          emptyBox.className = 'detail-content-box';
          const emptyText = document.createElement('p');
          emptyText.className = 'content-text';
          emptyText.style.color = 'var(--text-muted, #666)';
          emptyText.textContent = '등록된 키워드가 없습니다.';
          emptyBox.appendChild(emptyText);
          topicSection.appendChild(emptyBox);
        }
        
        detailSubsection.appendChild(topicSection);
      });
      
      // 로딩 오버레이 제거 (페이드 아웃 효과)
      if (detailLoadingOverlay) {
        detailLoadingOverlay.style.opacity = '0';
        detailLoadingOverlay.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
          detailLoadingOverlay.remove();
        }, 300);
      }

      if (targetTopicTitle || targetTopicId) {
        requestAnimationFrame(() => {
          focusTopicBadge(targetTopicId, targetTopicTitle);
          targetTopicId = null;
          targetTopicTitle = null;
        });
      }
      
    } catch (e) {
      console.warn('Failed to render topic content boxes:', e);
      // 에러 발생 시에도 로딩 오버레이 제거
      const detailSectionEl = document.getElementById('detailSection');
      if (detailSectionEl) {
        const existingOverlay = detailSectionEl.querySelector('.detail-loading-overlay');
        if (existingOverlay) existingOverlay.remove();
      }
    }
  }

  // ===== Topic badge: Section 번호로 표기 =====
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function updateSectionBadgeByIndex(sectionIndex) {
    if (!elements.topicBadge) return;
    const index = Math.max(0, sectionIndex);
    
    // loadedLesson이 없으면 건너뛰기
    if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return;
    
    const section = loadedLesson.sections[index];
    if (!section) return;
    // sectionNumber가 있으면 사용, 없으면 index+1
    const num = typeof section.sectionNumber !== "undefined" ? section.sectionNumber : index + 1;
    elements.topicBadge.textContent = `Section ${pad2(num)}`;
  }

  // ===== Keyword list from API (render cards) =====
  async function renderKeywordsFromApi() {
    try {
      const grid = elements.keywordGrid;
      if (!grid) return;

      const subsectionInfo = getCurrentSubsectionInfo();
      if (!subsectionInfo) return;
      const { subsectionId, subsectionTitle, topicIdSet } = subsectionInfo;

      // 로딩 스피너 표시 (기존 내용을 유지하면서 오버레이로 표시)
      const keywordSection = grid.closest('.keyword-section');
      let loadingOverlay = null;
      if (keywordSection) {
        // 기존 스피너가 있으면 제거
        const existingOverlay = keywordSection.querySelector('.keyword-loading-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'keyword-loading-overlay';
        loadingOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 8px;
        `;
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.cssText = `
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        `;
        
        loadingOverlay.appendChild(spinner);
        keywordSection.style.position = 'relative';
        keywordSection.appendChild(loadingOverlay);
      }

      const res = await fetch(`${API_BASE_URL}/keywords/search/all`);
      if (!res.ok) {
        if (loadingOverlay) loadingOverlay.remove();
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        if (loadingOverlay) loadingOverlay.remove();
        return;
      }

      const normalizedSubsectionId = subsectionId ? String(subsectionId) : null;
      const normalizedTargetTopicId = targetTopicId ? String(targetTopicId) : null;

      const extractTopicId = (keyword) => {
        if (!keyword) return null;
        if (keyword.topic && (keyword.topic.id || keyword.topic.topicId)) {
          return String(keyword.topic.id ?? keyword.topic.topicId);
        }
        if (typeof keyword.topicId !== 'undefined' && keyword.topicId !== null) {
          return String(keyword.topicId);
        }
        if (typeof keyword.topic_id !== 'undefined' && keyword.topic_id !== null) {
          return String(keyword.topic_id);
        }
        if (keyword.topicDto && (keyword.topicDto.id || keyword.topicDto.topicId)) {
          return String(keyword.topicDto.id ?? keyword.topicDto.topicId);
        }
        return null;
      };

      const extractSubsectionIdFromKeyword = (keyword) => {
        if (!keyword) return null;
        if (keyword.subsection && (keyword.subsection.id || keyword.subsection.subsectionId)) {
          return String(keyword.subsection.id ?? keyword.subsection.subsectionId);
        }
        if (keyword.topic && keyword.topic.subsection && (keyword.topic.subsection.id || keyword.topic.subsection.subsectionId)) {
          return String(keyword.topic.subsection.id ?? keyword.topic.subsection.subsectionId);
        }
        if (keyword.topicDto && keyword.topicDto.subsection && (keyword.topicDto.subsection.id || keyword.topicDto.subsection.subsectionId)) {
          return String(keyword.topicDto.subsection.id ?? keyword.topicDto.subsection.subsectionId);
        }
        if (typeof keyword.subsectionId !== 'undefined' && keyword.subsectionId !== null) {
          return String(keyword.subsectionId);
        }
        if (typeof keyword.subsection_id !== 'undefined' && keyword.subsection_id !== null) {
          return String(keyword.subsection_id);
        }
        return null;
      };

      const filteredKeywords = data.filter((keyword) => {
        const keywordTopicId = extractTopicId(keyword);
        const keywordSubsectionId = extractSubsectionIdFromKeyword(keyword);

        if (normalizedTargetTopicId && keywordTopicId === normalizedTargetTopicId) {
          return true;
        }

        if (topicIdSet.size > 0 && keywordTopicId && topicIdSet.has(keywordTopicId)) {
          return true;
        }

        if (normalizedSubsectionId && keywordSubsectionId && keywordSubsectionId === normalizedSubsectionId) {
          return true;
        }

        const keywordSubsectionTitle =
          keyword.subsection?.subsectionTitle ??
          keyword.subsection?.subsection_title ??
          keyword.topic?.subsection?.subsectionTitle ??
          keyword.topic?.subsection?.subsection_title ??
          keyword.topicDto?.subsection?.subsectionTitle ??
          keyword.topicDto?.subsection?.subsection_title ??
          null;

        if (
          keywordSubsectionTitle &&
          subsectionTitle &&
          keywordSubsectionTitle.trim() === subsectionTitle.trim()
        ) {
          return true;
        }

        return false;
      });

      const keywordsToRender = filteredKeywords.length > 0 ? filteredKeywords : data;

      // 보조 데이터: detail_value 채우기 위해 contents에서 details 필드 추출
      let detailValues = [];
      try {
        const contentsRes = await fetch(`${API_BASE_URL}/contents/search/all`);
        if (contentsRes.ok) {
          const contentsArr = await contentsRes.json();
          if (Array.isArray(contentsArr)) {
            contentsArr.forEach((c) => {
              if (Array.isArray(c.details)) {
                c.details.forEach((dv) => {
                  if (dv) detailValues.push(dv);
                });
              }
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch contents for keywords:', e);
      }

      // 페이드 아웃 효과 후 내용 교체
      if (grid.children.length > 0) {
        grid.style.opacity = '0.5';
        grid.style.transition = 'opacity 0.2s ease-out';
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 비우고 재생성
      grid.innerHTML = "";

      keywordsToRender.forEach((item, idx) => {
        const n = item.keywordNumber ?? item.keyword_number ?? item.number ?? (idx + 1);
        const title = item.keywordTitle ?? item.keyword_title ?? item.title ?? (item.keywords ? item.keywords[0] : "키워드");
        // 우선순위: detail.detail_value -> keywordDesc -> description -> keywords join
        const descFromDetail = detailValues[idx];
        const desc = descFromDetail ?? item.keywordDesc ?? item.keyword_desc ?? item.description ?? (item.keywords ? item.keywords.join(', ') : "");

        const card = document.createElement('div');
        card.className = 'keyword-card';

        const numEl = document.createElement('div');
        numEl.className = 'keyword-number';
        numEl.textContent = pad2(n);

        const contentEl = document.createElement('div');
        contentEl.className = 'keyword-content';

        const titleEl = document.createElement('h4');
        titleEl.className = 'keyword-title';
        titleEl.textContent = title;

        const descEl = document.createElement('p');
        descEl.className = 'keyword-desc';
        descEl.textContent = desc;

        contentEl.appendChild(titleEl);
        contentEl.appendChild(descEl);

        card.appendChild(numEl);
        card.appendChild(contentEl);

        grid.appendChild(card);
      });

      setGridColumns(grid, keywordsToRender.length);
      
      // 페이드 인 효과
      grid.style.opacity = '0';
      grid.style.transition = 'opacity 0.3s ease-in';
      requestAnimationFrame(() => {
        grid.style.opacity = '1';
      });
      
      // 로딩 오버레이 제거
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transition = 'opacity 0.2s ease-out';
        setTimeout(() => {
          loadingOverlay.remove();
        }, 200);
      }
    } catch (e) {
      console.warn('Failed to render keyword cards:', e);
      // 에러 발생 시에도 로딩 오버레이 제거
      const keywordSection = elements.keywordGrid?.closest('.keyword-section');
      if (keywordSection) {
        const existingOverlay = keywordSection.querySelector('.keyword-loading-overlay');
        if (existingOverlay) existingOverlay.remove();
      }
    }
  }

  function updateTopicTitleFromApi(sectionIndex) {
    if (!elements.topicTitle) return;
    if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return;
    const index = Math.max(0, sectionIndex);
    const section = loadedLesson.sections[index];
    if (!section) return;
    // Section의 title을 topic-title로 반영
    elements.topicTitle.textContent = section.sectionTitle || elements.topicTitle.textContent;
    if (elements.currentTopic) {
      elements.currentTopic.textContent = elements.topicTitle.textContent;
    }
  }

  // Subsection 배지 값을 API의 subsection_number로 갱신
  function updateSubsectionBadgeFromApi() {
    const parts = (currentSubsection || "1-1").split("-");
    
    // Chapter 구조인 경우 (1-1-1 형식)
    if (loadedChapter && parts.length === 3) {
      const [lesStr, secStr, subStr] = parts;
      const lIdx = Math.max(1, parseInt(lesStr || "1", 10)) - 1;
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
      
      if (loadedChapter.lessons && loadedChapter.lessons[lIdx]) {
        const lesson = loadedChapter.lessons[lIdx];
        if (lesson.sections && lesson.sections[sIdx]) {
          const section = lesson.sections[sIdx];
          if (section.subsections && section.subsections[subIdx]) {
            const subsection = section.subsections[subIdx];
            const num = typeof subsection.subsectionNumber !== "undefined" ? subsection.subsectionNumber : (subIdx + 1);
            const text = `SUBSECTION ${pad2(num)}`;
            document.querySelectorAll('.subsection-badge').forEach((el) => {
              el.textContent = text;
            });
          }
        }
      }
      return;
    }
    
    // Lesson 구조인 경우 (1-1 형식)
    if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return;
    const [secStr, subStr] = parts;
    const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
    const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
    const section = loadedLesson.sections[sIdx];
    if (!section || !Array.isArray(section.subsections)) return;
    const subsection = section.subsections[subIdx];
    if (!subsection) return;
    const num = typeof subsection.subsectionNumber !== "undefined" ? subsection.subsectionNumber : (subIdx + 1);
    const text = `SUBSECTION ${pad2(num)}`;
    document.querySelectorAll('.subsection-badge').forEach((el) => {
      el.textContent = text;
    });
  }

  // ===== Load Subsection-Keyword Relations =====
  async function loadSubsectionKeywordRelations() {
    try {
      // API에서 subsection-keyword 관계 데이터 가져오기
      const response = await fetch(`${API_BASE_URL}/subsections/keywords/relations`);
      if (!response.ok) {
        console.warn('Failed to fetch subsection-keyword relations');
        return;
      }
      
      const relations = await response.json();
      if (!Array.isArray(relations) || relations.length === 0) {
        console.warn('No subsection-keyword relations found');
        return;
      }
      
      // 현재 subsection의 title 찾기
      const currentSubsectionTitle = getCurrentSubsectionTitle();
      if (!currentSubsectionTitle) {
        console.warn('Current subsection title not found');
        return;
      }
      
      // 현재 subsection과 매칭되는 relations 찾기
      // SQL 쿼리 결과: subsection_title과 keywords_value 쌍
      const matchingRelations = relations.filter(rel => 
        rel.subsectionTitle === currentSubsectionTitle
      );
      
      if (matchingRelations.length === 0) {
        console.warn('No matching keywords found for current subsection');
        return;
      }
      
      // subsection-title 업데이트 (관계 데이터의 subsection_title 사용)
      // 첫 번째 매칭되는 relation의 subsectionTitle 사용 (모두 같을 것이므로)
      if (matchingRelations[0].subsectionTitle) {
        updateSubsectionTitleFromRelations(matchingRelations[0].subsectionTitle);
      }
      
      // keyword-title 업데이트 (현재 subsection과 매칭되는 keywords_value만 전달)
      updateKeywordTitlesFromRelations(matchingRelations);
      
    } catch (error) {
      console.error('Error loading subsection-keyword relations:', error);
    }
  }
  
  // 현재 subsection의 title 가져오기
  function getCurrentSubsectionTitle() {
    const parts = (currentSubsection || "1-1").split("-");
    
    // Chapter 구조인 경우 (1-1-1 형식)
    if (loadedChapter && parts.length === 3) {
      const [lesStr, secStr, subStr] = parts;
      const lIdx = Math.max(1, parseInt(lesStr || "1", 10)) - 1;
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
      
      if (loadedChapter.lessons && loadedChapter.lessons[lIdx]) {
        const lesson = loadedChapter.lessons[lIdx];
        if (lesson.sections && lesson.sections[sIdx]) {
          const section = lesson.sections[sIdx];
          if (section.subsections && section.subsections[subIdx]) {
            const subsection = section.subsections[subIdx];
            return subsection.subsectionTitle || subsection.subsection_title;
          }
        }
      }
      return null;
    }
    
    // Lesson 구조인 경우 (1-1 형식: section-subsection)
    if (loadedLesson && parts.length === 2) {
      const [secStr, subStr] = parts;
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
      
      if (loadedLesson.sections && loadedLesson.sections[sIdx]) {
        const section = loadedLesson.sections[sIdx];
        if (section.subsections && section.subsections[subIdx]) {
          const subsection = section.subsections[subIdx];
          return subsection.subsectionTitle || subsection.subsection_title;
        }
      }
      return null;
    }
    
    return null;
  }

  function findSubsectionById(targetIdStr) {
    if (!targetIdStr) return null;

    const matchInLesson = () => {
      if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return null;
      for (const section of loadedLesson.sections) {
        if (!Array.isArray(section.subsections)) continue;
        for (const subsection of section.subsections) {
          const subsectionIdValue =
            subsection.id ?? subsection.subsectionId ?? subsection.subsection_id;
          if (
            subsectionIdValue !== null &&
            subsectionIdValue !== undefined &&
            String(subsectionIdValue) === targetIdStr
          ) {
            return subsection;
          }
        }
      }
      return null;
    };

    const matchInChapter = () => {
      if (!loadedChapter || !Array.isArray(loadedChapter.lessons)) return null;
      for (const lesson of loadedChapter.lessons) {
        if (!Array.isArray(lesson.sections)) continue;
        for (const section of lesson.sections) {
          if (!Array.isArray(section.subsections)) continue;
          for (const subsection of section.subsections) {
            const subsectionIdValue =
              subsection.id ?? subsection.subsectionId ?? subsection.subsection_id;
            if (
              subsectionIdValue !== null &&
              subsectionIdValue !== undefined &&
              String(subsectionIdValue) === targetIdStr
            ) {
              return subsection;
            }
          }
        }
      }
      return null;
    };

    return matchInLesson() || matchInChapter();
  }

  function getCurrentSubsectionInfo() {
    const parts = (currentSubsection || "1-1").split("-");
    const targetIdStr = currentSubsectionId ? String(currentSubsectionId) : null;

    if (targetIdStr) {
      const subsectionById = findSubsectionById(targetIdStr);
      if (subsectionById) {
        return {
          subsection: subsectionById,
          subsectionId: targetIdStr,
          subsectionTitle:
            subsectionById.subsectionTitle ?? subsectionById.subsection_title ?? null,
          topicIdSet: new Set(
            Array.isArray(subsectionById.topics)
              ? subsectionById.topics
                  .map((topic) => topic?.id ?? topic?.topicId ?? topic?.topic_id)
                  .filter((id) => id !== null && id !== undefined)
                  .map((id) => String(id))
              : []
          ),
        };
      }
    }

    const buildResult = (subsection) => {
      if (!subsection) return null;
      const subsectionId =
        subsection.id ??
        subsection.subsectionId ??
        subsection.subsection_id ??
        null;
      const subsectionTitle =
        subsection.subsectionTitle ??
        subsection.subsection_title ??
        null;

      const topicIdSet = new Set();
      if (Array.isArray(subsection.topics)) {
        subsection.topics.forEach((topic) => {
          const topicId =
            topic?.id ??
            topic?.topicId ??
            topic?.topic_id ??
            null;
          if (topicId !== null && topicId !== undefined) {
            topicIdSet.add(String(topicId));
          }
        });
      }

      return {
        subsection,
        subsectionId,
        subsectionTitle,
        topicIdSet,
      };
    };

    if (loadedChapter && parts.length === 3) {
      const [lesStr, secStr, subStr] = parts;
      const lIdx = Math.max(1, parseInt(lesStr || "1", 10)) - 1;
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;

      const lesson = loadedChapter.lessons?.[lIdx];
      const section = lesson?.sections?.[sIdx];
      const subsection = section?.subsections?.[subIdx];
      return buildResult(subsection);
    }

    if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return null;
    const [secStr, subStr] = parts;
    const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
    const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
    const section = loadedLesson.sections[sIdx];
    if (!section || !Array.isArray(section.subsections)) return null;
    const subsection = section.subsections[subIdx];
    return buildResult(subsection);
  }
  // 관계 데이터의 subsection_title로 subsection-title 업데이트
  function updateSubsectionTitleFromRelations(subsectionTitle) {
    document.querySelectorAll('.subsection-title').forEach((el) => {
      // 네비게이션의 subsection-title은 제외하고 detail-section 내부의 것만 업데이트
      if (el.closest('.detail-subsection')) {
        el.textContent = subsectionTitle;
      }
    });
  }
  
  // 관계 데이터의 keyword_title과 keywords_value로 keyword-title과 keyword-desc 업데이트
  function updateKeywordTitlesFromRelations(relations) {
    const keywordGrid = elements.keywordGrid;
    if (!keywordGrid) return;
    
    if (relations.length === 0) {
      // relations가 없으면 모든 기존 카드 숨김
      const keywordCards = keywordGrid.querySelectorAll('.keyword-card');
      keywordCards.forEach(card => {
        card.style.display = 'none';
      });
      return;
    }
    
    // keywordId별로 그룹화
    const keywordMap = new Map();
    
    relations.forEach(rel => {
      const keywordId = rel.keywordId || rel.keyword_id;
      const keywordNumber = rel.keywordNumber || rel.keyword_number || 1;
      const keywordTitle = rel.keywordTitle || rel.keyword_title || '';
      const keywordsValue = rel.keywordsValue || rel.keywords_value || '';
      
      if (!keywordMap.has(keywordId)) {
        keywordMap.set(keywordId, {
          keywordId: keywordId,
          keywordNumber: keywordNumber,
          keywordTitle: keywordTitle,
          keywordsValues: []
        });
      }
      
      // keywordsValue를 배열에 추가
      if (keywordsValue) {
        keywordMap.get(keywordId).keywordsValues.push(keywordsValue);
      }
    });
    
    // keywordNumber 순서로 정렬
    const sortedKeywords = Array.from(keywordMap.values()).sort((a, b) => {
      return (a.keywordNumber || 0) - (b.keywordNumber || 0);
    });
    
    // 기존 keyword-card 모두 제거하고 새로 생성
    keywordGrid.innerHTML = '';
    
    // 각 keyword마다 keyword-card 생성
    sortedKeywords.forEach((keyword, index) => {
      const card = document.createElement('div');
      card.className = 'keyword-card';
      
      const numEl = document.createElement('div');
      numEl.className = 'keyword-number';
      numEl.textContent = pad2(keyword.keywordNumber || (index + 1));
      
      const contentEl = document.createElement('div');
      contentEl.className = 'keyword-content';
      
      const titleEl = document.createElement('h4');
      titleEl.className = 'keyword-title';
      titleEl.textContent = keyword.keywordTitle || '제목 없음';
      
      const descEl = document.createElement('p');
      descEl.className = 'keyword-desc';
      descEl.textContent = keyword.keywordsValues.join(', ') || '설명 없음';
      
      contentEl.appendChild(titleEl);
      contentEl.appendChild(descEl);
      
      card.appendChild(numEl);
      card.appendChild(contentEl);
      
      keywordGrid.appendChild(card);
    });
    
    // grid-column 수 조정 (표시되는 카드 개수에 따라)
    if (sortedKeywords.length > 0) {
      setGridColumns(keywordGrid, sortedKeywords.length);
    }
  }

  // Subsection 제목을 API의 subsection_title로 갱신
  function updateSubsectionTitleFromApi() {
    const parts = (currentSubsection || "1-1").split("-");
    
    // Chapter 구조인 경우 (1-1-1 형식)
    if (loadedChapter && parts.length === 3) {
      const [lesStr, secStr, subStr] = parts;
      const lIdx = Math.max(1, parseInt(lesStr || "1", 10)) - 1;
      const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
      const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
      
      if (loadedChapter.lessons && loadedChapter.lessons[lIdx]) {
        const lesson = loadedChapter.lessons[lIdx];
        if (lesson.sections && lesson.sections[sIdx]) {
          const section = lesson.sections[sIdx];
          if (section.subsections && section.subsections[subIdx]) {
            const subsection = section.subsections[subIdx];
            const title = subsection.subsectionTitle || subsection.subsection_title;
            if (!title) return;
            document.querySelectorAll('.subsection-title').forEach((el) => {
              // 네비게이션의 subsection-title은 제외하고 detail-section 내부의 것만 업데이트
              if (el.closest('.detail-subsection')) {
                el.textContent = title;
              }
            });
          }
        }
      }
      return;
    }
    
    // Lesson 구조인 경우 (1-1 형식)
    if (!loadedLesson || !Array.isArray(loadedLesson.sections)) return;
    const [secStr, subStr] = parts;
    const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
    const subIdx = Math.max(1, parseInt(subStr || "1", 10)) - 1;
    const section = loadedLesson.sections[sIdx];
    if (!section || !Array.isArray(section.subsections)) return;
    const subsection = section.subsections[subIdx];
    if (!subsection) return;
    const title = subsection.subsectionTitle || subsection.subsection_title;
    if (!title) return;
    document.querySelectorAll('.subsection-title').forEach((el) => {
      // 네비게이션의 subsection-title은 제외하고 detail-section 내부의 것만 업데이트
      if (el.closest('.detail-subsection')) {
        el.textContent = title;
      }
    });
  }

  // (reverted) Subsection 배지 자동 표기 로직 제거

  // (reverted) API 기반 topic-badge/제목 자동 갱신 로직 제거

  function getSubsectionData(subsectionId) {
    // 더미 데이터
    const data = {
      "1-1": {
        badge: "Section 01",
        title: "단군신화",
        subtitle: "한국 역사의 시작, 단군신화의 내용과 의미를 학습합니다",
      },
      "1-2": {
        badge: "Section 01",
        title: "고조선의 성립",
        subtitle: "고조선이 성립된 시기와 배경, 영역을 이해합니다",
      },
      "1-3": {
        badge: "Section 01",
        title: "8조법",
        subtitle: "고조선의 법률 체계인 8조법의 내용과 의의를 학습합니다",
      },
      "2-1": {
        badge: "Section 02",
        title: "고구려의 발전",
        subtitle: "고구려의 건국과 발전 과정을 학습합니다",
      },
      "2-2": {
        badge: "Section 02",
        title: "백제의 문화",
        subtitle: "백제의 문화적 특징과 유산을 이해합니다",
      },
      "2-3": {
        badge: "Section 02",
        title: "신라의 통일",
        subtitle: "신라의 삼국통일 과정과 의의를 학습합니다",
      },
      "3-1": {
        badge: "Section 03",
        title: "삼국통일의 의의",
        subtitle: "신라의 삼국통일이 가지는 역사적 의미를 이해합니다",
      },
      "3-2": {
        badge: "Section 03",
        title: "신라의 발전",
        subtitle: "통일신라의 정치, 경제, 사회적 발전을 학습합니다",
      },
      "3-3": {
        badge: "Section 03",
        title: "불교 문화",
        subtitle: "통일신라 시대의 불교 문화를 이해합니다",
      },
    };

    return data[subsectionId] || data["1-1"];
  }

  function updatePageTitle(title) {
    document.title = title + " - 한국사 아띠";
  }

  // ===== Progress =====
  function calculateTotalSubsections() {
    totalSubsections = document.querySelectorAll(".subsection-item").length;
  }

  function updateProgress() {
    const completedCount = completedSubsections.size;
    const percentage =
      totalSubsections > 0
        ? Math.round((completedCount / totalSubsections) * 100)
        : 0;

    if (elements.progressFill) {
      elements.progressFill.style.width = percentage + "%";
    }
    if (elements.progressText) {
      elements.progressText.textContent = percentage + "% 완료";
    }
  }

  function completeCurrentSection() {
    completedSubsections.add(currentSubsection);
    updateProgress();

    // Visual feedback
    const currentItem = document.querySelector(
      `.subsection-item[data-subsection="${currentSubsection}"]`
    );
    if (currentItem) {
      currentItem.classList.add("completed");
    }

    showToast("학습을 완료했습니다! 🎉", "✓");

    // 자동으로 다음 학습으로 이동
    setTimeout(() => {
      const nextButton = document.getElementById("nextButton");
      if (nextButton && !nextButton.disabled) {
        navigateToNext();
      }
    }, 1500);
  }

  // ===== Quiz =====
  function setupQuizOptions() {
    const quizOptions = document.querySelectorAll(".quiz-option");

    quizOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const parent = this.closest(".quiz-item");
        const allOptions = parent.querySelectorAll(".quiz-option");

        // Remove selected class from all
        allOptions.forEach((opt) => {
          opt.classList.remove("selected");
        });

        // Add selected class
        this.classList.add("selected");

        // Check if correct
        if (this.classList.contains("correct")) {
          showToast("정답입니다! 👏", "✓");

          // Disable all options
          setTimeout(() => {
            allOptions.forEach((opt) => {
              opt.disabled = true;
            });
          }, 1000);
        } else {
          showToast("다시 한번 생각해보세요", "❌");
        }
      });
    });
  }

  // ===== Toast Notification =====
  function showToast(message, icon = "ℹ") {
    if (suppressToast) {
      return;
    }

    if (!elements.toast) return;

    if (elements.toastIcon) {
      elements.toastIcon.textContent = icon;
    }
    if (elements.toastMessage) {
      elements.toastMessage.textContent = message;
    }

    elements.toast.classList.add("show");

    setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 3000);
  }

  // ===== Keyboard Shortcuts =====
  function handleKeyboard(e) {
    // Arrow keys for navigation
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    
    if (e.key === "ArrowLeft" && prevButton && !prevButton.disabled) {
      e.preventDefault();
      navigateToPrevious();
    } else if (e.key === "ArrowRight" && nextButton && !nextButton.disabled) {
      e.preventDefault();
      navigateToNext();
    }

    // Space to complete
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault();
      completeCurrentSection();
    }

    // Numbers to jump to sections
    if (e.key >= "1" && e.key <= "9") {
      const sectionIndex = parseInt(e.key) - 1;
      const sections = Array.from(document.querySelectorAll(".section-header"));
      if (sections[sectionIndex]) {
        sections[sectionIndex].click();
      }
    }
  }

  // ===== Save Progress =====
  function saveProgress() {
    // localStorage에 진행 상황 저장
    const progressData = {
      currentSection,
      currentSubsection,
      completed: Array.from(completedSubsections),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("study_progress", JSON.stringify(progressData));
  }

  function loadProgress() {
    const saved = localStorage.getItem("study_progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        currentSection = data.currentSection;
        currentSubsection = data.currentSubsection;
        completedSubsections = new Set(data.completed);

        console.log("Progress loaded:", data);
      } catch (e) {
        console.error("Error loading progress:", e);
      }
    }
  }

  // Auto-save progress
  setInterval(saveProgress, 30000); // 30초마다 저장

  // Save before unload
  window.addEventListener("beforeunload", saveProgress);

  // ===== Initialize =====
  init();
})();

// ===== Export for external use =====
window.StudyPage = {
  showToast: function (message, icon) {
    // External access to toast
    const event = new CustomEvent("showToast", {
      detail: { message, icon },
    });
    document.dispatchEvent(event);
  },
};

// ===== Console Welcome =====
console.log(
  "%c📖 Study Page Loaded! ",
  "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); " +
    "color: white; padding: 10px 20px; border-radius: 5px; " +
    "font-size: 16px; font-weight: bold;"
);
console.log("Keyboard Shortcuts:");
console.log("← → : Navigate between lessons");
console.log("Ctrl + Space : Complete current section");
console.log("1-9 : Jump to section");

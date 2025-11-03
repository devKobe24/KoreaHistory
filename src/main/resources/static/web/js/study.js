// ===== Study Page JavaScript =====

(function () {
  "use strict";

  const API_BASE_URL = "/api/v1";

  // ===== State =====
  let currentSection = "1";
  let currentSubsection = "1-1";
  let completedSubsections = new Set();
  let totalSubsections = 0;
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
    topicSubtitle: document.getElementById("topicSubtitle"),
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
    const section = this.dataset.section;
    toggleSection(section, this);
    
    // Chapter 구조인 경우
    if (loadedChapter) {
      const parts = section.split("-");
      if (parts.length === 1) {
        // Lesson이 클릭된 경우 (dataset.section이 "1" 형식)
        const lessonIdx = Math.max(1, parseInt(parts[0] || "1", 10)) - 1;
        if (loadedChapter.lessons && loadedChapter.lessons[lessonIdx]) {
          loadedLesson = loadedChapter.lessons[lessonIdx];
        }
      } else if (parts.length === 2) {
        // Section이 클릭된 경우 (dataset.section이 "1-1" 형식)
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
    const index = Math.max(1, parseInt(section || "1", 10)) - 1;
    updateSectionBadgeByIndex(index);
    // Topic 제목을 해당 Section 제목으로 반영
    updateTopicTitleFromApi(index);
  }

  function handleSubsectionClick() {
    const subsection = this.dataset.subsection;
    navigateToSubsection(subsection);
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
  function navigateToSubsection(subsectionId) {
    currentSubsection = subsectionId;

    // Update active state (동적으로 생성된 요소들 포함)
    const subsectionItems = document.querySelectorAll(".subsection-item");
    subsectionItems.forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.subsection === subsectionId) {
        item.classList.add("active");
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Load content
    loadSubsectionContent(subsectionId);

    // Update navigation buttons
    updateNavigationButtons();

    // Show toast
    showToast("학습 내용이 변경되었습니다", "📖");

    // 현재 subsection이 속한 Section 기준으로 제목 갱신
    const [secStr] = (subsectionId || "1-1").split("-");
    const sIdx = Math.max(1, parseInt(secStr || "1", 10)) - 1;
    updateTopicTitleFromApi(sIdx);

    // Subsection 배지 갱신
    updateSubsectionBadgeFromApi();
    
    // Subsection 제목 갱신
    updateSubsectionTitleFromApi();
  }

  function navigateToPrevious() {
    const allSubsections = Array.from(document.querySelectorAll(".subsection-item"));
    const currentIndex = allSubsections.findIndex(
      (item) => item.dataset.subsection === currentSubsection
    );

    if (currentIndex > 0) {
      const prevSubsection =
        allSubsections[currentIndex - 1].dataset.subsection;
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
        allSubsections[currentIndex + 1].dataset.subsection;
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

  // ===== Load Study Data =====
  function loadStudyData() {
    // URL 파라미터에서 데이터 로드
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    const type = urlParams.get("type");
    const section = urlParams.get("section");

    if (title) {
      updatePageTitle(decodeURIComponent(title));
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
      lessonHeader.dataset.section = lessonIndex + 1; // Section처럼 처리
      
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
          sectionHeader.dataset.section = `${lessonIndex + 1}-${sectionIndex + 1}`;
          
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
      sectionHeader.dataset.section = sectionIndex + 1;
      
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
    sectionHeader.dataset.section = "1";
    
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
    sectionHeader.dataset.section = "1";
    
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
  }

  function loadSubsectionContent(subsectionId) {
    // 실제로는 API에서 데이터를 가져옴
    // 여기서는 더미 데이터 사용

    const contentData = getSubsectionData(subsectionId);

    // 더미 데이터는 API 데이터가 없는 경우에만 반영하도록 가드 처리
    if (!loadedLesson && elements.topicBadge) {
      elements.topicBadge.textContent = contentData.badge;
    }
    if (!loadedLesson && elements.topicTitle) {
      elements.topicTitle.textContent = contentData.title;
    }
    if (elements.topicSubtitle) {
      elements.topicSubtitle.textContent = contentData.subtitle;
    }
    if (elements.currentTopic) {
      elements.currentTopic.textContent = contentData.title;
    }

    console.log("Loaded content for:", subsectionId);
    // 키워드를 API로부터 받아 렌더링
    renderKeywordsFromApi();
    // LearningPage API로 ContentBlock 렌더링 (기존 방식으로 폴백)
    renderLearningPageFromApi();
  }

  // ===== LearningPage API로 렌더링 (ContentBlock 다형성 지원) =====
  async function renderLearningPageFromApi() {
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
      
      // LearningPage API 호출
      const response = await fetch(`${API_BASE_URL}/learning/subsection/${subsectionId}`);
      if (!response.ok) {
        console.warn('Failed to fetch learning page:', response.status);
        // 기존 방식으로 폴백
    renderTopicsFromApi();
        return;
      }
      
      const learningPage = await response.json();
      if (!learningPage.blocks || learningPage.blocks.length === 0) {
        console.warn('No blocks found in learning page');
        // 기존 방식으로 폴백
        renderTopicsFromApi();
        return;
      }
      
      // detail-subsection 요소 찾기
      const detailSubsection = document.querySelector('.detail-subsection');
      if (!detailSubsection) return;
      
      // 기존 detail-content-box 제거
      const existingBoxes = detailSubsection.querySelectorAll('.detail-content-box');
      existingBoxes.forEach(box => box.remove());
      
      // ContentBlock 타입별로 렌더링
      learningPage.blocks.forEach((block) => {
        const box = renderContentBlock(block);
        if (box) {
          detailSubsection.appendChild(box);
        }
      });
      
    } catch (e) {
      console.warn('Failed to render learning page from API:', e);
      // 기존 방식으로 폴백
      renderTopicsFromApi();
    }
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
      
      // Subsection에 속한 topics 가져오기
      const topics = subsection.topics || [];
      if (topics.length === 0) return;
      
      // Contents API에서 현재 topic에 속한 detail_value 가져오기
      let topicDetailMap = new Map(); // topic.id -> detail_values 배열
      
      try {
        const contentsRes = await fetch(`${API_BASE_URL}/contents/search/all`);
        if (contentsRes.ok) {
          const contentsArr = await contentsRes.json();
          if (Array.isArray(contentsArr)) {
            // 각 Content를 처리하여 topic별로 detail_value 그룹화
            contentsArr.forEach((content) => {
              // content.keyword.topic.id를 통해 어떤 topic에 속하는지 확인
              if (content.keyword && content.keyword.topic && content.keyword.topic.id) {
                const topicId = content.keyword.topic.id;
                
                if (!topicDetailMap.has(topicId)) {
                  topicDetailMap.set(topicId, []);
                }
                
                // 각 Content의 details 리스트를 해당 topic에 추가
                if (Array.isArray(content.details)) {
                  content.details.forEach((detailValue) => {
                    if (detailValue) {
                      topicDetailMap.get(topicId).push(detailValue);
                    }
                  });
                }
              }
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch contents:', e);
      }
      
      // detail-subsection 요소 찾기
      const detailSubsection = document.querySelector('.detail-subsection');
      if (!detailSubsection) return;
      
      // 기존 detail-content-box 제거 (하드코딩된 것들 제거)
      const existingBoxes = detailSubsection.querySelectorAll('.detail-content-box');
      existingBoxes.forEach(box => box.remove());
      
      // Topics 개수만큼 detail-content-box 생성 (각 topic의 모든 detail_value를 하나의 box에 묶음)
      topics.forEach((topic) => {
        const topicId = topic.id || topic.topicId;
        const detailValues = topicDetailMap.get(topicId) || [];
        
        // 하나의 detail-content-box 생성
        const box = document.createElement('div');
        box.className = 'detail-content-box';
        
        // content-subtitle에 topic title 표시
        const subtitle = document.createElement('h5');
        subtitle.className = 'content-subtitle';
        subtitle.textContent = topic.topicTitle || topic.topic_title || '주제';
        box.appendChild(subtitle);
        
        // 해당 topic에 속한 모든 detail_value를 content-text로 추가
        if (detailValues.length === 0) {
          // detail_value가 없으면 topic의 기본 내용 표시
          const text = document.createElement('p');
          text.className = 'content-text';
          text.textContent = topic.topicContent || topic.topic_content || topic.description || '';
          box.appendChild(text);
        } else {
          // 각 detail_value를 별도의 content-text로 추가
          detailValues.forEach((detailValue) => {
            const text = document.createElement('p');
            text.className = 'content-text';
            text.textContent = detailValue;
            box.appendChild(text);
          });
        }
        
        detailSubsection.appendChild(box);
      });
      
    } catch (e) {
      console.warn('Failed to render topic content boxes:', e);
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

      const res = await fetch(`${API_BASE_URL}/keywords/search/all`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

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

      // 비우고 재생성
      grid.innerHTML = "";

      data.forEach((item, idx) => {
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
    } catch (e) {
      console.warn('Failed to render keyword cards:', e);
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

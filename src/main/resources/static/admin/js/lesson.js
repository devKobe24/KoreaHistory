/**
 * Lesson 관리 페이지 JavaScript
 */

let lessons = [];
let chapters = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadChapters();
  loadLessons();

  // 폼 이벤트 리스너
  document
    .getElementById("createLessonForm")
    .addEventListener("submit", handleCreateLesson);
  document
    .getElementById("editLessonForm")
    .addEventListener("submit", handleEditLesson);
});

/**
 * Chapter 목록 로드 (드롭다운용)
 */
async function loadChapters() {
  try {
    chapters = await ApiEndpoints.chapters.getAll();
    populateChapterSelect();
  } catch (error) {
    console.error("Chapter 목록 로드 실패:", error);
    showAlert("Chapter 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Chapter 드롭다운 채우기
 */
function populateChapterSelect() {
  const select = document.getElementById("chapterSelect");
  select.innerHTML = '<option value="">Chapter를 선택하세요</option>';

  chapters.forEach((chapter) => {
    const option = document.createElement("option");
    option.value = chapter.id;
    option.textContent = `${chapter.chapterNumber}. ${chapter.chapterTitle}`;
    select.appendChild(option);
  });
}

/**
 * Lesson 목록 로드
 */
async function loadLessons() {
  try {
    showLoading(document.getElementById("lessonsList"));

    // 모든 Chapter를 가져와서 각 Chapter의 Lesson들을 수집
    const allLessons = [];
    for (const chapter of chapters) {
      if (chapter.lessons && chapter.lessons.length > 0) {
        chapter.lessons.forEach((lesson) => {
          allLessons.push({
            ...lesson,
            chapterTitle: chapter.chapterTitle,
            chapterNumber: chapter.chapterNumber,
          });
        });
      }
    }

    lessons = allLessons;
    displayLessons(lessons);
  } catch (error) {
    console.error("Lesson 목록 로드 실패:", error);
    showAlert("Lesson 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Lesson 목록 표시
 */
function displayLessons(lessonsData) {
  const container = document.getElementById("lessonsList");

  if (!lessonsData || lessonsData.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info">생성된 Lesson이 없습니다.</div>';
    return;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "lessonNumber", label: "번호" },
    { key: "lessonTitle", label: "제목" },
    {
      key: "chapterTitle",
      label: "부모 Chapter",
      accessor: (lesson) => `${lesson.chapterNumber}. ${lesson.chapterTitle}`,
    },
  ];

  const actions = [
    { type: "warning", label: "수정", onClick: "editLesson({id})" },
    { type: "danger", label: "삭제", onClick: "deleteLesson({id})" },
  ];

  container.innerHTML = createTable(lessonsData, columns, actions);
}

/**
 * Lesson 생성 처리
 */
async function handleCreateLesson(event) {
  event.preventDefault();

  if (
    !validateForm("createLessonForm", [
      "chapterId",
      "lessonNumber",
      "lessonTitle",
    ])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createLessonForm");
    const lessonData = {
      lessonNumber: parseInt(formData.lessonNumber),
      lessonTitle: formData.lessonTitle,
    };

    await ApiEndpoints.lessons.create(parseInt(formData.chapterId), lessonData);
    showAlert("Lesson이 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createLessonForm").reset();

    // 목록 새로고침
    loadChapters();
    loadLessons();
  } catch (error) {
    console.error("Lesson 생성 실패:", error);
    showAlert("Lesson 생성에 실패했습니다.", "error");
  }
}

/**
 * Lesson 수정 모달 열기
 */
function editLesson(lessonId) {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    showAlert("Lesson을 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정
  document.getElementById("editLessonId").value = lesson.id;
  document.getElementById("editLessonNumber").value = lesson.lessonNumber;
  document.getElementById("editLessonTitle").value = lesson.lessonTitle;

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Lesson 수정 처리
 */
async function handleEditLesson(event) {
  event.preventDefault();

  if (!validateForm("editLessonForm", ["lessonNumber", "lessonTitle"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editLessonForm");
    const lessonId = parseInt(formData.id);

    // 번호 수정
    if (
      formData.lessonNumber !==
      lessons.find((l) => l.id === lessonId).lessonNumber.toString()
    ) {
      await ApiEndpoints.lessons.updateNumber(lessonId, {
        lessonNumber: parseInt(formData.lessonNumber),
      });
    }

    // 제목 수정
    if (
      formData.lessonTitle !==
      lessons.find((l) => l.id === lessonId).lessonTitle
    ) {
      await ApiEndpoints.lessons.updateTitle(lessonId, {
        lessonTitle: formData.lessonTitle,
      });
    }

    showAlert("Lesson이 성공적으로 수정되었습니다.", "success");
    closeEditModal();
    loadChapters();
    loadLessons();
  } catch (error) {
    console.error("Lesson 수정 실패:", error);
    showAlert("Lesson 수정에 실패했습니다.", "error");
  }
}

/**
 * Lesson 삭제
 */
function deleteLesson(lessonId) {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    showAlert("Lesson을 찾을 수 없습니다.", "error");
    return;
  }

  confirmAction(
    `"${lesson.lessonTitle}" Lesson을 삭제하시겠습니까?\n\n주의: 하위의 모든 Section, Subsection, Topic, Keyword, Content가 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.lessons.delete(lessonId);
        showAlert("Lesson이 성공적으로 삭제되었습니다.", "success");
        loadChapters();
        loadLessons();
      } catch (error) {
        console.error("Lesson 삭제 실패:", error);
        showAlert("Lesson 삭제에 실패했습니다.", "error");
      }
      closeModal();
    }
  );
}

/**
 * 수정 모달 닫기
 */
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editLessonForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

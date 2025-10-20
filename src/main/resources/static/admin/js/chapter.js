/**
 * Chapter 관리 페이지 JavaScript
 */

let chapters = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadChapters();

  // 폼 이벤트 리스너
  document
    .getElementById("createChapterForm")
    .addEventListener("submit", handleCreateChapter);
  document
    .getElementById("editChapterForm")
    .addEventListener("submit", handleEditChapter);
});

/**
 * Chapter 목록 로드
 */
async function loadChapters() {
  try {
    showLoading(document.getElementById("chaptersList"));
    chapters = await ApiEndpoints.chapters.getAll();
    displayChapters(chapters);
  } catch (error) {
    console.error("Chapter 목록 로드 실패:", error);
    showAlert("Chapter 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Chapter 목록 표시
 */
function displayChapters(chaptersData) {
  const container = document.getElementById("chaptersList");

  if (!chaptersData || chaptersData.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info">생성된 Chapter가 없습니다.</div>';
    return;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "chapterNumber", label: "번호" },
    { key: "chapterTitle", label: "제목" },
  ];

  const actions = [
    { type: "warning", label: "수정", onClick: "editChapter({id})" },
    { type: "danger", label: "삭제", onClick: "deleteChapter({id})" },
  ];

  container.innerHTML = createTable(chaptersData, columns, actions);
}

/**
 * Chapter 생성 처리
 */
async function handleCreateChapter(event) {
  event.preventDefault();

  if (!validateForm("createChapterForm", ["chapterNumber", "chapterTitle"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createChapterForm");
    const chapterData = {
      chapterNumber: parseInt(formData.chapterNumber),
      chapterTitle: formData.chapterTitle,
    };

    await ApiEndpoints.chapters.create(chapterData);
    showAlert("Chapter가 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createChapterForm").reset();

    // 목록 새로고침
    loadChapters();
  } catch (error) {
    console.error("Chapter 생성 실패:", error);
    showAlert("Chapter 생성에 실패했습니다.", "error");
  }
}

/**
 * Chapter 수정 모달 열기
 */
function editChapter(chapterId) {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    showAlert("Chapter를 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정
  document.getElementById("editChapterId").value = chapter.id;
  document.getElementById("editChapterNumber").value = chapter.chapterNumber;
  document.getElementById("editChapterTitle").value = chapter.chapterTitle;

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Chapter 수정 처리
 */
async function handleEditChapter(event) {
  event.preventDefault();

  if (!validateForm("editChapterForm", ["chapterNumber", "chapterTitle"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editChapterForm");
    const chapterId = parseInt(formData.id);

    // 번호 수정
    if (
      formData.chapterNumber !==
      chapters.find((c) => c.id === chapterId).chapterNumber.toString()
    ) {
      await ApiEndpoints.chapters.updateNumber(chapterId, {
        chapterNumber: parseInt(formData.chapterNumber),
      });
    }

    // 제목 수정
    if (
      formData.chapterTitle !==
      chapters.find((c) => c.id === chapterId).chapterTitle
    ) {
      await ApiEndpoints.chapters.updateTitle(chapterId, {
        chapterTitle: formData.chapterTitle,
      });
    }

    showAlert("Chapter가 성공적으로 수정되었습니다.", "success");
    closeEditModal();
    loadChapters();
  } catch (error) {
    console.error("Chapter 수정 실패:", error);
    showAlert("Chapter 수정에 실패했습니다.", "error");
  }
}

/**
 * Chapter 삭제
 */
function deleteChapter(chapterId) {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    showAlert("Chapter를 찾을 수 없습니다.", "error");
    return;
  }

  confirmAction(
    `"${chapter.chapterTitle}" Chapter를 삭제하시겠습니까?\n\n주의: 하위의 모든 Lesson, Section, Subsection, Topic, Keyword, Content가 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.chapters.delete(chapterId);
        showAlert("Chapter가 성공적으로 삭제되었습니다.", "success");
        loadChapters();
      } catch (error) {
        console.error("Chapter 삭제 실패:", error);
        showAlert("Chapter 삭제에 실패했습니다.", "error");
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
  document.getElementById("editChapterForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

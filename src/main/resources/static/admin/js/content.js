/**
 * Content 관리 페이지 JavaScript
 */

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // 폼 이벤트 리스너
  document
    .getElementById("createContentForm")
    .addEventListener("submit", handleCreateContent);
});

/**
 * Content 생성 처리
 */
async function handleCreateContent(event) {
  event.preventDefault();

  if (!validateForm("createContentForm", ["keywordId", "details"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createContentForm");

    // 상세 내용을 줄바꿈으로 분리하여 배열로 변환
    const detailsArray = formData.details
      .split("\n")
      .map((detail) => detail.trim())
      .filter((detail) => detail.length > 0);

    const contentData = {
      details: detailsArray,
    };

    // Content 생성 API 호출 (API 엔드포인트가 없다면 임시로 처리)
    showAlert(
      "Content 생성 API가 구현되지 않았습니다. 서버에 API를 추가해주세요.",
      "warning"
    );

    // 폼 초기화
    document.getElementById("createContentForm").reset();
  } catch (error) {
    console.error("Content 생성 실패:", error);
    showAlert("Content 생성에 실패했습니다.", "error");
  }
}

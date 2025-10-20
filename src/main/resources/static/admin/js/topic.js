/**
 * Topic 관리 페이지 JavaScript
 */

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // 폼 이벤트 리스너
  document
    .getElementById("createTopicForm")
    .addEventListener("submit", handleCreateTopic);
});

/**
 * Topic 생성 처리
 */
async function handleCreateTopic(event) {
  event.preventDefault();

  if (
    !validateForm("createTopicForm", [
      "subsectionId",
      "topicNumber",
      "topicTitle",
    ])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createTopicForm");
    const topicData = {
      topicNumber: parseInt(formData.topicNumber),
      topicTitle: formData.topicTitle,
    };

    // Topic 생성 API 호출 (API 엔드포인트가 없다면 임시로 처리)
    showAlert(
      "Topic 생성 API가 구현되지 않았습니다. 서버에 API를 추가해주세요.",
      "warning"
    );

    // 폼 초기화
    document.getElementById("createTopicForm").reset();
  } catch (error) {
    console.error("Topic 생성 실패:", error);
    showAlert("Topic 생성에 실패했습니다.", "error");
  }
}

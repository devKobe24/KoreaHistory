/**
 * Subsection 관리 페이지 JavaScript
 */

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // 폼 이벤트 리스너
  document
    .getElementById("createSubsectionForm")
    .addEventListener("submit", handleCreateSubsection);
});

/**
 * Subsection 생성 처리
 */
async function handleCreateSubsection(event) {
  event.preventDefault();

  if (
    !validateForm("createSubsectionForm", [
      "sectionId",
      "subsectionNumber",
      "subsectionTitle",
    ])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createSubsectionForm");
    const subsectionData = {
      subsectionNumber: parseInt(formData.subsectionNumber),
      subsectionTitle: formData.subsectionTitle,
    };

    await ApiEndpoints.subsections.create(
      parseInt(formData.sectionId),
      subsectionData
    );
    showAlert("Subsection이 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createSubsectionForm").reset();
  } catch (error) {
    console.error("Subsection 생성 실패:", error);
    showAlert("Subsection 생성에 실패했습니다.", "error");
  }
}

/**
 * Subsection 관리 페이지 JavaScript
 */

let subsections = [];
let sections = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadSections();
  loadSubsections(); // Subsection 목록 로드 추가

  // 폼 이벤트 리스너
  document
    .getElementById("createSubsectionForm")
    .addEventListener("submit", handleCreateSubsection);
  document
    .getElementById("searchSubsectionForm")
    .addEventListener("submit", handleSearchSubsection);
  document
    .getElementById("editSubsectionForm")
    .addEventListener("submit", handleEditSubsection);
});

/**
 * Section 목록 로드 (드롭다운용)
 */
async function loadSections() {
  try {
    // 모든 Section을 가져와서 드롭다운에 채우기
    const response = await fetch("/api/v1/sections/search/all");
    if (!response.ok) {
      throw new Error("Section 목록을 불러오는데 실패했습니다.");
    }

    const sectionsData = await response.json();
    sections = sectionsData;
    populateSectionSelect();
  } catch (error) {
    console.error("Section 목록 로드 실패:", error);
    showAlert("Section 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Section 드롭다운 채우기
 */
function populateSectionSelect() {
  const select = document.getElementById("sectionSelect");
  select.innerHTML = '<option value="">Section을 선택하세요</option>';

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.id;
    option.textContent = `${section.sectionNumber}. ${section.sectionTitle}`;
    select.appendChild(option);
  });
}

/**
 * Subsection 목록 로드
 */
async function loadSubsections() {
  const container = document.getElementById("subsectionsList");

  try {
    showLoading(container);

    // 새로 추가된 API 엔드포인트 사용
    const response = await fetch("/api/v1/subsections/search/all");
    if (!response.ok) {
      throw new Error("Subsection 목록을 불러오는데 실패했습니다.");
    }

    const subsections = await response.json();

    if (subsections && subsections.length > 0) {
      displaySubsectionsList(subsections);
    } else {
      container.innerHTML =
        '<div class="alert alert-info">등록된 Subsection이 없습니다.</div>';
    }
  } catch (error) {
    console.error("Subsection 목록 로드 실패:", error);
    container.innerHTML =
      '<div class="alert alert-danger">Subsection 목록을 불러오는데 실패했습니다.</div>';
  } finally {
    // 로딩 상태 해제
    hideLoading(container);
  }
}

/**
 * Subsection 목록 표시 (계층 구조로 변경)
 */
function displaySubsectionsList(subsections) {
  const container = document.getElementById("subsectionsList");

  // 로딩 상태 해제
  hideLoading(container);

  let html = "";

  subsections.forEach((subsection) => {
    html += `
      <div class="hierarchy">
        <div class="hierarchy-item">
          <span class="hierarchy-level">Subsection</span>
          <strong>${subsection.subsectionNumber}. ${subsection.subsectionTitle}</strong>
          <span style="margin-left: 10px; color: #666; font-size: 0.9em;">(ID: ${subsection.id})</span>
          <div style="margin-left: 100px;">
            <button class="btn btn-warning btn-small" onclick="editSubsection(${subsection.id})">수정</button>
            <button class="btn btn-danger btn-small" onclick="deleteSubsection(${subsection.id})">삭제</button>
          </div>
        </div>
    `;

    // Topics 표시
    if (subsection.topics && subsection.topics.length > 0) {
      subsection.topics.forEach((topic) => {
        html += `
          <div class="hierarchy-item" style="margin-left: 20px;">
            <span class="hierarchy-level">Topic</span>
            <strong>${topic.topicNumber}. ${topic.topicTitle}</strong>
          </div>
        `;

        // Keywords 표시
        if (topic.keywords && topic.keywords.length > 0) {
          topic.keywords.forEach((keyword) => {
            html += `
              <div class="hierarchy-item" style="margin-left: 40px;">
                <span class="hierarchy-level">Keyword</span>
                <strong>${keyword.keywordNumber}. ${keyword.keywords ? keyword.keywords.join(", ") : ""}</strong>
              </div>
            `;

            // Contents 표시
            if (keyword.contents && keyword.contents.length > 0) {
              keyword.contents.forEach((content) => {
                html += `
                  <div class="hierarchy-item" style="margin-left: 60px;">
                    <span class="hierarchy-level">Content</span>
                    <div>${content.details ? content.details.join("<br>") : ""}</div>
                  </div>
                `;
              });
            }
          });
        }
      });
    }

    html += "</div>";
  });

  container.innerHTML = html;
}

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

    // Section 목록과 Subsection 목록 새로고침
    loadSections();
    loadSubsections();
  } catch (error) {
    console.error("Subsection 생성 실패:", error);
    showAlert("Subsection 생성에 실패했습니다.", "error");
  }
}

/**
 * Subsection 상세 조회 처리
 */
async function handleSearchSubsection(event) {
  event.preventDefault();

  if (!validateForm("searchSubsectionForm", ["subsectionId"])) {
    showAlert("Subsection ID를 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("searchSubsectionForm");
    const subsectionId = parseInt(formData.subsectionId);

    showLoading(document.getElementById("subsectionDetail"));
    const subsectionDetail =
      await ApiEndpoints.subsections.getById(subsectionId);
    displaySubsectionDetail(subsectionDetail);

    // 상세 정보 카드 표시 (fade in 애니메이션)
    const detailCard = document.getElementById("subsectionDetailCard");
    detailCard.style.display = "block";
    detailCard.style.opacity = "0";
    detailCard.style.transform = "translateY(20px)";
    
    // 애니메이션 적용
    setTimeout(() => {
      detailCard.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      detailCard.style.opacity = "1";
      detailCard.style.transform = "translateY(0)";
    }, 10);
  } catch (error) {
    console.error("Subsection 조회 실패:", error);
    showAlert("Subsection 조회에 실패했습니다.", "error");
    document.getElementById("subsectionDetailCard").style.display = "none";
  }
}

/**
 * Subsection 상세 정보 표시
 */
function displaySubsectionDetail(subsectionDetail) {
  const container = document.getElementById("subsectionDetail");

  if (!subsectionDetail) {
    container.innerHTML =
      '<div class="alert alert-info">Subsection 정보를 찾을 수 없습니다.</div>';
    return;
  }

  let html = `
    <div class="section-card">
      <div class="section-header">
        <h4>${subsectionDetail.subsectionNumber}. ${subsectionDetail.subsectionTitle}</h4>
        <div class="section-actions">
          <button class="btn btn-warning btn-small" onclick="editSubsection(${subsectionDetail.id})">수정</button>
          <button class="btn btn-danger btn-small" onclick="deleteSubsection(${subsectionDetail.id})">삭제</button>
        </div>
      </div>
      <div class="section-info">
        <p><strong>Subsection ID:</strong> ${subsectionDetail.id}</p>
        <p><strong>Section:</strong> ${subsectionDetail.section ? subsectionDetail.section.sectionTitle : "N/A"}</p>
        <p><strong>Lesson:</strong> ${subsectionDetail.section && subsectionDetail.section.lesson ? subsectionDetail.section.lesson.lessonTitle : "N/A"}</p>
        <p><strong>Chapter:</strong> ${subsectionDetail.section && subsectionDetail.section.lesson && subsectionDetail.section.lesson.chapter ? subsectionDetail.section.lesson.chapter.chapterTitle : "N/A"}</p>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Subsection 수정 모달 열기
 */
async function editSubsection(subsectionId) {
  try {
    // 서버에서 Subsection 데이터 가져오기
    const subsectionDetail = await ApiEndpoints.subsections.getById(subsectionId);
    
    // 모달 폼에 데이터 설정
    document.getElementById("editSubsectionId").value = subsectionId;
    document.getElementById("editSubsectionNumber").value = subsectionDetail.subsectionNumber;
    document.getElementById("editSubsectionTitle").value = subsectionDetail.subsectionTitle;

    // 모달 표시
    document.getElementById("editModal").style.display = "block";
  } catch (error) {
    console.error("Subsection 조회 실패:", error);
    showAlert("Subsection 정보를 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Subsection 수정 처리
 */
async function handleEditSubsection(event) {
  event.preventDefault();

  if (
    !validateForm("editSubsectionForm", ["subsectionNumber", "subsectionTitle"])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editSubsectionForm");
    const subsectionId = parseInt(formData.id);

    // 번호 수정
    await ApiEndpoints.subsections.updateNumber(subsectionId, {
      subsectionNumber: parseInt(formData.subsectionNumber),
    });

    // 제목 수정
    await ApiEndpoints.subsections.updateTitle(subsectionId, {
      subsectionTitle: formData.subsectionTitle,
    });

    showAlert("Subsection이 성공적으로 수정되었습니다.", "success");
    closeEditModal();

    // Subsection 목록 새로고침
    loadSubsections();

    // 현재 Subsection 다시 조회
    document.getElementById("subsectionId").value = subsectionId;
    document
      .getElementById("searchSubsectionForm")
      .dispatchEvent(new Event("submit"));
  } catch (error) {
    console.error("Subsection 수정 실패:", error);
    showAlert("Subsection 수정에 실패했습니다.", "error");
  }
}

/**
 * Subsection 삭제
 */
function deleteSubsection(subsectionId) {
  confirmAction(
    `Subsection을 삭제하시겠습니까?\n\n주의: 하위의 모든 Topic, Keyword, Content가 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.subsections.delete(subsectionId);
        showAlert("Subsection이 성공적으로 삭제되었습니다.", "success");

        // 상세 정보 숨기기
        document.getElementById("subsectionDetailCard").style.display = "none";

        // Subsection 목록 새로고침
        loadSubsections();
      } catch (error) {
        console.error("Subsection 삭제 실패:", error);
        showAlert("Subsection 삭제에 실패했습니다.", "error");
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
  document.getElementById("editSubsectionForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

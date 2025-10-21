/**
 * Content 관리 페이지 JavaScript
 */

let contents = [];
let keywords = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadKeywords();
  loadContents(); // Content 목록 로드 추가

  // 폼 이벤트 리스너
  document
    .getElementById("createContentForm")
    .addEventListener("submit", handleCreateContent);
  document
    .getElementById("searchContentForm")
    .addEventListener("submit", handleSearchContent);
  document
    .getElementById("editContentForm")
    .addEventListener("submit", handleEditContent);
});

/**
 * Keyword 목록 로드 (드롭다운용)
 */
async function loadKeywords() {
  try {
    // 모든 Keyword를 가져와서 드롭다운에 채우기
    const response = await fetch("/api/v1/keywords/search/all");
    if (!response.ok) {
      throw new Error("Keyword 목록을 불러오는데 실패했습니다.");
    }
    
    const keywordsData = await response.json();
    keywords = keywordsData;
    populateKeywordSelect();
  } catch (error) {
    console.error("Keyword 목록 로드 실패:", error);
    showAlert("Keyword 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Keyword 드롭다운 채우기
 */
function populateKeywordSelect() {
  const select = document.getElementById("keywordSelect");
  select.innerHTML = '<option value="">Keyword를 선택하세요</option>';

  keywords.forEach((keyword) => {
    const option = document.createElement("option");
    option.value = keyword.id;
    option.textContent = `${keyword.keywordNumber}. ${keyword.keywords ? keyword.keywords.join(", ") : ""}`;
    select.appendChild(option);
  });
}

/**
 * Content 목록 로드
 */
async function loadContents() {
  const container = document.getElementById("contentsList");
  
  try {
    showLoading(container);
    
    // 새로 추가된 API 엔드포인트 사용
    const response = await fetch("/api/v1/contents/search/all");
    if (!response.ok) {
      throw new Error("Content 목록을 불러오는데 실패했습니다.");
    }
    
    const contents = await response.json();
    
    if (contents && contents.length > 0) {
      displayContentsList(contents);
    } else {
      container.innerHTML =
        '<div class="alert alert-info">등록된 Content가 없습니다.</div>';
    }
  } catch (error) {
    console.error("Content 목록 로드 실패:", error);
    container.innerHTML =
      '<div class="alert alert-danger">Content 목록을 불러오는데 실패했습니다.</div>';
  }
}

/**
 * Content 목록 표시
 */
function displayContentsList(contents) {
  const container = document.getElementById("contentsList");
  
  let html = '<div class="sections-grid">';
  
  contents.forEach((content) => {
    html += `
      <div class="section-card">
        <div class="section-header">
          <h4>Content #${content.id}</h4>
          <div class="section-actions">
            <button class="btn btn-warning btn-small" onclick="editContent(${content.id})">수정</button>
            <button class="btn btn-danger btn-small" onclick="deleteContent(${content.id})">삭제</button>
          </div>
        </div>
        <div class="section-info">
          <p><strong>Keyword:</strong> ${content.keyword ? (content.keyword.keywords ? content.keyword.keywords.join(", ") : "N/A") : "N/A"}</p>
          <p><strong>Topic:</strong> ${content.keyword && content.keyword.topic ? content.keyword.topic.topicTitle : "N/A"}</p>
          <p><strong>Subsection:</strong> ${content.keyword && content.keyword.topic && content.keyword.topic.subsection ? content.keyword.topic.subsection.subsectionTitle : "N/A"}</p>
          <p><strong>Section:</strong> ${content.keyword && content.keyword.topic && content.keyword.topic.subsection && content.keyword.topic.subsection.section ? content.keyword.topic.subsection.section.sectionTitle : "N/A"}</p>
          <p><strong>Lesson:</strong> ${content.keyword && content.keyword.topic && content.keyword.topic.subsection && content.keyword.topic.subsection.section && content.keyword.topic.subsection.section.lesson ? content.keyword.topic.subsection.section.lesson.lessonTitle : "N/A"}</p>
          <p><strong>Chapter:</strong> ${content.keyword && content.keyword.topic && content.keyword.topic.subsection && content.keyword.topic.subsection.section && content.keyword.topic.subsection.section.lesson && content.keyword.topic.subsection.section.lesson.chapter ? content.keyword.topic.subsection.section.lesson.chapter.chapterTitle : "N/A"}</p>
        </div>
      </div>
    `;
  });
  
  html += "</div>";
  container.innerHTML = html;
}

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

    await ApiEndpoints.contents.create(
      parseInt(formData.keywordId),
      contentData
    );
    showAlert("Content가 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createContentForm").reset();

    // Keyword 목록과 Content 목록 새로고침
    loadKeywords();
    loadContents();
  } catch (error) {
    console.error("Content 생성 실패:", error);
    showAlert("Content 생성에 실패했습니다.", "error");
  }
}

/**
 * Content 상세 조회 처리
 */
async function handleSearchContent(event) {
  event.preventDefault();

  if (!validateForm("searchContentForm", ["contentId"])) {
    showAlert("Content ID를 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("searchContentForm");
    const contentId = parseInt(formData.contentId);

    showLoading(document.getElementById("contentDetail"));
    const contentDetail =
      await ApiEndpoints.contents.getById(contentId);
    displayContentDetail(contentDetail);

    // 상세 정보 카드 표시
    document.getElementById("contentDetailCard").style.display = "block";
  } catch (error) {
    console.error("Content 조회 실패:", error);
    showAlert("Content 조회에 실패했습니다.", "error");
    document.getElementById("contentDetailCard").style.display = "none";
  }
}

/**
 * Content 상세 정보 표시
 */
function displayContentDetail(contentDetail) {
  const container = document.getElementById("contentDetail");

  if (!contentDetail) {
    container.innerHTML =
      '<div class="alert alert-info">Content 정보를 찾을 수 없습니다.</div>';
    return;
  }

  let html = `
        <div class="hierarchy">
            <div class="hierarchy-item">
                <span class="hierarchy-level">Content</span>
                <strong>ID: ${contentDetail.id}</strong>
                <div style="margin-left: 100px;">
                    <button class="btn btn-warning btn-small" onclick="editContent(${contentDetail.id})">수정</button>
                    <button class="btn btn-danger btn-small" onclick="deleteContent(${contentDetail.id})">삭제</button>
                </div>
            </div>
    `;

  // Details 표시
  if (contentDetail.details && contentDetail.details.length > 0) {
    contentDetail.details.forEach((detail, index) => {
      html += `
                <div class="hierarchy-item" style="margin-left: 20px;">
                    <span class="hierarchy-level">Detail ${index + 1}</span>
                    <div>${detail}</div>
                </div>
            `;
    });
  }

  html += "</div>";
  container.innerHTML = html;
}

/**
 * Content 수정 모달 열기
 */
function editContent(contentId) {
  // 현재 상세 정보에서 Content 데이터 추출
  const contentDetail = document.querySelector(".hierarchy-item strong");
  if (!contentDetail) {
    showAlert("Content 정보를 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정 (실제 데이터는 서버에서 가져와야 함)
  document.getElementById("editContentId").value = contentId;

  // 상세 정보에서 현재 값 추출 (임시)
  const detailsText = document.querySelector(".hierarchy-item div");
  if (detailsText) {
    document.getElementById("editDetails").value = detailsText.textContent;
  }

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Content 수정 처리
 */
async function handleEditContent(event) {
  event.preventDefault();

  if (!validateForm("editContentForm", ["details"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editContentForm");
    const contentId = parseInt(formData.id);

    // 상세 내용을 줄바꿈으로 분리하여 배열로 변환
    const detailsArray = formData.details
      .split("\n")
      .map((detail) => detail.trim())
      .filter((detail) => detail.length > 0);

    // Content 수정
    await ApiEndpoints.contents.update(contentId, {
      details: detailsArray,
    });

    showAlert("Content가 성공적으로 수정되었습니다.", "success");
    closeEditModal();

    // Content 목록 새로고침
    loadContents();

    // 현재 Content 다시 조회
    document.getElementById("contentId").value = contentId;
    document
      .getElementById("searchContentForm")
      .dispatchEvent(new Event("submit"));
  } catch (error) {
    console.error("Content 수정 실패:", error);
    showAlert("Content 수정에 실패했습니다.", "error");
  }
}

/**
 * Content 삭제
 */
function deleteContent(contentId) {
  confirmAction(
    `Content를 삭제하시겠습니까?\n\n주의: 모든 상세 내용이 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.contents.delete(contentId);
        showAlert("Content가 성공적으로 삭제되었습니다.", "success");

        // 상세 정보 숨기기
        document.getElementById("contentDetailCard").style.display = "none";
        
        // Content 목록 새로고침
        loadContents();
      } catch (error) {
        console.error("Content 삭제 실패:", error);
        showAlert("Content 삭제에 실패했습니다.", "error");
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
  document.getElementById("editContentForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

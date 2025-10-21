/**
 * Topic 관리 페이지 JavaScript
 */

let topics = [];
let subsections = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadSubsections();
  loadTopics(); // Topic 목록 로드 추가

  // 폼 이벤트 리스너
  document
    .getElementById("createTopicForm")
    .addEventListener("submit", handleCreateTopic);
  document
    .getElementById("searchTopicForm")
    .addEventListener("submit", handleSearchTopic);
  document
    .getElementById("editTopicForm")
    .addEventListener("submit", handleEditTopic);
});

/**
 * Subsection 목록 로드 (드롭다운용)
 */
async function loadSubsections() {
  try {
    // 모든 Subsection을 가져와서 드롭다운에 채우기
    const response = await fetch("/api/v1/subsections/search/all");
    if (!response.ok) {
      throw new Error("Subsection 목록을 불러오는데 실패했습니다.");
    }
    
    const subsectionsData = await response.json();
    subsections = subsectionsData;
    populateSubsectionSelect();
  } catch (error) {
    console.error("Subsection 목록 로드 실패:", error);
    showAlert("Subsection 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Subsection 드롭다운 채우기
 */
function populateSubsectionSelect() {
  const select = document.getElementById("subsectionSelect");
  select.innerHTML = '<option value="">Subsection을 선택하세요</option>';

  subsections.forEach((subsection) => {
    const option = document.createElement("option");
    option.value = subsection.id;
    option.textContent = `${subsection.subsectionNumber}. ${subsection.subsectionTitle}`;
    select.appendChild(option);
  });
}

/**
 * Topic 목록 로드
 */
async function loadTopics() {
  const container = document.getElementById("topicsList");
  
  try {
    showLoading(container);
    
    // 새로 추가된 API 엔드포인트 사용
    const response = await fetch("/api/v1/topics/search/all");
    if (!response.ok) {
      throw new Error("Topic 목록을 불러오는데 실패했습니다.");
    }
    
    const topics = await response.json();
    
    if (topics && topics.length > 0) {
      displayTopicsList(topics);
    } else {
      container.innerHTML =
        '<div class="alert alert-info">등록된 Topic이 없습니다.</div>';
    }
  } catch (error) {
    console.error("Topic 목록 로드 실패:", error);
    container.innerHTML =
      '<div class="alert alert-danger">Topic 목록을 불러오는데 실패했습니다.</div>';
  }
}

/**
 * Topic 목록 표시
 */
function displayTopicsList(topics) {
  const container = document.getElementById("topicsList");
  
  let html = '<div class="sections-grid">';
  
  topics.forEach((topic) => {
    html += `
      <div class="section-card">
        <div class="section-header">
          <h4>${topic.topicNumber}. ${topic.topicTitle}</h4>
          <div class="section-actions">
            <button class="btn btn-warning btn-small" onclick="editTopic(${topic.id})">수정</button>
            <button class="btn btn-danger btn-small" onclick="deleteTopic(${topic.id})">삭제</button>
          </div>
        </div>
        <div class="section-info">
          <p><strong>Subsection:</strong> ${topic.subsection ? topic.subsection.subsectionTitle : "N/A"}</p>
          <p><strong>Section:</strong> ${topic.subsection && topic.subsection.section ? topic.subsection.section.sectionTitle : "N/A"}</p>
          <p><strong>Lesson:</strong> ${topic.subsection && topic.subsection.section && topic.subsection.section.lesson ? topic.subsection.section.lesson.lessonTitle : "N/A"}</p>
          <p><strong>Chapter:</strong> ${topic.subsection && topic.subsection.section && topic.subsection.section.lesson && topic.subsection.section.lesson.chapter ? topic.subsection.section.lesson.chapter.chapterTitle : "N/A"}</p>
        </div>
      </div>
    `;
  });
  
  html += "</div>";
  container.innerHTML = html;
}

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

    await ApiEndpoints.topics.create(
      parseInt(formData.subsectionId),
      topicData
    );
    showAlert("Topic이 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createTopicForm").reset();

    // Subsection 목록과 Topic 목록 새로고침
    loadSubsections();
    loadTopics();
  } catch (error) {
    console.error("Topic 생성 실패:", error);
    showAlert("Topic 생성에 실패했습니다.", "error");
  }
}

/**
 * Topic 상세 조회 처리
 */
async function handleSearchTopic(event) {
  event.preventDefault();

  if (!validateForm("searchTopicForm", ["topicId"])) {
    showAlert("Topic ID를 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("searchTopicForm");
    const topicId = parseInt(formData.topicId);

    showLoading(document.getElementById("topicDetail"));
    const topicDetail =
      await ApiEndpoints.topics.getById(topicId);
    displayTopicDetail(topicDetail);

    // 상세 정보 카드 표시
    document.getElementById("topicDetailCard").style.display = "block";
  } catch (error) {
    console.error("Topic 조회 실패:", error);
    showAlert("Topic 조회에 실패했습니다.", "error");
    document.getElementById("topicDetailCard").style.display = "none";
  }
}

/**
 * Topic 상세 정보 표시
 */
function displayTopicDetail(topicDetail) {
  const container = document.getElementById("topicDetail");

  if (!topicDetail) {
    container.innerHTML =
      '<div class="alert alert-info">Topic 정보를 찾을 수 없습니다.</div>';
    return;
  }

  let html = `
        <div class="hierarchy">
            <div class="hierarchy-item">
                <span class="hierarchy-level">Topic</span>
                <strong>${topicDetail.topicNumber}. ${topicDetail.topicTitle}</strong>
                <div style="margin-left: 100px;">
                    <button class="btn btn-warning btn-small" onclick="editTopic(${topicDetail.id})">수정</button>
                    <button class="btn btn-danger btn-small" onclick="deleteTopic(${topicDetail.id})">삭제</button>
                </div>
            </div>
    `;

  // Keywords 표시
  if (topicDetail.keywords && topicDetail.keywords.length > 0) {
    topicDetail.keywords.forEach((keyword) => {
      html += `
                <div class="hierarchy-item" style="margin-left: 20px;">
                    <span class="hierarchy-level">Keyword</span>
                    <strong>${keyword.keywordNumber}. ${keyword.keywords ? keyword.keywords.join(", ") : ""}</strong>
                </div>
            `;

      // Contents 표시
      if (keyword.contents && keyword.contents.length > 0) {
        keyword.contents.forEach((content) => {
          html += `
                        <div class="hierarchy-item" style="margin-left: 40px;">
                            <span class="hierarchy-level">Content</span>
                            <div>${content.details ? content.details.join("<br>") : ""}</div>
                        </div>
                    `;
        });
      }
    });
  }

  html += "</div>";
  container.innerHTML = html;
}

/**
 * Topic 수정 모달 열기
 */
function editTopic(topicId) {
  // 현재 상세 정보에서 Topic 데이터 추출
  const topicDetail = document.querySelector(".hierarchy-item strong");
  if (!topicDetail) {
    showAlert("Topic 정보를 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정 (실제 데이터는 서버에서 가져와야 함)
  document.getElementById("editTopicId").value = topicId;

  // 상세 정보에서 현재 값 추출 (임시)
  const titleText = topicDetail.textContent;
  const parts = titleText.split(". ");
  if (parts.length >= 2) {
    document.getElementById("editTopicNumber").value = parts[0];
    document.getElementById("editTopicTitle").value = parts[1];
  }

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Topic 수정 처리
 */
async function handleEditTopic(event) {
  event.preventDefault();

  if (
    !validateForm("editTopicForm", ["topicNumber", "topicTitle"])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editTopicForm");
    const topicId = parseInt(formData.id);

    // 번호 수정
    await ApiEndpoints.topics.updateNumber(topicId, {
      topicNumber: parseInt(formData.topicNumber),
    });

    // 제목 수정
    await ApiEndpoints.topics.updateTitle(topicId, {
      topicTitle: formData.topicTitle,
    });

    showAlert("Topic이 성공적으로 수정되었습니다.", "success");
    closeEditModal();

    // Topic 목록 새로고침
    loadTopics();

    // 현재 Topic 다시 조회
    document.getElementById("topicId").value = topicId;
    document
      .getElementById("searchTopicForm")
      .dispatchEvent(new Event("submit"));
  } catch (error) {
    console.error("Topic 수정 실패:", error);
    showAlert("Topic 수정에 실패했습니다.", "error");
  }
}

/**
 * Topic 삭제
 */
function deleteTopic(topicId) {
  confirmAction(
    `Topic을 삭제하시겠습니까?\n\n주의: 하위의 모든 Keyword, Content가 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.topics.delete(topicId);
        showAlert("Topic이 성공적으로 삭제되었습니다.", "success");

        // 상세 정보 숨기기
        document.getElementById("topicDetailCard").style.display = "none";
        
        // Topic 목록 새로고침
        loadTopics();
      } catch (error) {
        console.error("Topic 삭제 실패:", error);
        showAlert("Topic 삭제에 실패했습니다.", "error");
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
  document.getElementById("editTopicForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

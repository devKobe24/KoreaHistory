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
  
  // ContentBlock 타입 선택 시 UI 동적 변경
  const contentTypeSelect = document.getElementById("contentType");
  if (contentTypeSelect) {
    contentTypeSelect.addEventListener("change", handleContentTypeChange);
  }
  
  const editContentTypeSelect = document.getElementById("editContentType");
  if (editContentTypeSelect) {
    editContentTypeSelect.addEventListener("change", handleEditContentTypeChange);
  }
});

/**
 * ContentBlock 타입 선택 시 생성 폼 UI 변경
 */
function handleContentTypeChange() {
  const contentType = document.getElementById("contentType").value;
  const detailsGroup = document.getElementById("detailsGroup");
  const blockDataGroup = document.getElementById("blockDataGroup");
  const detailsTextarea = document.getElementById("details");
  const blockDataTextarea = document.getElementById("blockData");
  
  if (contentType && contentType.trim() !== "") {
    // ContentBlock 타입 선택됨
    if (detailsGroup) detailsGroup.style.display = "none";
    if (blockDataGroup) blockDataGroup.style.display = "block";
    // required 속성 동적 변경
    if (detailsTextarea) detailsTextarea.removeAttribute("required");
    if (blockDataTextarea) blockDataTextarea.setAttribute("required", "required");
    
    // 타입별 placeholder 설정
    const placeholders = {
      "TEXT": '{"title": "제목", "text": "내용"}',
      "TABLE": '{\n  "title": "제목",\n  "rows": [\n    {"key": "항목1", "value": "내용1"},\n    {"key": "항목2", "value": "내용2"}\n  ]\n}',
      "COMPARISON_TABLE": '{\n  "title": "제목",\n  "headers": ["항목1", "항목2"],\n  "rows": [\n    {"category": "구분", "items": ["내용1", "내용2"]}\n  ]\n}',
      "TIMELINE": '{\n  "title": "제목",\n  "rows": [\n    {"events": [{"year": "시작", "description": "내용"}]}\n  ]\n}',
      "HERITAGE": '{\n  "heritage": [\n    {\n      "site": "문화재 장소 1",\n      "period": "문화재 시기 1",\n      "item": "문화재 이름 1",\n      "imageUrl": "https://example.com/image1.png"\n    },\n    {\n      "site": "문화재 장소 2",\n      "period": "문화재 시기 2",\n      "item": "문화재 이름 2",\n      "imageUrl": "https://example.com/image2.png"\n    }\n  ]\n}',
      "IMAGE_GALLERY": '{\n  "title": "제목",\n  "items": [{"imageUrl": "이미지URL", "caption": "설명"}]\n}'
    };
    if (blockDataTextarea && placeholders[contentType]) {
      blockDataTextarea.placeholder = placeholders[contentType];
    }
  } else {
    // 기존 방식 선택
    if (detailsGroup) detailsGroup.style.display = "block";
    if (blockDataGroup) blockDataGroup.style.display = "none";
    // required 속성 동적 변경
    if (detailsTextarea) detailsTextarea.setAttribute("required", "required");
    if (blockDataTextarea) blockDataTextarea.removeAttribute("required");
  }
}

/**
 * ContentBlock 타입 선택 시 수정 폼 UI 변경
 */
function handleEditContentTypeChange() {
  const contentType = document.getElementById("editContentType").value;
  const detailsGroup = document.getElementById("editDetailsGroup");
  const blockDataGroup = document.getElementById("editBlockDataGroup");
  const detailsTextarea = document.getElementById("editDetails");
  const blockDataTextarea = document.getElementById("editBlockData");
  
  if (contentType && contentType.trim() !== "") {
    // ContentBlock 타입 선택됨
    detailsGroup.style.display = "none";
    blockDataGroup.style.display = "block";
    // required 속성 동적 변경
    if (detailsTextarea) detailsTextarea.removeAttribute("required");
    if (blockDataTextarea) blockDataTextarea.setAttribute("required", "required");
    
    // 타입별 placeholder 설정
    const placeholders = {
      "TEXT": '{"title": "제목", "text": "내용"}',
      "TABLE": '{\n  "title": "제목",\n  "rows": [\n    {"key": "항목1", "value": "내용1"},\n    {"key": "항목2", "value": "내용2"}\n  ]\n}',
      "COMPARISON_TABLE": '{\n  "title": "제목",\n  "headers": ["항목1", "항목2"],\n  "rows": [\n    {"category": "구분", "items": ["내용1", "내용2"]}\n  ]\n}',
      "TIMELINE": '{\n  "title": "제목",\n  "rows": [\n    {"events": [{"year": "시작", "description": "내용"}]}\n  ]\n}',
      "HERITAGE": '{\n  "heritage": [\n    {\n      "site": "문화재 장소 1",\n      "period": "문화재 시기 1",\n      "item": "문화재 이름 1",\n      "imageUrl": "https://example.com/image1.png"\n    },\n    {\n      "site": "문화재 장소 2",\n      "period": "문화재 시기 2",\n      "item": "문화재 이름 2",\n      "imageUrl": "https://example.com/image2.png"\n    }\n  ]\n}',
      "IMAGE_GALLERY": '{\n  "title": "제목",\n  "items": [{"imageUrl": "이미지URL", "caption": "설명"}]\n}'
    };
    if (blockDataTextarea && placeholders[contentType]) {
      blockDataTextarea.placeholder = placeholders[contentType];
    }
  } else {
    // 기존 방식 선택
    detailsGroup.style.display = "block";
    blockDataGroup.style.display = "none";
    // required 속성 동적 변경
    if (detailsTextarea) detailsTextarea.setAttribute("required", "required");
    if (blockDataTextarea) blockDataTextarea.removeAttribute("required");
  }
}

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

  // keyword_id별로 그룹화하여 각 keyword당 하나의 option 생성
  keywords.forEach((keyword) => {
    const option = document.createElement("option");
    option.value = keyword.id;
    
    // 형식: "keywords_value1, keywords_value2, ... (ID: keyword_id, Subsection: subsection_title (ID: subsection_id), Topic: topic_title (ID: topic_id))"
    const keywordId = keyword.id || "N/A";
    const subsectionTitle = keyword.topic?.subsection?.subsectionTitle || "N/A";
    const subsectionId = keyword.topic?.subsection?.id || "N/A";
    const topicTitle = keyword.topic?.topicTitle || "N/A";
    const topicId = keyword.topic?.id || "N/A";
    
    // keywords 배열을 정렬하고 쉼표로 구분
    let keywordsText = "";
    if (keyword.keywords && keyword.keywords.length > 0) {
      // keywords 배열을 정렬하여 일관된 순서로 표시
      const sortedKeywords = [...keyword.keywords].sort();
      keywordsText = sortedKeywords.join(", ");
    } else {
      keywordsText = "";
    }
    
    // keywords가 있는 경우와 없는 경우 모두 처리
    if (keywordsText) {
      option.textContent = `${keywordsText} (ID: ${keywordId}, Subsection: ${subsectionTitle} (ID: ${subsectionId}), Topic: ${topicTitle} (ID: ${topicId}))`;
    } else {
      option.textContent = `(ID: ${keywordId}, Subsection: ${subsectionTitle} (ID: ${subsectionId}), Topic: ${topicTitle} (ID: ${topicId}))`;
    }
    
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
  } finally {
    // 로딩 상태 해제
    hideLoading(container);
  }
}

/**
 * Content 목록 표시 (계층 구조로 변경)
 */
function displayContentsList(contents) {
  const container = document.getElementById("contentsList");

  // 로딩 상태 해제
  hideLoading(container);

  let html = "";

  contents.forEach((content) => {
    const contentType = content.contentType || "기존 방식";
    const hasBlockData = content.blockData && content.blockData.trim() !== "";
    
    html += `
      <div class="hierarchy">
        <div class="hierarchy-item">
          <span class="hierarchy-level">Content</span>
          <strong>${content.contentTitle || "N/A"}  #${content.contentNumber || "N/A"}</strong>
          <span style="margin-left: 10px; color: #666; font-size: 0.9em;">(ID: ${content.id})</span>
          <div style="margin-left: 100px;">
            <button class="btn btn-warning btn-small" onclick="editContent(${content.id})">수정</button>
            <button class="btn btn-danger btn-small" onclick="deleteContent(${content.id})">삭제</button>
          </div>
        </div>
        <div class="hierarchy-item" style="margin-left: 20px;">
          <span class="hierarchy-level">번호:</span> ${content.contentNumber || "N/A"}
          <span class="hierarchy-level" style="margin-left: 20px;">제목:</span> ${content.contentTitle || "N/A"}
          <span class="hierarchy-level" style="margin-left: 20px;">타입:</span> ${contentType}
        </div>
        <div class="hierarchy-item" style="margin-left: 20px;">
          <span class="hierarchy-level">Details</span>
          <div>${content.details && content.details.length > 0 ? content.details.join("<br>") : "-"}</div>
        </div>
        ${hasBlockData ? `
        <div class="hierarchy-item" style="margin-left: 20px;">
          <span class="hierarchy-level">Block Data</span>
          <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${content.blockData}</div>
        </div>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Content 생성 처리
 */
async function handleCreateContent(event) {
  event.preventDefault();
  
  console.log("=== handleCreateContent 시작 ===");

  try {
    // 폼에서 직접 값 가져오기
    const contentNumberInput = document.getElementById("contentNumber");
    const contentTitleInput = document.getElementById("contentTitle");
    const detailsTextarea = document.getElementById("details");
    const keywordSelect = document.getElementById("keywordSelect");

    // 디버깅: 입력 필드 원본 값 확인
    console.log("contentNumberInput:", contentNumberInput);
    console.log("contentNumberInput.value:", contentNumberInput ? contentNumberInput.value : "null");
    console.log("contentTitleInput:", contentTitleInput);
    console.log("contentTitleInput.value:", contentTitleInput ? contentTitleInput.value : "null");
    console.log("detailsTextarea.value:", detailsTextarea ? detailsTextarea.value : "null");
    console.log("keywordSelect.value:", keywordSelect ? keywordSelect.value : "null");

    // contentNumber 검증 및 가져오기
    const contentNumberValue = contentNumberInput ? contentNumberInput.value.trim() : "";
    const contentNumber = contentNumberValue ? parseInt(contentNumberValue) : NaN;
    
    console.log("contentNumber 원본 값:", contentNumberValue);
    console.log("contentNumber 파싱 결과:", contentNumber);
    
    if (!contentNumberValue || isNaN(contentNumber)) {
      console.error("contentNumber 검증 실패:", contentNumberValue, "->", contentNumber);
      showAlert("Content 번호를 올바르게 입력해주세요.", "error");
      return;
    }

    // contentTitle 검증 및 가져오기
    const contentTitleValue = contentTitleInput ? contentTitleInput.value.trim() : "";
    if (!contentTitleValue || contentTitleValue.length === 0) {
      console.error("contentTitle 검증 실패:", contentTitleValue);
      showAlert("Content 제목을 입력해주세요.", "error");
      return;
    }

    // contentType과 blockData 가져오기
    const contentTypeSelect = document.getElementById("contentType");
    const contentType = contentTypeSelect ? contentTypeSelect.value : "";
    const blockDataTextarea = document.getElementById("blockData");
    const blockData = blockDataTextarea ? blockDataTextarea.value.trim() : "";

    // 상세 내용을 줄바꿈으로 분리하여 배열로 변환
    const detailsValue = detailsTextarea ? detailsTextarea.value : "";
    const detailsArray = detailsValue
      .split("\n")
      .map((detail) => detail.trim())
      .filter((detail) => detail.length > 0);

    // ContentBlock 타입이 선택되지 않은 경우 details 검증
    if (!contentType || contentType.trim() === "") {
      if (detailsArray.length === 0) {
        console.error("details 검증 실패: 비어있음");
        showAlert("상세 내용을 입력해주세요.", "error");
        return;
      }
    } else {
      // ContentBlock 타입이 선택된 경우 blockData 검증
      if (!blockData || blockData.trim() === "") {
        console.error("blockData 검증 실패: 비어있음");
        showAlert("Block Data를 입력해주세요.", "error");
        return;
      }
      
      // JSON 유효성 검증
      try {
        JSON.parse(blockData);
      } catch (e) {
        console.error("blockData JSON 파싱 실패:", e);
        showAlert("Block Data가 올바른 JSON 형식이 아닙니다.", "error");
        return;
      }
    }

    // keywordId 가져오기 및 검증
    const keywordIdValue = keywordSelect ? keywordSelect.value : "";
    const keywordId = keywordIdValue ? parseInt(keywordIdValue) : NaN;
    
    if (!keywordIdValue || isNaN(keywordId)) {
      console.error("keywordId 검증 실패:", keywordIdValue, "->", keywordId);
      showAlert("Keyword를 선택해주세요.", "error");
      return;
    }

    // 최종 데이터 객체 생성
    const contentData = {
      contentNumber: contentNumber,
      contentTitle: contentTitleValue,
      details: detailsArray,
      contentType: contentType && contentType.trim() !== "" ? contentType : null,
      blockData: blockData && blockData.trim() !== "" ? blockData : null,
    };

    // 디버깅: 최종 전송 데이터 확인
    console.log("=== 최종 전송 데이터 ===");
    console.log("contentNumber:", contentNumber, "(타입:", typeof contentNumber, ")");
    console.log("contentTitle:", contentTitleValue);
    console.log("keywordId:", keywordId);
    console.log("details:", detailsArray);
    console.log("contentType:", contentType);
    console.log("blockData:", blockData);
    console.log("전송할 JSON:", JSON.stringify(contentData, null, 2));
    console.log("===========================");

    // 최종 검증 (이중 체크)
    if (contentData.contentNumber === null || contentData.contentNumber === undefined || isNaN(contentData.contentNumber)) {
      console.error("최종 contentNumber 검증 실패:", contentData.contentNumber);
      showAlert("Content 번호를 올바르게 입력해주세요.", "error");
      return;
    }
    if (!contentData.contentTitle || contentData.contentTitle.trim().length === 0) {
      console.error("최종 contentTitle 검증 실패:", contentData.contentTitle);
      showAlert("Content 제목을 입력해주세요.", "error");
      return;
    }

    console.log("API 호출 시작:", `/api/v1/create/content/${keywordId}`);
    const result = await ApiEndpoints.contents.create(
      keywordId,
      contentData
    );
    console.log("API 호출 성공:", result);
    
    showAlert("Content가 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createContentForm").reset();

    // Keyword 목록과 Content 목록 새로고침
    loadKeywords();
    loadContents();
  } catch (error) {
    console.error("Content 생성 실패:", error);
    showAlert("Content 생성에 실패했습니다: " + error.message, "error");
  }
  
  console.log("=== handleCreateContent 종료 ===");
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

    // 상세 정보 카드 표시 (fade in 애니메이션)
    const detailCard = document.getElementById("contentDetailCard");
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
    <div class="section-card">
      <div class="section-header">
        <h4>Content #${contentDetail.id}</h4>
        <div class="section-actions">
          <button class="btn btn-warning btn-small" onclick="editContent(${contentDetail.id})">수정</button>
          <button class="btn btn-danger btn-small" onclick="deleteContent(${contentDetail.id})">삭제</button>
        </div>
      </div>
      <div class="section-info">
        <p><strong>Content ID:</strong> ${contentDetail.id}</p>
        <p><strong>Content 번호:</strong> ${contentDetail.contentNumber || "N/A"}</p>
        <p><strong>Content 제목:</strong> ${contentDetail.contentTitle || "N/A"}</p>
        <p><strong>Keyword:</strong> ${contentDetail.keyword ? (contentDetail.keyword.keywords ? contentDetail.keyword.keywords.join(", ") : "N/A") : "N/A"}</p>
        <p><strong>Topic:</strong> ${contentDetail.keyword && contentDetail.keyword.topic ? contentDetail.keyword.topic.topicTitle : "N/A"}</p>
        <p><strong>Subsection:</strong> ${contentDetail.keyword && contentDetail.keyword.topic && contentDetail.keyword.topic.subsection ? contentDetail.keyword.topic.subsection.subsectionTitle : "N/A"}</p>
        <p><strong>Section:</strong> ${contentDetail.keyword && contentDetail.keyword.topic && contentDetail.keyword.topic.subsection && contentDetail.keyword.topic.subsection.section ? contentDetail.keyword.topic.subsection.section.sectionTitle : "N/A"}</p>
        <p><strong>Lesson:</strong> ${contentDetail.keyword && contentDetail.keyword.topic && contentDetail.keyword.topic.subsection && contentDetail.keyword.topic.subsection.section && contentDetail.keyword.topic.subsection.section.lesson ? contentDetail.keyword.topic.subsection.section.lesson.lessonTitle : "N/A"}</p>
        <p><strong>Chapter:</strong> ${contentDetail.keyword && contentDetail.keyword.topic && contentDetail.keyword.topic.subsection && contentDetail.keyword.topic.subsection.section && contentDetail.keyword.topic.subsection.section.lesson && contentDetail.keyword.topic.subsection.section.lesson.chapter ? contentDetail.keyword.topic.subsection.section.lesson.chapter.chapterTitle : "N/A"}</p>
        ${contentDetail.details && contentDetail.details.length > 0 ? `<p><strong>Details:</strong><br>${contentDetail.details.map((d, i) => `${i + 1}. ${d}`).join("<br>")}</p>` : ""}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Content 수정 모달 열기
 */
async function editContent(contentId) {
  try {
    // 서버에서 Content 상세 정보 가져오기
    const contentDetail = await ApiEndpoints.contents.getById(contentId);
    
    // 모달 폼에 데이터 설정
    document.getElementById("editContentId").value = contentId;
    document.getElementById("editContentNumber").value = contentDetail.contentNumber || "";
    document.getElementById("editContentTitle").value = contentDetail.contentTitle || "";
    document.getElementById("editDetails").value = contentDetail.details ? contentDetail.details.join("\n") : "";
    
    // ContentBlock 관련 필드 설정
    if (contentDetail.contentType) {
      document.getElementById("editContentType").value = contentDetail.contentType;
      handleEditContentTypeChange(); // UI 업데이트
    }
    if (contentDetail.blockData) {
      document.getElementById("editBlockData").value = contentDetail.blockData;
    }

    // 모달 표시
    document.getElementById("editModal").style.display = "block";
  } catch (error) {
    console.error("Content 조회 실패:", error);
    showAlert("Content 정보를 가져오는데 실패했습니다.", "error");
  }
}

/**
 * Content 수정 처리
 */
async function handleEditContent(event) {
  event.preventDefault();

  if (!validateForm("editContentForm", ["contentNumber", "contentTitle"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editContentForm");
    const contentId = parseInt(formData.id);

    // ContentBlock 타입과 데이터 가져오기
    const contentType = formData.contentType || "";
    const blockData = formData.blockData || "";

    // 상세 내용을 줄바꿈으로 분리하여 배열로 변환
    const detailsArray = formData.details
      .split("\n")
      .map((detail) => detail.trim())
      .filter((detail) => detail.length > 0);

    // ContentBlock 타입이 선택된 경우 blockData 검증
    if (contentType && contentType.trim() !== "") {
      if (!blockData || blockData.trim() === "") {
        showAlert("Block Data를 입력해주세요.", "error");
        return;
      }
      
      // JSON 유효성 검증
      try {
        JSON.parse(blockData);
      } catch (e) {
        showAlert("Block Data가 올바른 JSON 형식이 아닙니다.", "error");
        return;
      }
    }

    // Content 수정
    await ApiEndpoints.contents.update(contentId, {
      contentNumber: parseInt(formData.contentNumber),
      contentTitle: formData.contentTitle,
      details: detailsArray,
      contentType: contentType && contentType.trim() !== "" ? contentType : null,
      blockData: blockData && blockData.trim() !== "" ? blockData : null,
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

/**
 * JSON 템플릿 생성 도우미 함수
 */
function generateJSONTemplate(mode = 'create') {
  const contentTypeElement = mode === 'edit' ? document.getElementById("editContentType") : document.getElementById("contentType");
  const contentType = contentTypeElement ? contentTypeElement.value : "";
  
  if (!contentType || contentType.trim() === "") {
    showAlert("Content Block 타입을 먼저 선택해주세요.", "error");
    return;
  }
  
  const templates = {
    "TEXT": {
      "title": "텍스트 제목",
      "text": "텍스트 내용을 여기에 입력하세요."
    },
    "TABLE": {
      "title": "테이블 제목",
      "rows": [
        {"key": "항목1", "value": "내용1"},
        {"key": "항목2", "value": "내용2"},
        {"key": "항목3", "value": "내용3"}
      ]
    },
    "COMPARISON_TABLE": {
      "title": "비교 테이블 제목",
      "headers": ["항목1", "항목2"],
      "rows": [
        {
          "category": "구분1",
          "items": [
            {
              "label": "라벨1",
              "details": ["내용1-1", "내용1-2"]
            },
            {
              "label": "라벨2",
              "details": ["내용2-1", "내용2-2"]
            }
          ]
        },
        {
          "category": "구분2",
          "items": [
            {
              "label": "라벨1",
              "details": ["내용1-1"]
            },
            {
              "label": "라벨2",
              "details": ["내용2-1"]
            }
          ]
        }
      ]
    },
    "TIMELINE": {
      "title": "타임라인 제목",
      "timeline": [
        {
          "year": "연도",
          "event": "이벤트",
          "details": ["상세내용1", "상세내용2"]
        },
        {
          "year": "연도",
          "event": "이벤트",
          "details": ["상세내용1"]
        }
      ]
    },
    "HERITAGE": {
      "heritage": [
        {
          "site": null,
          "period": null,
          "item": "문화재 이름 1",
          "imageUrl": "https://example.com/image1.png"
        },
        {
          "site": null,
          "period": null,
          "item": "문화재 이름 2",
          "imageUrl": "https://example.com/image2.png"
        }
      ]
    },
    "IMAGE_GALLERY": {
      "title": "이미지 갤러리 제목",
      "items": [
        {
          "id": "item1",
          "name": "이미지1",
          "images": ["https://example.com/image1.png", "https://example.com/image1-2.png"]
        },
        {
          "id": "item2",
          "name": "이미지2",
          "images": ["https://example.com/image2.png"]
        }
      ]
    }
  };
  
  const template = templates[contentType];
  if (!template) {
    showAlert("지원하지 않는 Content Block 타입입니다.", "error");
    return;
  }
  
  const textarea = mode === 'edit' ? document.getElementById("editBlockData") : document.getElementById("blockData");
  if (textarea) {
    textarea.value = JSON.stringify(template, null, 2);
    showAlert("템플릿이 생성되었습니다. 값을 수정해주세요.", "success");
  }
}

/**
 * JSON 포맷 정리 도우미 함수
 */
function formatJSON(mode = 'create') {
  const textarea = mode === 'edit' ? document.getElementById("editBlockData") : document.getElementById("blockData");
  if (!textarea) return;
  
  const content = textarea.value.trim();
  if (!content) {
    showAlert("포맷할 내용이 없습니다.", "error");
    return;
  }
  
  try {
    const parsed = JSON.parse(content);
    textarea.value = JSON.stringify(parsed, null, 2);
    showAlert("JSON이 포맷되었습니다.", "success");
  } catch (e) {
    showAlert("올바른 JSON 형식이 아닙니다: " + e.message, "error");
  }
}

/**
 * JSON 유효성 검사 도우미 함수
 */
function validateJSON(mode = 'create') {
  const textarea = mode === 'edit' ? document.getElementById("editBlockData") : document.getElementById("blockData");
  if (!textarea) return;
  
  const content = textarea.value.trim();
  if (!content) {
    showAlert("검증할 내용이 없습니다.", "error");
    return;
  }
  
  try {
    JSON.parse(content);
    showAlert("✓ JSON 형식이 올바릅니다.", "success");
  } catch (e) {
    showAlert("JSON 형식 오류: " + e.message, "error");
  }
}

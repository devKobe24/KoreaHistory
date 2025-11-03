/**
 * Keyword 관리 페이지 JavaScript
 */

let keywords = [];
let allKeywords = []; // 전체 키워드 목록
let topics = []; // Topic 목록

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // 폼 이벤트 리스너
  document
    .getElementById("searchKeywordForm")
    .addEventListener("submit", handleSearchKeyword);
  document
    .getElementById("createKeywordForm")
    .addEventListener("submit", handleCreateKeyword);
  document
    .getElementById("editKeywordForm")
    .addEventListener("submit", handleEditKeyword);

  // 페이지 로드 시 Topic 목록 및 전체 키워드 목록 불러오기
  loadTopics();
  loadAllKeywords();
});

/**
 * Topic 목록 로드 (드롭다운용)
 */
async function loadTopics() {
  try {
    // 모든 Topic을 가져와서 드롭다운에 채우기
    topics = await ApiEndpoints.topics.getAll();
    populateTopicSelect();
  } catch (error) {
    console.error("Topic 목록 로드 실패:", error);
    showAlert("Topic 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Topic 드롭다운 채우기
 */
function populateTopicSelect() {
  const select = document.getElementById("topicSelect");
  select.innerHTML = '<option value="">Topic을 선택하세요</option>';

  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.topicTitle;
    option.textContent = `${topic.topicNumber}. ${topic.topicTitle}`;
    select.appendChild(option);
  });
}

/**
 * Keyword 검색 처리
 */
async function handleSearchKeyword(event) {
  event.preventDefault();

  const formData = getFormData("searchKeywordForm");
  if (!formData.keyword || formData.keyword.trim() === "") {
    showAlert("검색어를 입력해주세요.", "error");
    return;
  }

  try {
    showLoading(document.getElementById("keywordsList"));

    // 검색어 파싱하여 조합 검색 수행
    const searchTerms = parseSearchTerms(formData.keyword);
    keywords = await searchKeywordCombinations(searchTerms);
    displayKeywords(keywords);
  } catch (error) {
    console.error("Keyword 검색 실패:", error);
    showAlert("Keyword 검색에 실패했습니다.", "error");
    document.getElementById("keywordsList").innerHTML =
      '<div class="alert alert-error">검색 중 오류가 발생했습니다.</div>';
  }
}

/**
 * 검색어 파싱 - 쉼표, 공백, + 기호로 구분된 키워드들을 추출
 */
function parseSearchTerms(searchInput) {
  // 쉼표, 공백, + 기호로 구분하여 키워드 추출
  const terms = searchInput
    .split(/[,+\s]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  return terms;
}

/**
 * 키워드 조합 검색 수행
 */
async function searchKeywordCombinations(searchTerms) {
  try {
    // 백엔드의 조합 검색 API 사용
    if (searchTerms.length > 1) {
      return await ApiEndpoints.keywords.searchCombination(searchTerms);
    } else {
      // 단일 키워드 검색
      return await ApiEndpoints.keywords.search(searchTerms[0]);
    }
  } catch (error) {
    console.warn("조합 검색 실패, 개별 검색으로 대체:", error);

    // 조합 검색 실패 시 개별 검색으로 대체
    const allResults = [];
    const seenIds = new Set();

    for (const term of searchTerms) {
      try {
        const results = await ApiEndpoints.keywords.search(term);
        results.forEach((result) => {
          if (!seenIds.has(result.id)) {
            allResults.push(result);
            seenIds.add(result.id);
          }
        });
      } catch (error) {
        console.warn(`검색어 "${term}" 검색 실패:`, error);
      }
    }

    return allResults;
  }
}

/**
 * Keyword 생성 처리
 */
async function handleCreateKeyword(event) {
  event.preventDefault();

  if (
    !validateForm("createKeywordForm", [
      "topicTitle",
      "keywordNumber",
      "keywords",
    ])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createKeywordForm");

    // 키워드 문자열을 배열로 변환
    const keywordsArray = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const keywordData = {
      keywordNumber: parseInt(formData.keywordNumber),
      keywords: keywordsArray,
    };

    await ApiEndpoints.keywords.create(formData.topicTitle, keywordData);

    showAlert("Keyword가 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createKeywordForm").reset();

    // 생성된 키워드로 자동 검색
    document.getElementById("searchKeyword").value = keywordsArray[0];

    // 검색 폼 제출 이벤트 트리거
    document
      .getElementById("searchKeywordForm")
      .dispatchEvent(new Event("submit"));

    // Topic 목록과 전체 키워드 목록 새로고침
    loadTopics();
    loadAllKeywords();
  } catch (error) {
    console.error("Keyword 생성 실패:", error);
    showAlert("Keyword 생성에 실패했습니다.", "error");
  }
}

/**
 * Keyword 목록 표시
 */
function displayKeywords(keywordsData) {
  const container = document.getElementById("keywordsList");

  if (!keywordsData || keywordsData.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info">검색된 Keyword가 없습니다.</div>';
    return;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "keywordNumber", label: "번호" },
    {
      key: "keywords",
      label: "키워드들",
      accessor: (keyword) =>
        keyword.keywords ? keyword.keywords.join(", ") : "-",
    },
  ];

  const actions = [
    { type: "warning", label: "수정", onClick: "editKeyword({id})" },
    { type: "danger", label: "삭제", onClick: "deleteKeyword({id})" },
  ];

  container.innerHTML = createTable(keywordsData, columns, actions);
}

/**
 * Keyword 수정 모달 열기
 */
function editKeyword(keywordId) {
  // keywords 또는 allKeywords에서 찾기
  const keyword = keywords.find((k) => k.id === keywordId) || 
                  allKeywords.find((k) => k.id === keywordId);
  if (!keyword) {
    showAlert("Keyword를 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정
  document.getElementById("editKeywordId").value = keyword.id;
  document.getElementById("editKeywordNumber").value = keyword.keywordNumber;
  document.getElementById("editKeywords").value = keyword.keywords
    ? keyword.keywords.join(", ")
    : "";

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Keyword 수정 처리
 */
async function handleEditKeyword(event) {
  event.preventDefault();

  if (!validateForm("editKeywordForm", ["keywordNumber", "keywords"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editKeywordForm");
    const keywordId = parseInt(formData.id);

    // 키워드 문자열을 배열로 변환
    const keywordsArray = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // keywords 또는 allKeywords에서 찾기
    const keyword = keywords.find((k) => k.id === keywordId) || 
                    allKeywords.find((k) => k.id === keywordId);

    // 번호 수정
    if (
      formData.keywordNumber !==
      keyword.keywordNumber.toString()
    ) {
      await ApiEndpoints.keywords.updateNumber(keywordId, {
        keywordNumber: parseInt(formData.keywordNumber),
      });
    }

    // 키워드 내용 수정
    const currentKeywords = keyword.keywords || [];
    if (JSON.stringify(keywordsArray) !== JSON.stringify(currentKeywords)) {
      await ApiEndpoints.keywords.update(keywordId, {
        keywords: keywordsArray,
      });
    }

    showAlert("Keyword가 성공적으로 수정되었습니다.", "success");
    closeEditModal();

    // 현재 검색어로 다시 검색
    const currentSearchTerm = document.getElementById("searchKeyword").value;
    if (currentSearchTerm) {
      document
        .getElementById("searchKeywordForm")
        .dispatchEvent(new Event("submit"));
    }

    // 전체 키워드 목록 새로고침
    loadAllKeywords();
  } catch (error) {
    console.error("Keyword 수정 실패:", error);
    showAlert("Keyword 수정에 실패했습니다.", "error");
  }
}

/**
 * Keyword 삭제
 */
function deleteKeyword(keywordId) {
  // keywords 또는 allKeywords에서 찾기
  const keyword = keywords.find((k) => k.id === keywordId) || 
                  allKeywords.find((k) => k.id === keywordId);
  if (!keyword) {
    showAlert("Keyword를 찾을 수 없습니다.", "error");
    return;
  }

  const keywordText = keyword.keywords ? keyword.keywords.join(", ") : "";

  confirmAction(
    `"${keywordText}" Keyword를 삭제하시겠습니까?\n\n주의: 하위의 모든 Content가 함께 삭제됩니다.`,
    async () => {
      try {
        // 키워드 그룹 삭제
        await ApiEndpoints.keywords.deleteGroup(keywordId);
        showAlert("Keyword가 성공적으로 삭제되었습니다.", "success");

        // 현재 검색어로 다시 검색
        const currentSearchTerm =
          document.getElementById("searchKeyword").value;
        if (currentSearchTerm) {
          document
            .getElementById("searchKeywordForm")
            .dispatchEvent(new Event("submit"));
        }

        // 전체 키워드 목록 새로고침
        loadAllKeywords();
      } catch (error) {
        console.error("Keyword 삭제 실패:", error);
        showAlert("Keyword 삭제에 실패했습니다.", "error");
      }
      closeModal();
    }
  );
}

/**
 * 전체 키워드 목록 불러오기
 */
async function loadAllKeywords() {
  try {
    showLoading(document.getElementById("keywordCardsContainer"));
    allKeywords = await ApiEndpoints.keywords.getAll();
    displayKeywordCards(allKeywords);
  } catch (error) {
    console.error("전체 키워드 목록 불러오기 실패:", error);
    showAlert("키워드 목록을 불러오는데 실패했습니다.", "error");
    document.getElementById("keywordCardsContainer").innerHTML =
      '<div class="alert alert-error">키워드 목록을 불러오는 중 오류가 발생했습니다.</div>';
  }
}

/**
 * 키워드 카드 표시
 */
function displayKeywordCards(keywordsData) {
  const container = document.getElementById("keywordCardsContainer");

  if (!keywordsData || keywordsData.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info">등록된 Keyword가 없습니다.</div>';
    return;
  }

  const cardsHtml = keywordsData
    .map((keyword) => {
      const keywordsText = keyword.keywords ? keyword.keywords.join(", ") : "-";
      const topicTitle =
        keyword.topic && keyword.topic.topicTitle
          ? keyword.topic.topicTitle
          : "Topic 정보 없음";

      return `
      <div class="keyword-card" data-keyword-id="${keyword.id}">
        <div class="keyword-card-header">
          <h3 class="keyword-card-title">
            <span class="keyword-number">#${keyword.keywordNumber}</span>
            ${topicTitle}
          </h3>
          <div class="keyword-card-actions">
            <button class="btn btn-sm btn-warning" onclick="editKeyword(${keyword.id})">
              ✏️ 수정
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteKeyword(${keyword.id})">
              🗑️ 삭제
            </button>
          </div>
        </div>
        <div class="keyword-card-body">
          <div class="keyword-tags">
            ${keyword.keywords ? keyword.keywords.map((k) => `<span class="keyword-tag">${k}</span>`).join("") : ""}
          </div>
        </div>
        <div class="keyword-card-footer">
          <small class="text-muted">ID: ${keyword.id}</small>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = `
    <div class="keyword-cards-grid">
      ${cardsHtml}
    </div>
  `;
}

/**
 * 키워드 목록 초기화
 */
function clearKeywordList() {
  allKeywords = [];
  document.getElementById("keywordCardsContainer").innerHTML =
    '<div class="alert alert-info">Keyword 목록을 불러오거나 새 Keyword를 생성해보세요.</div>';
}

/**
 * 결과 초기화
 */
function clearResults() {
  keywords = [];
  document.getElementById("keywordsList").innerHTML =
    '<div class="alert alert-info">키워드를 검색해보세요.</div>';
  document.getElementById("searchKeyword").value = "";
}

/**
 * 수정 모달 닫기
 */
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editKeywordForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

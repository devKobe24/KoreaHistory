/**
 * Keyword 관리 페이지 JavaScript
 */

let keywords = [];

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
});

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
    keywords = await ApiEndpoints.keywords.search(formData.keyword);
    displayKeywords(keywords);
  } catch (error) {
    console.error("Keyword 검색 실패:", error);
    showAlert("Keyword 검색에 실패했습니다.", "error");
    document.getElementById("keywordsList").innerHTML =
      '<div class="alert alert-error">검색 중 오류가 발생했습니다.</div>';
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
    handleSearchKeyword({ preventDefault: () => {} });
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
  const keyword = keywords.find((k) => k.id === keywordId);
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

    // 번호 수정
    if (
      formData.keywordNumber !==
      keywords.find((k) => k.id === keywordId).keywordNumber.toString()
    ) {
      await ApiEndpoints.keywords.updateNumber(keywordId, {
        keywordNumber: parseInt(formData.keywordNumber),
      });
    }

    // 키워드 내용 수정
    const currentKeywords =
      keywords.find((k) => k.id === keywordId).keywords || [];
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
  } catch (error) {
    console.error("Keyword 수정 실패:", error);
    showAlert("Keyword 수정에 실패했습니다.", "error");
  }
}

/**
 * Keyword 삭제
 */
function deleteKeyword(keywordId) {
  const keyword = keywords.find((k) => k.id === keywordId);
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
      } catch (error) {
        console.error("Keyword 삭제 실패:", error);
        showAlert("Keyword 삭제에 실패했습니다.", "error");
      }
      closeModal();
    }
  );
}

/**
 * 결과 초기화
 */
function clearResults() {
  keywords = [];
  document.getElementById("keywordsList").innerHTML =
    '<div class="alert alert-info">키워드를 검색하거나 생성해보세요.</div>';
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

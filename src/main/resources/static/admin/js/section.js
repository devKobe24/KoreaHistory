/**
 * Section 관리 페이지 JavaScript
 */

let sections = [];
let lessons = [];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  loadLessons();

  // 폼 이벤트 리스너
  document
    .getElementById("createSectionForm")
    .addEventListener("submit", handleCreateSection);
  document
    .getElementById("searchSectionForm")
    .addEventListener("submit", handleSearchSection);
  document
    .getElementById("editSectionForm")
    .addEventListener("submit", handleEditSection);
});

/**
 * Lesson 목록 로드 (드롭다운용)
 */
async function loadLessons() {
  try {
    // 모든 Chapter를 가져와서 Lesson들을 수집
    const chapters = await ApiEndpoints.chapters.getAll();
    const allLessons = [];

    chapters.forEach((chapter) => {
      if (chapter.lessons && chapter.lessons.length > 0) {
        chapter.lessons.forEach((lesson) => {
          allLessons.push({
            ...lesson,
            chapterTitle: chapter.chapterTitle,
            chapterNumber: chapter.chapterNumber,
          });
        });
      }
    });

    lessons = allLessons;
    populateLessonSelect();
  } catch (error) {
    console.error("Lesson 목록 로드 실패:", error);
    showAlert("Lesson 목록을 불러오는데 실패했습니다.", "error");
  }
}

/**
 * Lesson 드롭다운 채우기
 */
function populateLessonSelect() {
  const select = document.getElementById("lessonSelect");
  select.innerHTML = '<option value="">Lesson을 선택하세요</option>';

  lessons.forEach((lesson) => {
    const option = document.createElement("option");
    option.value = lesson.id;
    option.textContent = `${lesson.chapterNumber}.${lesson.lessonNumber} ${lesson.lessonTitle}`;
    select.appendChild(option);
  });
}

/**
 * Section 목록 로드
 */
async function loadSections() {
  const container = document.getElementById("sectionsList");

  try {
    showLoading(container);

    // 새로 추가된 API 엔드포인트 사용
    const response = await fetch("/api/v1/sections/search/all");
    if (!response.ok) {
      throw new Error("Section 목록을 불러오는데 실패했습니다.");
    }

    const sections = await response.json();

    if (sections && sections.length > 0) {
      displaySectionsList(sections);
    } else {
      container.innerHTML =
        '<div class="alert alert-info">등록된 Section이 없습니다.</div>';
    }
  } catch (error) {
    console.error("Section 목록 로드 실패:", error);
    container.innerHTML =
      '<div class="alert alert-danger">Section 목록을 불러오는데 실패했습니다.</div>';
  }
}

/**
 * Section 목록 표시
 */
function displaySectionsList(sections) {
  const container = document.getElementById("sectionsList");

  let html = '<div class="sections-grid">';

  sections.forEach((section) => {
    html += `
      <div class="section-card">
        <div class="section-header">
          <h4>${section.sectionNumber}. ${section.sectionTitle}</h4>
          <div class="section-actions">
            <button class="btn btn-warning btn-small" onclick="editSection(${section.id})">수정</button>
            <button class="btn btn-danger btn-small" onclick="deleteSection(${section.id})">삭제</button>
          </div>
        </div>
        <div class="section-info">
          <p><strong>Lesson:</strong> ${section.lesson ? section.lesson.lessonTitle : "N/A"}</p>
          <p><strong>Chapter:</strong> ${section.lesson && section.lesson.chapter ? section.lesson.chapter.chapterTitle : "N/A"}</p>
        </div>
      </div>
    `;
  });

  html += "</div>";
  container.innerHTML = html;
}

/**
 * Section 생성 처리
 */
async function handleCreateSection(event) {
  event.preventDefault();

  if (
    !validateForm("createSectionForm", [
      "lessonId",
      "sectionNumber",
      "sectionTitle",
    ])
  ) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("createSectionForm");
    const sectionData = {
      sectionNumber: parseInt(formData.sectionNumber),
      sectionTitle: formData.sectionTitle,
    };

    await ApiEndpoints.sections.create(
      parseInt(formData.lessonId),
      sectionData
    );
    showAlert("Section이 성공적으로 생성되었습니다.", "success");

    // 폼 초기화
    document.getElementById("createSectionForm").reset();

    // Lesson 목록과 Section 목록 새로고침
    loadLessons();
    loadSections();
  } catch (error) {
    console.error("Section 생성 실패:", error);
    showAlert("Section 생성에 실패했습니다.", "error");
  }
}

/**
 * Section 상세 조회 처리
 */
async function handleSearchSection(event) {
  event.preventDefault();

  if (!validateForm("searchSectionForm", ["sectionId"])) {
    showAlert("Section ID를 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("searchSectionForm");
    const sectionId = parseInt(formData.sectionId);

    showLoading(document.getElementById("sectionDetail"));
    const sectionDetail = await ApiEndpoints.sections.getById(sectionId);
    displaySectionDetail(sectionDetail);

    // 상세 정보 카드 표시
    document.getElementById("sectionDetailCard").style.display = "block";
  } catch (error) {
    console.error("Section 조회 실패:", error);
    showAlert("Section 조회에 실패했습니다.", "error");
    document.getElementById("sectionDetailCard").style.display = "none";
  }
}

/**
 * Section 상세 정보 표시
 */
function displaySectionDetail(sectionDetail) {
  const container = document.getElementById("sectionDetail");

  if (!sectionDetail) {
    container.innerHTML =
      '<div class="alert alert-info">Section 정보를 찾을 수 없습니다.</div>';
    return;
  }

  let html = `
        <div class="hierarchy">
            <div class="hierarchy-item">
                <span class="hierarchy-level">Section</span>
                <strong>${sectionDetail.sectionNumber}. ${sectionDetail.sectionTitle}</strong>
                <div style="margin-left: 100px;">
                    <button class="btn btn-warning btn-small" onclick="editSection(${sectionDetail.id})">수정</button>
                    <button class="btn btn-danger btn-small" onclick="deleteSection(${sectionDetail.id})">삭제</button>
                </div>
            </div>
    `;

  // Subsections 표시
  if (sectionDetail.subsections && sectionDetail.subsections.length > 0) {
    sectionDetail.subsections.forEach((subsection) => {
      html += `
                <div class="hierarchy-item" style="margin-left: 20px;">
                    <span class="hierarchy-level">Subsection</span>
                    <strong>${subsection.subsectionNumber}. ${subsection.subsectionTitle}</strong>
                </div>
            `;

      // Topics 표시
      if (subsection.topics && subsection.topics.length > 0) {
        subsection.topics.forEach((topic) => {
          html += `
                        <div class="hierarchy-item" style="margin-left: 40px;">
                            <span class="hierarchy-level">Topic</span>
                            <strong>${topic.topicNumber}. ${topic.topicTitle}</strong>
                        </div>
                    `;

          // Keywords 표시
          if (topic.keywords && topic.keywords.length > 0) {
            topic.keywords.forEach((keyword) => {
              html += `
                                <div class="hierarchy-item" style="margin-left: 60px;">
                                    <span class="hierarchy-level">Keyword</span>
                                    <strong>${keyword.keywordNumber}. ${keyword.keywords ? keyword.keywords.join(", ") : ""}</strong>
                                </div>
                            `;

              // Contents 표시
              if (keyword.contents && keyword.contents.length > 0) {
                keyword.contents.forEach((content) => {
                  html += `
                                        <div class="hierarchy-item" style="margin-left: 80px;">
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
    });
  }

  html += "</div>";
  container.innerHTML = html;
}

/**
 * Section 수정 모달 열기
 */
function editSection(sectionId) {
  // 현재 상세 정보에서 Section 데이터 추출
  const sectionDetail = document.querySelector(".hierarchy-item strong");
  if (!sectionDetail) {
    showAlert("Section 정보를 찾을 수 없습니다.", "error");
    return;
  }

  // 모달 폼에 데이터 설정 (실제 데이터는 서버에서 가져와야 함)
  document.getElementById("editSectionId").value = sectionId;

  // 상세 정보에서 현재 값 추출 (임시)
  const titleText = sectionDetail.textContent;
  const parts = titleText.split(". ");
  if (parts.length >= 2) {
    document.getElementById("editSectionNumber").value = parts[0];
    document.getElementById("editSectionTitle").value = parts[1];
  }

  // 모달 표시
  document.getElementById("editModal").style.display = "block";
}

/**
 * Section 수정 처리
 */
async function handleEditSection(event) {
  event.preventDefault();

  if (!validateForm("editSectionForm", ["sectionNumber", "sectionTitle"])) {
    showAlert("모든 필드를 올바르게 입력해주세요.", "error");
    return;
  }

  try {
    const formData = getFormData("editSectionForm");
    const sectionId = parseInt(formData.id);

    // 번호 수정
    await ApiEndpoints.sections.updateNumber(sectionId, {
      sectionNumber: parseInt(formData.sectionNumber),
    });

    // 제목 수정
    await ApiEndpoints.sections.updateTitle(sectionId, {
      sectionTitle: formData.sectionTitle,
    });

    showAlert("Section이 성공적으로 수정되었습니다.", "success");
    closeEditModal();

    // Section 목록 새로고침
    loadSections();

    // 현재 Section 다시 조회
    document.getElementById("sectionId").value = sectionId;
    document
      .getElementById("searchSectionForm")
      .dispatchEvent(new Event("submit"));
  } catch (error) {
    console.error("Section 수정 실패:", error);
    showAlert("Section 수정에 실패했습니다.", "error");
  }
}

/**
 * Section 삭제
 */
function deleteSection(sectionId) {
  confirmAction(
    `Section을 삭제하시겠습니까?\n\n주의: 하위의 모든 Subsection, Topic, Keyword, Content가 함께 삭제됩니다.`,
    async () => {
      try {
        await ApiEndpoints.sections.delete(sectionId);
        showAlert("Section이 성공적으로 삭제되었습니다.", "success");

        // 상세 정보 숨기기
        document.getElementById("sectionDetailCard").style.display = "none";

        // Section 목록 새로고침
        loadSections();
      } catch (error) {
        console.error("Section 삭제 실패:", error);
        showAlert("Section 삭제에 실패했습니다.", "error");
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
  document.getElementById("editSectionForm").reset();
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeEditModal();
  }
};

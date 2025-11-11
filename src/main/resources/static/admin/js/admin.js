/**
 * 한국사 아띠 관리자 페이지 공통 JavaScript
 */

// API 베이스 URL
const API_BASE_URL = "http://localhost:8080/api/v1";

// 전역 변수
let currentData = [];
let isLoading = false;

/**
 * HTTP 요청 헬퍼 함수
 */
class ApiClient {
  static async request(url, options = {}) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // DELETE 요청의 경우 빈 응답일 수 있음
      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API 요청 실패:", error);
      showAlert(`API 요청 실패: ${error.message}`, "error");
      throw error;
    }
  }

  static async get(url) {
    return this.request(url, { method: "GET" });
  }

  static async post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async patch(url, data) {
    return this.request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async delete(url) {
    return this.request(url, { method: "DELETE" });
  }
}

/**
 * 알림 메시지 표시
 */
function showAlert(message, type = "info", duration = 5000) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} fade-in`;
  alertDiv.innerHTML = `
        <strong>${type === "error" ? "오류" : type === "success" ? "성공" : "알림"}:</strong> ${message}
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
    `;

  // 기존 알림 제거
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  // 새 알림 추가
  document.body.insertBefore(alertDiv, document.body.firstChild);

  // 자동 제거
  if (duration > 0) {
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, duration);
  }
}

/**
 * 로딩 스피너 표시/숨김
 */
function showLoading(container = null) {
  if (isLoading) return;

  isLoading = true;
  const spinner = document.createElement("div");
  spinner.className = "loading";
  spinner.innerHTML = '<div class="spinner"></div>';
  spinner.id = "loading-spinner";

  if (container) {
    container.innerHTML = "";
    container.appendChild(spinner);
  } else {
    document.body.appendChild(spinner);
  }
}

function hideLoading() {
  isLoading = false;
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.remove();
  }
}

/**
 * 폼 데이터 수집
 */
function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};

  const formData = new FormData(form);
  const data = {};

  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

/**
 * 폼 유효성 검사
 */
function validateForm(formId, requiredFields = []) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  const formData = getFormData(formId);

  // 필수 필드 검사
  requiredFields.forEach((field) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!formData[field] || formData[field].trim() === "") {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
      input.classList.add("success");
    }
  });

  return isValid;
}

/**
 * 테이블 생성 헬퍼
 */
function createTable(data, columns, actions = null) {
  if (!data || data.length === 0) {
    return '<div class="alert alert-info">데이터가 없습니다.</div>';
  }

  let tableHtml = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
    `;

  // 헤더 생성
  columns.forEach((col) => {
    tableHtml += `<th>${col.label}</th>`;
  });

  if (actions) {
    tableHtml += "<th>작업</th>";
  }

  tableHtml += "</tr></thead><tbody>";

  // 데이터 행 생성
  data.forEach((item) => {
    tableHtml += "<tr>";
    columns.forEach((col) => {
      const value = col.accessor ? col.accessor(item) : item[col.key];
      tableHtml += `<td>${value || "-"}</td>`;
    });

    if (actions) {
      tableHtml += "<td>";
      actions.forEach((action) => {
        const onClick = action.onClick
          ? action.onClick.replace("{id}", item.id)
          : "";
        tableHtml += `<button class="btn btn-${action.type} btn-small" onclick="${onClick}">${action.label}</button> `;
      });
      tableHtml += "</td>";
    }

    tableHtml += "</tr>";
  });

  tableHtml += "</tbody></table></div>";
  return tableHtml;
}

/**
 * 모달 표시
 */
function showModal(title, content, onConfirm = null) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "confirmModal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer" style="margin-top: 1rem; text-align: right;">
                <button class="btn btn-secondary" onclick="closeModal()">취소</button>
                ${onConfirm ? `<button class="btn btn-danger" onclick="${onConfirm}">확인</button>` : ""}
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  modal.style.display = "block";

  // 모달 외부 클릭 시 닫기
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

/**
 * 모달 닫기
 */
function closeModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) {
    modal.remove();
  }
}

/**
 * 확인 다이얼로그
 */
function confirmAction(message, onConfirm) {
  showModal("확인", `<p>${message}</p>`, `confirmActionCallback()`);

  // 전역 콜백 설정
  window.confirmActionCallback = onConfirm;
}

/**
 * 페이지 로드 시 실행
 */
document.addEventListener("DOMContentLoaded", function () {
  // 네비게이션 활성 상태 설정
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-item a");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (
      link.getAttribute("href") === currentPage ||
      (currentPage === "" && link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // 폼 제출 이벤트 리스너
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // 각 페이지에서 개별적으로 처리
    });
  });
});

/**
 * API 엔드포인트별 함수들
 */
const ApiEndpoints = {
  // Chapter 관련
  chapters: {
    getAll: () => ApiClient.get(`${API_BASE_URL}/chapters/search/all`),
    create: (data) => ApiClient.post(`${API_BASE_URL}/create/chapter`, [data]),
    updateTitle: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/chapters/${id}/title`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/chapters/${id}/number`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/chapters/${id}`),
  },

  // Lesson 관련
  lessons: {
    create: (chapterId, data) =>
      ApiClient.post(`${API_BASE_URL}/chapters/${chapterId}/details`, data),
    updateTitle: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/chapter/lesson/${id}/title`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/chapter/lesson/${id}/number`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/lesson/${id}`),
  },

  // Section 관련
  sections: {
    create: (lessonId, data) =>
      ApiClient.post(`${API_BASE_URL}/create/section/${lessonId}`, data),
    updateTitle: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/section/${id}/title`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/section/${id}/number`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/section/${id}`),
    getById: (id) => ApiClient.get(`${API_BASE_URL}/search/section/${id}`),
  },

  // Subsection 관련
  subsections: {
    create: (sectionId, data) =>
      ApiClient.post(`${API_BASE_URL}/create/subsection/${sectionId}`, data),
    getById: (id) => ApiClient.get(`${API_BASE_URL}/search/subsection/${id}`),
    updateTitle: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/subsection/${id}/title`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/subsection/${id}/number`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/subsection/${id}`),
  },

  // Topic 관련
  topics: {
    getAll: () => ApiClient.get(`${API_BASE_URL}/topics/search/all`),
    create: (subsectionId, data) =>
      ApiClient.post(`${API_BASE_URL}/create/topic/${subsectionId}`, data),
    getById: (id) => ApiClient.get(`${API_BASE_URL}/search/topic/${id}`),
    updateTitle: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/topic/${id}/title`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/topic/${id}/number`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/topic/${id}`),
  },

  // Content 관련
  contents: {
    create: (keywordId, data) =>
      ApiClient.post(`${API_BASE_URL}/create/content/${keywordId}`, data),
    getById: (id) => ApiClient.get(`${API_BASE_URL}/search/content/${id}`),
    update: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/content/${id}`, data),
    delete: (id) => ApiClient.delete(`${API_BASE_URL}/content/${id}`),
  },

  // Keyword 관련
  keywords: {
    getAll: () => ApiClient.get(`${API_BASE_URL}/keywords/search/all`),
    search: (keyword) =>
      ApiClient.get(
        `${API_BASE_URL}/search/keywords?keyword=${encodeURIComponent(keyword)}`
      ),
    searchCombination: (keywords) => {
      const params = keywords
        .map((k) => `keywords=${encodeURIComponent(k)}`)
        .join("&");
      return ApiClient.get(
        `${API_BASE_URL}/search/keywords/combination?${params}`
      );
    },
    create: (topicTitle, data) =>
      ApiClient.post(
        `${API_BASE_URL}/create/keyword?topicTitle=${encodeURIComponent(topicTitle)}`,
        data
      ),
    createById: (topicId, data) =>
      ApiClient.post(
        `${API_BASE_URL}/create/keyword/${topicId}`,
        data
      ),
    update: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/keywords/${id}/update`, data),
    updateNumber: (id, data) =>
      ApiClient.patch(`${API_BASE_URL}/keyword/number/${id}/update`, data),
    delete: (id, data) =>
      ApiClient.delete(`${API_BASE_URL}/delete/keyword/${id}`, data),
    deleteGroup: (id) =>
      ApiClient.delete(`${API_BASE_URL}/keyword/group/${id}`),
  },
};

// 전역에서 사용할 수 있도록 window 객체에 추가
window.ApiClient = ApiClient;
window.ApiEndpoints = ApiEndpoints;
window.showAlert = showAlert;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.getFormData = getFormData;
window.validateForm = validateForm;
window.createTable = createTable;
window.showModal = showModal;
window.closeModal = closeModal;
window.confirmAction = confirmAction;

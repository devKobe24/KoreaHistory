/**
 * 한국사 아띠 관리자 인증 시스템
 */

// 인증 관련 상수
const AUTH_STORAGE_KEY = "koreahistory_admin_auth";

/**
 * 로그인 처리 (서버 API 호출)
 */
async function login(adminId, password) {
  console.log("login 함수 호출됨 - adminId:", adminId, "password:", password);
  
  try {
    console.log("API 요청 시작 - URL: http://localhost:8080/api/v1/auth/login");
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminId: adminId, password }),
    });

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 OK:", response.ok);

    if (response.ok) {
      const authData = {
        adminId: adminId,
        loginTime: new Date().getTime(),
        expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000, // 24시간 후 만료
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      console.log("로그인 성공 - localStorage 저장됨");
      return { success: true };
    } else {
      const errorData = await response.text();
      console.error("로그인 실패:", response.status, errorData);
      try {
        const errorJson = JSON.parse(errorData);
        return { success: false, message: errorJson.error || "로그인에 실패했습니다." };
      } catch (e) {
        return { success: false, message: "로그인에 실패했습니다." };
      }
    }
  } catch (error) {
    console.error("로그인 요청 오류:", error);
    return { success: false, message: "서버 연결에 실패했습니다." };
  }
}

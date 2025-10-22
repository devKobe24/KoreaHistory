/**
 * KoreaHistory 관리자 인증 시스템
 */

// 인증 관련 상수
const AUTH_STORAGE_KEY = 'koreahistory_admin_auth';
const LOGIN_PAGE = 'login.html';

/**
 * 현재 로그인 상태 확인
 */
function isAuthenticated() {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) {
        return false;
    }
    
    try {
        const auth = JSON.parse(authData);
        // 세션 만료 시간 확인 (24시간)
        const now = new Date().getTime();
        if (now > auth.expiresAt) {
            logout();
            return false;
        }
        return true;
    } catch (error) {
        console.error('인증 데이터 파싱 오류:', error);
        logout();
        return false;
    }
}

/**
 * 로그인 처리
 */
function login(username, password) {
    // 간단한 인증 로직 (실제 환경에서는 서버 인증 필요)
    if (username === 'admin' && password === 'admin123') {
        const authData = {
            username: username,
            loginTime: new Date().getTime(),
            expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24시간 후 만료
        };
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        return true;
    }
    return false;
}

/**
 * 로그아웃 처리
 */
function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * 인증된 사용자 정보 가져오기
 */
function getAuthenticatedUser() {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) {
        return null;
    }
    
    try {
        return JSON.parse(authData);
    } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        return null;
    }
}

/**
 * 인증 확인 및 리다이렉트
 */
function checkAuthAndRedirect() {
    if (!isAuthenticated()) {
        // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== LOGIN_PAGE) {
            window.location.href = LOGIN_PAGE;
            return false;
        }
    }
    return true;
}

/**
 * 로그인 페이지에서 성공 시 리다이렉트
 */
function redirectAfterLogin() {
    // 이전 페이지가 있으면 그곳으로, 없으면 대시보드로
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect') || 'dashboard.html';
    window.location.href = redirectTo;
}

/**
 * 로그아웃 버튼 클릭 처리
 */
function handleLogout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        logout();
        window.location.href = LOGIN_PAGE;
    }
}

/**
 * 인증 상태 표시 (네비게이션에 로그아웃 버튼 추가)
 */
function showAuthStatus() {
    const user = getAuthenticatedUser();
    if (user) {
        // 네비게이션에 로그아웃 버튼 추가
        const nav = document.querySelector('.nav-list');
        if (nav && !document.querySelector('.logout-btn')) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav-item';
            logoutItem.innerHTML = `
                <a href="#" class="logout-btn" onclick="handleLogout()">
                    🚪 로그아웃 (${user.username})
                </a>
            `;
            nav.appendChild(logoutItem);
        }
    }
}

// 페이지 로드 시 인증 확인
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndRedirect();
    showAuthStatus();
});

// 전역 함수로 내보내기
window.isAuthenticated = isAuthenticated;
window.login = login;
window.logout = logout;
window.getAuthenticatedUser = getAuthenticatedUser;
window.checkAuthAndRedirect = checkAuthAndRedirect;
window.redirectAfterLogin = redirectAfterLogin;
window.handleLogout = handleLogout;
window.showAuthStatus = showAuthStatus;

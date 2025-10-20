package com.kobe.koreahistory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : AdminController
 * author         : kobe
 * date           : 2025. 10. 20.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 20.        kobe       최초 생성
 */
@Controller
@RequestMapping("/admin")
public class AdminController {
	/**
	 * '/admin' 경로로 GET 요청이 오면 '/admin/index.html' 정적 리소스로 포워딩합니다.
	 * 사용자의 브라우저 URL은 '/admin'으로 유지됩니다.
	 */
	@GetMapping("")
	public String adminHome() {
		return "redirect:/admin/";
	}

	@GetMapping("/") // '/admin' 경로 매핑
	public String indexPage() {
		// /admin/index.html로 포워딩
		return "forward:/admin/index.html";
	}

	@GetMapping("/chapter") // '/admin/chapter' 경로 매핑
	public String chapterPage() {
		return "forward:/admin/pages/chapter.html";
	}

	@GetMapping("/lesson") // '/admin/lesson'
	public String lessonPage() {
		return "forward:/admin/pages/lesson.html";
	}

	@GetMapping("/section") // 'admin/section'
	public String sectionPage() {
		return "forward:/admin/pages/section.html";
	}

	@GetMapping("/subsection") // 'admin/subsection'
	public String subsectionPage() {
		return "forward:/admin/pages/subsection.html";
	}

	@GetMapping("/topic") // 'admin/topic'
	public String topicPage() {
		return "forward:/admin/pages/topic.html";
	}

	@GetMapping("/keyword") // 'admin/keyword'
	public String keywordPage() {
		return "forward:/admin/pages/keyword.html";
	}

	@GetMapping("/content") // 'admin/content'
	public String contentPage() {
		return "forward:/admin/pages/content.html";
	}

	@GetMapping("/dashboard") // 'admin/dashboard'
	public String dashboardPage() {
		return "forward:/admin/pages/dashboard.html";
	}
}

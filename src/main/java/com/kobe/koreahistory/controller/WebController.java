package com.kobe.koreahistory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : WebController
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Controller
@RequestMapping("/web")
public class WebController {
	@GetMapping("")
	public String webHome() {
		return "redirect:/web/";
	}

	@GetMapping("/")
	public String indexPage() {
		return "forward:/index.html";
	}

	@GetMapping("/chapter")
	public String chapterPage() {
		return "forward:/pages/chapter.html";
	}

	@GetMapping("/lesson")
	public String lessonPage() {
		return "forward:/pages/lesson.html";
	}
}

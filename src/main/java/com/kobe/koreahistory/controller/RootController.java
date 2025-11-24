package com.kobe.koreahistory.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : RootController
 * author         : kobe
 * date           : 2025. 11. 20.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 20.        kobe       최초 생성
 */
@Controller
public class RootController {

    @Value("${app.root-path:/web/}")
    private String rootPath;

    @GetMapping("/")
    public String root() {
        // 루트 → /web/ 로 리디렉션
        return "redirect:" + rootPath;
    }
}

package com.kobe.koreahistory.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : HealthController
 * author         : kobe
 * date           : 2025. 11. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 23.        kobe       최초 생성
 */
@Profile("web")
@RestController
public class HealthController {
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}

package com.kobe.koreahistory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : HealthDbController
 * author         : kobe
 * date           : 2025. 11. 24.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 24.        kobe       최초 생성
 */
@Profile("admin")
@RestController
@RequiredArgsConstructor
public class HealthDbController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/health/db")
    public ResponseEntity<String> healthDb() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok("DB OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("DB ERROR: " + e.getMessage());
        }
    }
}

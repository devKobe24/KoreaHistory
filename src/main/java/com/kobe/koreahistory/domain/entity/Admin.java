package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : Admin
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false, unique = true)
    private String adminId;

    @Column(nullable = false)
    private String password;

    @Builder
    public Admin(String adminId, String password) {
        this.adminId = adminId;
        this.password = password;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

}



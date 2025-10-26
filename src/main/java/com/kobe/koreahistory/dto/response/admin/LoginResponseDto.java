package com.kobe.koreahistory.dto.response.admin;

import com.kobe.koreahistory.domain.entity.Admin;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.admin
 * fileName       : LoginResponseDto
 * author         : kobe
 * date           : 2025. 10. 26.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 26.        kobe       최초 생성
 */
@Getter
public class LoginResponseDto {
    private final Long id;
    private final String adminId;
    private final String password;

    public LoginResponseDto(Admin entity) {
        this.id = entity.getId();
        this.adminId = entity.getAdminId();
        this.password = entity.getPassword();
    }
}

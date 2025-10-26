package com.kobe.koreahistory.dto.request.admin;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.admin
 * fileName       : LoginRequestDto
 * author         : kobe
 * date           : 2025. 10. 26.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 26.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class LoginRequestDto {
    private String adminId;
    private String password;
}
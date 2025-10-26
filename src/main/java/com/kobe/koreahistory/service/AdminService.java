package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Admin;
import com.kobe.koreahistory.dto.request.admin.LoginRequestDto;
import com.kobe.koreahistory.dto.response.admin.LoginResponseDto;
import com.kobe.koreahistory.repository.AdminRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : AdminService
 * author         : kobe
 * date           : 2025. 10. 26.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 26.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    /**
     * 로그인 처리
     */
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto requestDto) {
        System.out.println("로그인 시도 - AdminId: " + requestDto.getAdminId() + ", Password: " + requestDto.getPassword());
        
        Admin admin = adminRepository.findByAdminId(requestDto.getAdminId())
                .orElseThrow(() -> {
                    System.out.println("관리자를 찾을 수 없음: " + requestDto.getAdminId());
                    return new IllegalArgumentException("관리자 ID 또는 PASSWORD가 일치하지 않습니다.");
                });

        System.out.println("DB에서 찾은 관리자 - AdminId: " + admin.getAdminId() + ", Password: " + admin.getPassword());
        
        if (!admin.getPassword().equals(requestDto.getPassword())) {
            System.out.println("비밀번호 불일치 - 입력: " + requestDto.getPassword() + ", DB: " + admin.getPassword());
            throw new IllegalArgumentException("관리자 ID 또는 PASSWORD가 일치하지 않습니다.");
        }

        System.out.println("로그인 성공");
        return new LoginResponseDto(admin);
    }

    /**
     * 모든 관리자 조회
     */
    @Transactional(readOnly = true)
    public List<Admin> findAllAdmins() {
        return adminRepository.findAll();
    }

    /**
     * 관리자 생성
     */
    @Transactional
    public Admin createAdmin(String adminId, String password) {
        // 중복 체크
        if (adminRepository.findByAdminId(adminId).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 관리자 ID 입니다.");
        }

        Admin admin = Admin.builder()
                .adminId(adminId)
                .password(password)
                .build();

        return adminRepository.save(admin);
    }

    /**
     * 관리자 비밀번호 변경
     */
    @Transactional
    public Admin updateAdminPassword(Long id, String newPassword) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다."));

        admin.updatePassword(newPassword);
        return adminRepository.save(admin);
    }

    /**
     * 관리자 삭제
     */
    @Transactional
    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다."));

        adminRepository.delete(admin);
    }
}
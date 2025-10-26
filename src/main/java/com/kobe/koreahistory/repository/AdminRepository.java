package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : AdminRepository
 * author         : kobe
 * date           : 2025. 10. 26.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 26.        kobe       최초 생성
 */
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByAdminId(String adminId);
}

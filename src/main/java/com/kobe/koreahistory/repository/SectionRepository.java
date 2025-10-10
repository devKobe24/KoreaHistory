package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : SectionRepository
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
public interface SectionRepository extends JpaRepository<Section, Long> {
}

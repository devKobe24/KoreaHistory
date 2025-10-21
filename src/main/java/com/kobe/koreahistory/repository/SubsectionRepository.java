package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : SubsectionRepository
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
public interface SubsectionRepository extends JpaRepository<Subsection, Long> {
    
    @Query("SELECT s FROM Subsection s LEFT JOIN FETCH s.section sec LEFT JOIN FETCH sec.lesson l LEFT JOIN FETCH l.chapter c")
    List<Subsection> findAllWithSectionAndLesson();
}

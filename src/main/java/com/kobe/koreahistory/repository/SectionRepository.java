package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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
    
    @Query("SELECT s FROM Section s LEFT JOIN FETCH s.lesson l LEFT JOIN FETCH l.chapter c")
    List<Section> findAllWithLessonAndChapter();

    List<Section> findBySectionTitleContainingIgnoreCase(String title);

    Optional<Section> findFirstBySectionTitleIgnoreCase(String title);
}

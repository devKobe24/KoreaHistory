package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

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
}

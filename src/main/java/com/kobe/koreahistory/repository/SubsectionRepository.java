package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

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

    List<Subsection> findBySubsectionTitleContainingIgnoreCase(String title);

    /**
     * Subsection과 Keywords의 관계를 조회하는 Native Query
     * @return List<Object[]> where Object[0] = subsection_title, Object[1] = keyword_id, Object[2] = keyword_number, Object[3] = keyword_title, Object[4] = keywords_value
     */
    @Query(value = "SELECT s.subsection_title, k1.id, k1.keyword_number, k1.keyword_title, k2.keywords_value " +
            "FROM subsection s " +
            "JOIN topic t ON s.id = t.subsection_id " +
            "JOIN keyword k1 ON t.id = k1.topic_id " +
            "JOIN keywords k2 ON k1.id = k2.keywords_id", 
            nativeQuery = true)
    List<Object[]> findSubsectionKeywordRelations();

	Optional<Subsection> findFirstBySubsectionTitleIgnoreCase(String title);
}

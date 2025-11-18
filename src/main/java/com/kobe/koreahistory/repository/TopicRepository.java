package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : TopicRepository
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
public interface TopicRepository extends JpaRepository<Topic, Long> {
	Optional<Topic> findByTopicTitle(String topicTitle);
	
	@Query("SELECT t FROM Topic t LEFT JOIN FETCH t.subsection s LEFT JOIN FETCH s.section sec LEFT JOIN FETCH sec.lesson l LEFT JOIN FETCH l.chapter c")
	List<Topic> findAllWithSubsectionAndSection();
	
	List<Topic> findByTopicTitleContainingIgnoreCase(String title);

	Optional<Topic> findFirstByTopicTitleIgnoreCase(String title);
}

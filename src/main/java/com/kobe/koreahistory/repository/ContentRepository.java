package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : ContentRepository
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
public interface ContentRepository extends JpaRepository<Content, Long> {
	
	@Query("SELECT c FROM Content c LEFT JOIN FETCH c.keyword k LEFT JOIN FETCH k.topic t LEFT JOIN FETCH t.subsection s LEFT JOIN FETCH s.section sec LEFT JOIN FETCH sec.lesson l LEFT JOIN FETCH l.chapter ch")
	List<Content> findAllWithKeywordAndTopic();

	@Query(value = "SELECT DISTINCT c.* FROM content c " +
			"LEFT JOIN keyword k ON c.keyword_id = k.id " +
			"LEFT JOIN topic t ON k.topic_id = t.id " +
			"LEFT JOIN subsection s ON t.subsection_id = s.id " +
			"LEFT JOIN section sec ON s.section_id = sec.id " +
			"LEFT JOIN lesson l ON sec.lesson_id = l.id " +
			"LEFT JOIN chapter ch ON l.chapter_id = ch.id " +
			"WHERE EXISTS (SELECT 1 FROM details d WHERE d.detail_id = c.id AND LOWER(d.detail_value) LIKE LOWER(CONCAT('%', :detail, '%'))) OR " +
			"LOWER(c.content_title) LIKE LOWER(CONCAT('%', :detail, '%')) OR " +
			"(c.block_data IS NOT NULL AND LOWER(c.block_data) LIKE LOWER(CONCAT('%', :detail, '%')))", 
			nativeQuery = true)
	List<Content> findByDetailsContainingIgnoreCase(@Param("detail") String detail);

	@Query("SELECT c FROM Content c LEFT JOIN FETCH c.keyword k LEFT JOIN FETCH k.topic t WHERE t.id = :topicId ORDER BY c.contentNumber")
	List<Content> findByTopicId(@Param("topicId") Long topicId);

	@Query("SELECT c FROM Content c LEFT JOIN FETCH c.keyword k LEFT JOIN FETCH k.topic t LEFT JOIN FETCH t.subsection s WHERE s.id = :subsectionId ORDER BY t.topicNumber, c.contentNumber")
	List<Content> findBySubsectionId(@Param("subsectionId") Long subsectionId);

	Optional<Content> findFirstByContentTitleIgnoreCase(String title);
}

package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

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
}

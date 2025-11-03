package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : ChapterRepository
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
	Optional<Chapter> findByChapterTitle(String chapterTitle);
	Optional<Chapter> findByChapterNumber(Integer chapterNumber);
	Optional<Chapter> findById(Long chapterId);
	Chapter deleteById(Long chapterId);

	@Query("SELECT c FROM Chapter c " +
		"LEFT JOIN FETCH c.lessons l " +
		"LEFT JOIN FETCH l.sections " +
		"WHERE c.chapterTitle = :title")
	Optional<Chapter> findByChapterTitleWithDetails(@Param("title") String title);

	List<Chapter> findByChapterTitleContainingIgnoreCase(String title);
}

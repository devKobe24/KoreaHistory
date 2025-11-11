package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

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

	Optional<Chapter> findFirstByChapterTitleIgnoreCase(String title);

	List<Chapter> findByChapterTitleContainingIgnoreCase(String title);
}

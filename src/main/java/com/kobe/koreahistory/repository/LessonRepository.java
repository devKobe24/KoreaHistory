package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : DetailChapterRepository
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
	Optional<Lesson> findById(Long id);

	/**
	 * number 또는 title로 DetailChapter를 동적으로 검색합니다.
	 *
	 * @param number 검색할 번호 (null 가능)
	 * @param title  검색할 제목 (null 가능)
	 * @return 검색된 DetailChapter
	 */
	@Query("SELECT ls FROM Lesson ls WHERE " +
		"(:number IS NULL OR ls.lessonNumber = :number) AND " +
		"(:title IS NULL OR ls.lessonTitle LIKE %:title%)")
	List<Lesson> searchByNumberOrTitle(
		@Param("number") Integer number,
		@Param("title") String title
	);
}

package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import org.springframework.data.jpa.repository.JpaRepository;

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
public interface DetailChapterRepository extends JpaRepository<DetailChapter, Integer> {
	Optional<DetailChapter> findByTitle(String title);
	Optional<DetailChapter> findById(Long id);
}

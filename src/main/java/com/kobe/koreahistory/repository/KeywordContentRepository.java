package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.KeywordContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : KeywordContentRepository
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
public interface KeywordContentRepository extends JpaRepository<KeywordContent, Long> {
	Optional<KeywordContent> findByKeyword(Keyword keyword);
}

package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : KeywordRepository
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
public interface KeywordRepository extends JpaRepository<Keyword, Long> {
	@Query("SELECT k FROM Keyword k JOIN k.keywords keywordValue WHERE keywordValue LIKE %:keyword%")
	Optional<List<Keyword>> findByKeywordsContaining(@Param("keyword") String keyword);

	@Query("SELECT DISTINCT k FROM Keyword k JOIN k.keywords keywordValue WHERE keywordValue IN :keywords")
	Optional<List<Keyword>> findByKeywordsIn(@Param("keywords") List<String> keywords);

	@Query("SELECT DISTINCT k FROM Keyword k JOIN k.keywords keywordValue WHERE keywordValue LIKE %:keyword%")
	Optional<List<Keyword>> findByKeywordsContainingIgnoreCase(@Param("keyword") String keyword);

	@Query("SELECT k FROM Keyword k LEFT JOIN FETCH k.topic")
	List<Keyword> findAllWithTopic();

	/**
	 * keywords 테이블에서 특정 keyword_id에 속한 모든 keywords_value를 조회
	 * @param keywordId Keyword ID
	 * @return keywords_value 리스트
	 */
	@Query(value = "SELECT keywords_value FROM keywords WHERE keywords_id = :keywordId ORDER BY keywords_value", 
		nativeQuery = true)
	List<String> findKeywordsByKeywordId(@Param("keywordId") Long keywordId);

	Optional<Keyword> findFirstByKeywordTitleIgnoreCase(String title);
}

package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.dto.response.lesson.LessonResponseDto;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : KeywordSearchResponseDto
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Getter
public class KeywordSearchResponseDto {
	private final Long id;
	private final LessonResponseDto detailChapter;
	private final String keyword;
	private final KeywordContentSearchResponseDto keywordContent;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public KeywordSearchResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordContent = new KeywordContentSearchResponseDto(entity.getKeywordContent());
		this.keyword = entity.getKeyword();
		this.detailChapter = new LessonResponseDto(entity.getLesson());
	}
}

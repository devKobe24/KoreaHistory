package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import lombok.Builder;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ChapterCreateResponseDto
 * author         : kobe
 * date           : 2025. 10. 8.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 8.        kobe       최초 생성
 */
@Getter
public class ChapterCreateResponseDto {
	private final Long id;
	private final Integer chapterNumber;
	private final String chapterTitle;

	// Entity를 인자로 받는 단일 public 생성자
	public ChapterCreateResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.chapterNumber = entity.getChapterNumber();
		this.chapterTitle = entity.getChapterTitle();
	}
}

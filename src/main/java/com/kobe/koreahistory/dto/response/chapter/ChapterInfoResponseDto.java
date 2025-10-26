package com.kobe.koreahistory.dto.response.chapter;

import com.kobe.koreahistory.domain.entity.Chapter;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.chapter
 * fileName       : ChapterInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class ChapterInfoResponseDto {
	private final Long id;
	private final Integer chapterNumber;
	private final String chapterTitle;

	public ChapterInfoResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.chapterNumber = entity.getChapterNumber();
		this.chapterTitle = entity.getChapterTitle();
	}
}
package com.kobe.koreahistory.dto.request.chapter;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.chapter
 * fileName       : ChapterInfoRequestDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class ChapterInfoRequestDto {
	private Integer chapterNumber;
	private String chapterTitle;

	@Builder
	public ChapterInfoRequestDto(Integer chapterNumber, String chapterTitle) {
		this.chapterNumber = chapterNumber;
		this.chapterTitle = chapterTitle;
	}
}

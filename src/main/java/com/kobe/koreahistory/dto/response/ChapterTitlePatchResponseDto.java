package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ChapterTitlePatchResponseDto
 * author         : kobe
 * date           : 2025. 10. 8.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 8.        kobe       최초 생성
 */
@Getter
public class ChapterTitlePatchResponseDto {
	private final Long id;
	private final String changedChapterTitle;

	// Entity를 인자로 받는 단일 public 생성자
	public ChapterTitlePatchResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.changedChapterTitle = entity.getChapterTitle();
	}
}

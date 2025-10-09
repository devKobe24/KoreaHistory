package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ChapterNumberPatchResponseDto
 * author         : kobe
 * date           : 2025. 10. 8.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 8.        kobe       최초 생성
 */
@Getter
public class ChapterNumberPatchResponseDto {
	private final Long id;
	private final Integer changedChapterNumber;

	// Entity를 인자로 받는 단일 Public 생성자
	public ChapterNumberPatchResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.changedChapterNumber = entity.getChapterNumber();
	}
}

package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.DetailChapter;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ChapterDetailPatchResponseDto
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Getter
public class ChapterDetailTitlePatchResponseDto {
	private final String changedDetailTitle;

	// Entity를 인자로 받는 단일 public 생성자
	public ChapterDetailTitlePatchResponseDto(DetailChapter entity) {
		this.changedDetailTitle = entity.getTitle();
	}
}

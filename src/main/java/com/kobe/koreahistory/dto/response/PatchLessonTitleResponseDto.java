package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Lesson;
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
public class PatchLessonTitleResponseDto {
	private final String changedLessonTitle;

	// Entity를 인자로 받는 단일 public 생성자
	public PatchLessonTitleResponseDto(Lesson entity) {
		this.changedLessonTitle = entity.getLessonTitle();
	}
}

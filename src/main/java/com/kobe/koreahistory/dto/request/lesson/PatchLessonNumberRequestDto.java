package com.kobe.koreahistory.dto.request.lesson;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.lesson
 * fileName       : PatchLessonNumberRequestDto
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class PatchLessonNumberRequestDto {
	private Integer lessonNumber;

	@Builder
	public PatchLessonNumberRequestDto(Integer lessonNumber) {
		this.lessonNumber = lessonNumber;
	}
}

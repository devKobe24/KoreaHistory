package com.kobe.koreahistory.dto.response.lesson;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.lesson
 * fileName       : PatchLessonNumberResponse
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
public class PatchLessonNumberResponseDto {
	private final Integer lessonNumber;

	public PatchLessonNumberResponseDto(Lesson entity) {
		this.lessonNumber = entity.getLessonNumber();
	}
}

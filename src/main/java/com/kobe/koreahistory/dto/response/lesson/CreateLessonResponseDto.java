package com.kobe.koreahistory.dto.response.lesson;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : CreateDetailChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Getter
public class CreateLessonResponseDto {
	private final Long id;
	private final Integer lessonNumber;
	private final String lessonTitle;

	// Entity를 인자로 받는 단인 생성자로 변환 로직을 캡슐화
	public CreateLessonResponseDto(Lesson entity) {
		this.id = entity.getId();
		this.lessonNumber = entity.getLessonNumber();
		this.lessonTitle = entity.getLessonTitle();
	}
}

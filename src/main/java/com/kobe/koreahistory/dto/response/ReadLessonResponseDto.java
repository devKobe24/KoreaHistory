package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ReadDetailChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Getter
public class ReadLessonResponseDto {
	private final Long id;
	private final Integer lessonNumber;
	private final String lessonTitle;

	// Entity를 인자로 받는 단일 public 생성자
	public ReadLessonResponseDto(Lesson entity) {
		this.id = entity.getId();
		this.lessonNumber = entity.getLessonNumber();
		this.lessonTitle = entity.getLessonTitle();
	}
}

package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : DetailChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 6.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 6.        kobe       최초 생성
 */
@Getter
public class LessonResponseDto {
	private Long id;
	private Integer lessonNumber;
	private String lessonTitle;

	// Entity를 인자로 받는 단일 public 생성자로 통일
	public LessonResponseDto(Lesson entity) {
		this.id = entity.getId();
		this.lessonNumber = entity.getLessonNumber();
		this.lessonTitle = entity.getLessonTitle();
	}
}
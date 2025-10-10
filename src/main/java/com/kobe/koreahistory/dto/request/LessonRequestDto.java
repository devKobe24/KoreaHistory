package com.kobe.koreahistory.dto.request;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : DetailChapterRequestDto
 * author         : kobe
 * date           : 2025. 10. 6.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 6.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class LessonRequestDto {
	private Integer lessonNumber;
	private String lessonTitle;

	@Builder
	public LessonRequestDto(Integer lessonNumber, String lessonTitle) {
		this.lessonNumber = lessonNumber;
		this.lessonTitle = lessonTitle;
	}

	// Request DTO의 핵심 역할 : DTO -> Entity 변환
	public static Lesson toEntity(LessonRequestDto requestDto) {
		return Lesson.builder()
			.lessonNumber(requestDto.getLessonNumber())
			.lessonTitle(requestDto.getLessonTitle())
			.build();
	}
}

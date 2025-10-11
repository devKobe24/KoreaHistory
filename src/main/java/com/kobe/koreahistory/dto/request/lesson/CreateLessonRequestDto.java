package com.kobe.koreahistory.dto.request.lesson;

import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : CreateDetailChapterRequestDto
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateLessonRequestDto {
	private Integer lessonNumber;
	private String lessonTitle;

	@Builder
	public CreateLessonRequestDto(Integer lessonNumber, String lessonTitle) {
		this.lessonNumber = lessonNumber;
		this.lessonTitle = lessonTitle;
	}

	// Request DTO의 핵심 역할 : DTO -> Entity 변환
	public static Lesson toEntity(CreateLessonRequestDto requestDto) {
		return Lesson.builder()
			.lessonNumber(requestDto.getLessonNumber())
			.lessonTitle(requestDto.getLessonTitle())
			.build();
	}
}

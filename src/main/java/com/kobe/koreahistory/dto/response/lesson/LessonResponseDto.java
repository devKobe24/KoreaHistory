package com.kobe.koreahistory.dto.response.lesson;

import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.dto.response.section.CreateSectionResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

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
	private final Long id;
	private final Integer lessonNumber;
	private final String lessonTitle;
	private final List<CreateSectionResponseDto> sections;

	// Entity를 인자로 받는 단일 public 생성자로 통일
	public LessonResponseDto(Lesson entity) {
		this.id = entity.getId();
		this.lessonNumber = entity.getLessonNumber();
		this.lessonTitle = entity.getLessonTitle();

		// Lesson에 포함된 Section들을 DTO로 변환하는 로직
		this.sections = entity.getSections().stream()
			.map(CreateSectionResponseDto::new)
			.collect(Collectors.toList());
	}
}
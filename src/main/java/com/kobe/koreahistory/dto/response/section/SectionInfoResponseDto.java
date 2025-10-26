package com.kobe.koreahistory.dto.response.section;

import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.dto.response.lesson.LessonInfoResponseDto;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.section
 * fileName       : SectionInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    : Section 기본 정보를 담는 간단한 Response DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class SectionInfoResponseDto {
	private final Long id;
	private final Integer sectionNumber;
	private final String sectionTitle;
	private final LessonInfoResponseDto lesson;

	public SectionInfoResponseDto(Section entity) {
		this.id = entity.getId();
		this.sectionNumber = entity.getSectionNumber();
		this.sectionTitle = entity.getSectionTitle();
		this.lesson = entity.getLesson() != null ? new LessonInfoResponseDto(entity.getLesson()) : null;
	}
}
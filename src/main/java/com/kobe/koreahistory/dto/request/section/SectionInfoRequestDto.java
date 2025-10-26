package com.kobe.koreahistory.dto.request.section;

import com.kobe.koreahistory.dto.response.lesson.LessonInfoResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.section
 * fileName       : SectionInfoRequestDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class SectionInfoRequestDto {
	private Integer sectionNumber;
	private String sectionTitle;
	private LessonInfoResponseDto lesson;

	@Builder
	public SectionInfoRequestDto(Integer sectionNumber, String sectionTitle, LessonInfoResponseDto lesson) {
		this.sectionNumber = sectionNumber;
		this.sectionTitle = sectionTitle;
		this.lesson = lesson;
	}
}
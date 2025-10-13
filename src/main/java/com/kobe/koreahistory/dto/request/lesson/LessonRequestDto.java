package com.kobe.koreahistory.dto.request.lesson;

import com.kobe.koreahistory.dto.request.section.CreateSectionRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
	private List<CreateSectionRequestDto> sections = new ArrayList<>();

	@Builder
	public LessonRequestDto(Integer lessonNumber, String lessonTitle, List<CreateSectionRequestDto> sections) {
		this.lessonNumber = lessonNumber;
		this.lessonTitle = lessonTitle;
		this.sections = sections;
	}
}

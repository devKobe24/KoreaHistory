package com.kobe.koreahistory.dto.request;

import com.kobe.koreahistory.dto.request.lesson.LessonRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : CreateChapterRequestDto
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateChapterRequestDto {
	private int chapterNumber;
	private String chapterTitle;
	private List<LessonRequestDto> lessons;

	@Builder
	public CreateChapterRequestDto(int chapterNumber, String chapterTitle, List<LessonRequestDto> lessons) {
		this.chapterNumber = chapterNumber;
		this.chapterTitle = chapterTitle;
		this.lessons = lessons;
	}
}

package com.kobe.koreahistory.dto.request.lesson;

import com.kobe.koreahistory.dto.response.chapter.ChapterInfoResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.lesson
 * fileName       : LessonInfoRequestDto
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
public class LessonInfoRequestDto {
	private Integer lessonNumber;
	private String lessonTitle;
	private ChapterInfoResponseDto chapter;

	@Builder
	public LessonInfoRequestDto(Integer lessonNumber, String lessonTitle, ChapterInfoResponseDto chapter) {
		this.lessonNumber = lessonNumber;
		this.lessonTitle = lessonTitle;
		this.chapter = chapter;
	}
}
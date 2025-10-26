package com.kobe.koreahistory.dto.response.lesson;

import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.dto.response.chapter.ChapterInfoResponseDto;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.lesson
 * fileName       : LessonInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    : Lesson 기본 정보를 담는 간단한 Response DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class LessonInfoResponseDto {
	private final Long id;
	private final Integer lessonNumber;
	private final String lessonTitle;
	private final ChapterInfoResponseDto chapter;

	public LessonInfoResponseDto(Lesson entity) {
		this.id = entity.getId();
		this.lessonNumber = entity.getLessonNumber();
		this.lessonTitle = entity.getLessonTitle();
		this.chapter = entity.getChapter() != null ? new ChapterInfoResponseDto(entity.getChapter()) : null;
	}
}
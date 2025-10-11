package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.dto.response.lesson.LessonResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : ChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 6.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 6.        kobe       최초 생성
 */
@Getter
public class ChapterResponseDto {
	private final Long id;
	private final Integer chapterNumber;
	private final String chapterTitle;
	// 단일 객체가 아닌 List로 변경하여 1:N 관계를 정확히 표현
	private final List<LessonResponseDto> lessons;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ChapterResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.chapterNumber = entity.getChapterNumber();
		this.chapterTitle = entity.getChapterTitle();
		// Entity의 Lesson 리스트를 Stream을 사용해 DTO 리스트로 변환
		this.lessons = entity.getLessons().stream()
			.map(LessonResponseDto::new) // 각각의 Lesson를 DTO로 변환
			.collect(Collectors.toList());
	}
}

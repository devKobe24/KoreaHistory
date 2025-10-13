package com.kobe.koreahistory.dto.request.chapter;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.Lesson;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : ChapterRequestDto
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
public class ChapterRequestDto {
	private Integer chapterNumber;
	private String chapterTitle;
	private Lesson lesson;

	@Builder
	public ChapterRequestDto(Integer chapterNumber, String chapterTitle, Lesson lesson) {
		this.chapterNumber = chapterNumber;
		this.chapterTitle = chapterTitle;
		this.lesson = lesson;
	}
}

package com.kobe.koreahistory.dto.request;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.DetailChapter;
import com.kobe.koreahistory.dto.response.DetailChapterResponseDto;
import lombok.AccessLevel;
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
	private DetailChapter detailChapter;

	@Builder
	public ChapterRequestDto(Integer chapterNumber, String chapterTitle, DetailChapter detailChapter) {
		this.chapterNumber = chapterNumber;
		this.chapterTitle = chapterTitle;
		this.detailChapter = detailChapter;
	}

	// Request DTO의 핵심 역할 : DTO -> Entity 변환
	public static Chapter toEntity(ChapterRequestDto requestDto) {
		return Chapter.builder()
			.chapterNumber(requestDto.chapterNumber)
			.chapterTitle(requestDto.chapterTitle)
			.build();
	}


}

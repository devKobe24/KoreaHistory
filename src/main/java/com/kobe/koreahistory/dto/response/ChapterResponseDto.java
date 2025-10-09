package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.Chapter;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
	private final List<DetailChapterResponseDto> detailChapters;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ChapterResponseDto(Chapter entity) {
		this.id = entity.getId();
		this.chapterNumber = entity.getChapterNumber();
		this.chapterTitle = entity.getChapterTitle();
		// Entity의 DetailChapter 리스트를 Stream을 사용해 DTO 리스트로 변환
		this.detailChapters = entity.getDetailChapters().stream()
			.map(DetailChapterResponseDto::new) // 각각의 DetailChapter를 DTO로 변환
			.collect(Collectors.toList());
	}
}

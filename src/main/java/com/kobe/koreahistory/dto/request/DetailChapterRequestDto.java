package com.kobe.koreahistory.dto.request;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
public class DetailChapterRequestDto {
	private Integer number;
	private String title;

	@Builder
	public DetailChapterRequestDto(Integer number, String title) {
		this.number = number;
		this.title = title;
	}

	// Request DTO의 핵심 역할 : DTO -> Entity 변환
	public static DetailChapter toEntity(DetailChapterRequestDto requestDto) {
		return DetailChapter.builder()
			.number(requestDto.number)
			.title(requestDto.title)
			.build();
	}
}

package com.kobe.koreahistory.dto.request;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import com.kobe.koreahistory.dto.response.CreateDetailChapterResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : CreateDetailChapterRequestDto
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateDetailChapterRequestDto {
	private Integer detailChapterNumber;
	private String detailChapterTitle;

	@Builder
	public CreateDetailChapterRequestDto(Integer detailChapterNumber, String detailChapterTitle) {
		this.detailChapterNumber = detailChapterNumber;
		this.detailChapterTitle = detailChapterTitle;
	}

	// Request DTO의 핵심 역할 : DTO -> Entity 변환
	public static DetailChapter toEntity(CreateDetailChapterRequestDto requestDto) {
		return DetailChapter.builder()
			.number(requestDto.detailChapterNumber)
			.title(requestDto.detailChapterTitle)
			.build();
	}
}

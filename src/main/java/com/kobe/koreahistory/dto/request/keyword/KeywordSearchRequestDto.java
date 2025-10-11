package com.kobe.koreahistory.dto.request.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : KeywordSearchRequestDto
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
public class KeywordSearchRequestDto {
	private String keyword;

	@Builder
	public KeywordSearchRequestDto(String keyword) {
		this.keyword = keyword;
	}

	public static Keyword toEntity(KeywordSearchRequestDto requestDto) {
		return Keyword.builder()
			.keyword(requestDto.getKeyword())
			.build();
	}
}

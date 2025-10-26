package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : KeywordInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    : Keyword 기본 정보를 담는 간단한 Response DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class KeywordInfoResponseDto {
	private final Long id;
	private final Integer keywordNumber;
	private final List<String> keywords;

	public KeywordInfoResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordNumber = entity.getKeywordNumber();
		this.keywords = entity.getKeywords();
	}
}

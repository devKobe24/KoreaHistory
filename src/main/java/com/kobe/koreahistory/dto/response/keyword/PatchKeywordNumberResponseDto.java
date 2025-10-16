package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : PatchKeywordNumberResponseDto
 * author         : kobe
 * date           : 2025. 10. 16.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 16.        kobe       최초 생성
 */
@Getter
public class PatchKeywordNumberResponseDto {
	private final Long id;
	private final Integer keywordNumber;
	private final List<String> keywords;

	public PatchKeywordNumberResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordNumber = entity.getKeywordNumber();
		this.keywords = entity.getKeywords();
	}
}

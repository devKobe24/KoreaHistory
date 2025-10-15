package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : PatchKeywordResponseDto
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
public class PatchKeywordResponseDto {
	private final Long id;
	private final Integer keywordNumber;
	private final List<String> updatedKeywords;

	public PatchKeywordResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordNumber = entity.getKeywordNumber();
		this.updatedKeywords = entity.getKeywords();
	}
}

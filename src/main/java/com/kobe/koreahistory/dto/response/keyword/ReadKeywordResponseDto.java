package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : ReadKeywordResponseDto
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
public class ReadKeywordResponseDto {
	private Long id;
	private Integer keywordNumber;
	private List<String> keywords;

	public ReadKeywordResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordNumber = entity.getKeywordNumber();
		this.keywords = entity.getKeywords();
	}
}

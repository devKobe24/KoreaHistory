package com.kobe.koreahistory.dto.request.keyword;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.keyword
 * fileName       : PatchKeywordRequestDto
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class PatchKeywordRequestDto {
	private String keywordTitle;
	private List<String> keywords = new ArrayList<>();

	@Builder
	public PatchKeywordRequestDto(String keywordTitle, List<String> keywords) {
		this.keywordTitle = keywordTitle;
		this.keywords = keywords;
	}
}

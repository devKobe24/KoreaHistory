package com.kobe.koreahistory.dto.request.keyword;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.keyword
 * fileName       : DeleteKeywordRequestDto
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
public class DeleteKeywordRequestDto {
	private String targetKeyword;

	@Builder
	public DeleteKeywordRequestDto(String targetKeyword) {
		this.targetKeyword = targetKeyword;
	}
}

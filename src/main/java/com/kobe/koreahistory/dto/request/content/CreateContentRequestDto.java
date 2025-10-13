package com.kobe.koreahistory.dto.request.content;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.content
 * fileName       : CreateContentRequestDto
 * author         : kobe
 * date           : 2025. 10. 14.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 14.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateContentRequestDto {
	private String detail;
	private Keyword keyword;

	@Builder
	public CreateContentRequestDto(String detail, Keyword keyword) {
		this.detail = detail;
		this.keyword = keyword;
	}
}

package com.kobe.koreahistory.dto.response.content;

import com.kobe.koreahistory.domain.entity.Content;
import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : CreateContentResponseDto
 * author         : kobe
 * date           : 2025. 10. 14.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 14.        kobe       최초 생성
 */
@Getter
public class CreateContentResponseDto {
	private final Long id;
	private final String detail;
	private final Keyword keyword;

	public CreateContentResponseDto(Content entity) {
		this.id = entity.getId();
		this.detail = entity.getDetail();
		this.keyword = entity.getKeyword();
	}
}

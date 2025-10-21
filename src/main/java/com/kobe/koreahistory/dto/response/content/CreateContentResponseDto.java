package com.kobe.koreahistory.dto.response.content;

import com.kobe.koreahistory.domain.entity.Content;
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
 * 2025. 10. 21.        kobe       수정
 */
@Getter
public class CreateContentResponseDto {
	private final Long id;
	private final Long keywordId;

	public CreateContentResponseDto(Content entity) {
		this.id = entity.getId();
		this.keywordId = entity.getKeyword().getId();
	}
}
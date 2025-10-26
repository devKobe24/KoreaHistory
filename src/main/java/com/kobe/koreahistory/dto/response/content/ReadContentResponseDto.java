package com.kobe.koreahistory.dto.response.content;

import com.kobe.koreahistory.domain.entity.Content;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ReadContentResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class ReadContentResponseDto {
	private final Long id;
	private final List<String> details;
	private final KeywordInfoResponseDto keyword;

	public ReadContentResponseDto(Content entity) {
		this.id = entity.getId();
		this.details = entity.getDetails();
		this.keyword = entity.getKeyword() != null ? new KeywordInfoResponseDto(entity.getKeyword()) : null;
	}
}

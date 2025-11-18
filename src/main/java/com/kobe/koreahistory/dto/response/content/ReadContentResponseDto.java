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
	private final Integer contentNumber;
	private final String contentTitle;
	private final List<String> details;
	private final String contentType;
	private final String blockData;
	private final KeywordInfoResponseDto keyword;

	public ReadContentResponseDto(Content entity) {
		this.id = entity.getId();
		this.contentNumber = entity.getContentNumber();
		this.contentTitle = entity.getContentTitle();
		this.details = entity.getDetails();
		this.contentType = entity.getContentType();
		this.blockData = entity.getBlockData();
		this.keyword = entity.getKeyword() != null ? new KeywordInfoResponseDto(entity.getKeyword()) : null;
	}
}

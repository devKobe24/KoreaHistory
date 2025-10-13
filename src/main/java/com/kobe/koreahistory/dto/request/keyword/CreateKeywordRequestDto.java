package com.kobe.koreahistory.dto.request.keyword;

import com.kobe.koreahistory.domain.entity.Content;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.keyword
 * fileName       : CreateKeywordRequestDto
 * author         : kobe
 * date           : 2025. 10. 12.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 12.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateKeywordRequestDto {
	private Integer keywordNumber;
	private String keyword;
	private Content content;

	@Builder
	public CreateKeywordRequestDto(Integer keywordNumber, String keyword, Content content) {
		this.keywordNumber = keywordNumber;
		this.keyword = keyword;
		this.content = content;
	}
}

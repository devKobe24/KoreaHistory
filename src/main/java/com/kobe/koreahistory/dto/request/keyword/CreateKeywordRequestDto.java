package com.kobe.koreahistory.dto.request.keyword;

import com.kobe.koreahistory.dto.request.content.CreateContentRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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
	private List<String> keywords = new ArrayList<>();
	private List<CreateContentRequestDto> contents = new ArrayList<>();

	@Builder
	public CreateKeywordRequestDto(Integer keywordNumber, List<String> keywords, List<CreateContentRequestDto> contents) {
		this.keywordNumber = keywordNumber;
		this.keywords = keywords;
		this.contents = contents;
	}
}

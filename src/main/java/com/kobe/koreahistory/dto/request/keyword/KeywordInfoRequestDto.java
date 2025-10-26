package com.kobe.koreahistory.dto.request.keyword;

import com.kobe.koreahistory.dto.response.topic.TopicInfoResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.keyword
 * fileName       : KeywordInfoRequestDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class KeywordInfoRequestDto {
	private Integer keywordNumber;
	private List<String> keywords;
	private TopicInfoResponseDto topic;

	@Builder
	public KeywordInfoRequestDto(Integer keywordNumber, List<String> keywords, TopicInfoResponseDto topic) {
		this.keywordNumber = keywordNumber;
		this.keywords = keywords;
		this.topic = topic;
	}
}
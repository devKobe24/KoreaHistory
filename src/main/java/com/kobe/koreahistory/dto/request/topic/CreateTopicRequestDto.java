package com.kobe.koreahistory.dto.request.topic;

import com.kobe.koreahistory.dto.request.keyword.CreateKeywordRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.topic
 * fileName       : CreateTopicRequestDto
 * author         : kobe
 * date           : 2025. 10. 12.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 12.        kobe       최초 생성
 * 2025. 10. 21.        kobe       스장
 */
@Getter
@NoArgsConstructor
public class CreateTopicRequestDto {
	private Integer topicNumber;
	private String topicTitle;
	private List<CreateKeywordRequestDto> keywords = new ArrayList<>();

	@Builder
	public CreateTopicRequestDto(Integer topicNumber, String topicTitle, List<CreateKeywordRequestDto> keywords) {
		this.topicNumber = topicNumber;
		this.topicTitle = topicTitle;
		this.keywords = keywords;
	}

	// 단순 생성자를 위한 추가 생성자
	public CreateTopicRequestDto(Integer topicNumber, String topicTitle) {
		this.topicNumber = topicNumber;
		this.topicTitle = topicTitle;
		this.keywords = new ArrayList<>();
	}
}
package com.kobe.koreahistory.dto.response.topic;

import com.kobe.koreahistory.domain.entity.Topic;
import com.kobe.koreahistory.dto.response.keyword.CreateKeywordResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.dto.response.topic
 * fileName       : CreateTopicResponseDto
 * author         : kobe
 * date           : 2025. 10. 12.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 12.        kobe       최초 생성
 */
@Getter
public class CreateTopicResponseDto {
	private final Long id;
	private final Integer topicNumber;
	private final String topicTitle;
	private final List<CreateKeywordResponseDto> keywordGroup;

	// Entity를 인자로 받는 단일 public 생성자로 통일
	public CreateTopicResponseDto(Topic entity) {
		this.id = entity.getId();
		this.topicNumber = entity.getTopicNumber();
		this.topicTitle = entity.getTopicTitle();

		// Topic에 포함된 Keyword들을 DTO로 변환하는 로직
		this.keywordGroup = entity.getKeywords().stream()
			.map(CreateKeywordResponseDto::new)
			.collect(Collectors.toList());

	}
}

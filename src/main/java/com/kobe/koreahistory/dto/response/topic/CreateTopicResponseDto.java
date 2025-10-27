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
 * 2025. 10. 21.        kobe       수정
 */
@Getter
public class CreateTopicResponseDto {
	private final Long id;
	private final Integer topicNumber;
	private final String topicTitle;
	private final Long subsectionId;
	private final List<CreateKeywordResponseDto> keywords;

	public CreateTopicResponseDto(Topic entity) {
		this.id = entity.getId();
		this.topicNumber = entity.getTopicNumber();
		this.topicTitle = entity.getTopicTitle();
		this.subsectionId = entity.getSubsection().getId();
		this.keywords = entity.getKeywords().stream()
			.map(CreateKeywordResponseDto::new)
			.collect(Collectors.toList());
	}
}
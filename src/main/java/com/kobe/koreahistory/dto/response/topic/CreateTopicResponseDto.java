package com.kobe.koreahistory.dto.response.topic;

import com.kobe.koreahistory.domain.entity.Topic;
import lombok.Getter;

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

	public CreateTopicResponseDto(Topic entity) {
		this.id = entity.getId();
		this.topicNumber = entity.getTopicNumber();
		this.topicTitle = entity.getTopicTitle();
		this.subsectionId = entity.getSubsection().getId();
	}
}
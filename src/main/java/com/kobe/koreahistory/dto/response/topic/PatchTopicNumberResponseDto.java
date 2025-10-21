package com.kobe.koreahistory.dto.response.topic;

import com.kobe.koreahistory.domain.entity.Topic;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.topic
 * fileName       : PatchTopicNumberResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class PatchTopicNumberResponseDto {
	private final Long id;
	private final Integer topicNumber;

	public PatchTopicNumberResponseDto(Topic entity) {
		this.id = entity.getId();
		this.topicNumber = entity.getTopicNumber();
	}
}

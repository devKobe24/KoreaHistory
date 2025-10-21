package com.kobe.koreahistory.dto.request.topic;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.topic
 * fileName       : PatchTopicNumberRequestDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class PatchTopicNumberRequestDto {
	private Integer topicNumber;

	public PatchTopicNumberRequestDto(Integer topicNumber) {
		this.topicNumber = topicNumber;
	}
}

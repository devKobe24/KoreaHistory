package com.kobe.koreahistory.dto.request.topic;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.topic
 * fileName       : PatchTopicTitleRequestDto
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
public class PatchTopicTitleRequestDto {
	private String topicTitle;

	public PatchTopicTitleRequestDto(String topicTitle) {
		this.topicTitle = topicTitle;
	}
}

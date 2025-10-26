package com.kobe.koreahistory.dto.response.topic;

import com.kobe.koreahistory.domain.entity.Topic;
import com.kobe.koreahistory.dto.response.subsection.SubsectionInfoResponseDto;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.topic
 * fileName       : TopicInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    : Topic 기본 정보를 담는 간단한 Response DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class TopicInfoResponseDto {
    private final Long id;
    private final Integer topicNumber;
    private final String topicTitle;
	private final SubsectionInfoResponseDto subsection;

    // Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
    public TopicInfoResponseDto(Topic entity) {
        this.id = entity.getId();
        this.topicNumber = entity.getTopicNumber();
        this.topicTitle = entity.getTopicTitle();
		this.subsection = entity.getSubsection() != null ? new SubsectionInfoResponseDto(entity.getSubsection()) : null;
    }
}
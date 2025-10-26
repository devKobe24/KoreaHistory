package com.kobe.koreahistory.dto.request.topic;

import com.kobe.koreahistory.dto.response.subsection.SubsectionInfoResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.topic
 * fileName       : TopicInfoRequestDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    : Topic 기본 정보를 담는 Request DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class TopicInfoRequestDto {
	private Integer topicNumber;
    private String topicTitle;
	private SubsectionInfoResponseDto subsection;

    @Builder
    public TopicInfoRequestDto(Integer topicNumber, String topicTitle, SubsectionInfoResponseDto subsection) {
        this.topicNumber = topicNumber;
        this.topicTitle = topicTitle;
		this.subsection = subsection;
    }
}
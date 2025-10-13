package com.kobe.koreahistory.dto.request.subsection;

import com.kobe.koreahistory.dto.request.topic.CreateTopicRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.subsection
 * fileName       : CreateSubsectionRequestDto
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateSubsectionRequestDto {
	private Integer subsectionNumber;
	private String subsectionTitle;
	private List<CreateTopicRequestDto> topics = new ArrayList<>();

	@Builder
	public CreateSubsectionRequestDto(Integer subsectionNumber, String subsectionTitle, List<CreateTopicRequestDto> topics) {
		this.subsectionNumber = subsectionNumber;
		this.subsectionTitle = subsectionTitle;
		this.topics = topics;
	}
}

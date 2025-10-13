package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.dto.response.content.CreateContentResponseDto;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import com.kobe.koreahistory.dto.response.topic.CreateTopicResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : CreateKeywordResponseDto
 * author         : kobe
 * date           : 2025. 10. 12.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 12.        kobe       최초 생성
 */
@Getter
public class CreateKeywordResponseDto {
	private final Long id;
	private final Integer keywordNumber;
	private final String keyword;
	private final CreateSubsectionResponseDto subsection;
	private final CreateTopicResponseDto topic;
	private final List<CreateContentResponseDto> contents;

	public CreateKeywordResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.keywordNumber = entity.getKeywordNumber();
		this.keyword = entity.getKeyword();

		// Topic을 통해 Subsection에 접근
		this.subsection = new CreateSubsectionResponseDto(entity.getTopic().getSubsection());


		if (entity.getTopic() != null) {
			this.topic = new CreateTopicResponseDto(entity.getTopic());
		} else {
			this.topic = null;
		}

		// Keyword에 직접 연결된 contents를 DTO로 변환
		this.contents = entity.getContents().stream()
			.map(CreateContentResponseDto::new)
			.collect(Collectors.toList());
	}
}

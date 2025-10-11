package com.kobe.koreahistory.dto.response.section;

import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.dto.response.section
 * fileName       : CreateSectionResponseDto
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Getter
public class CreateSectionResponseDto {
	private final Long id;
	private final Integer sectionNumber;
	private final String sectionTitle;
	private final List<CreateSubsectionResponseDto> subsections;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public CreateSectionResponseDto(Section entity) {
		this.id = entity.getId();
		this.sectionNumber = entity.getSectionNumber();
		this.sectionTitle = entity.getSectionTitle();

		// Section에 포함된 Subsection들을 DTO로 변환하는 로직
		this.subsections = entity.getSubsections().stream()
			.map(CreateSubsectionResponseDto::new)
			.collect(Collectors.toList());
	}
}

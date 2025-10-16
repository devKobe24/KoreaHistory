package com.kobe.koreahistory.dto.response.section;

import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.dto.response.section
 * fileName       : PatchSectionNumberResponseDto
 * author         : kobe
 * date           : 2025. 10. 16.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 16.        kobe       최초 생성
 */
@Getter
public class PatchSectionNumberResponseDto {
	private final Long id;
	private final Integer sectionNumber;
	private final String sectionTitle;
	private final List<CreateSubsectionResponseDto> subsections;

	public PatchSectionNumberResponseDto(Section entity) {
		this.id = entity.getId();
		this.sectionNumber = entity.getSectionNumber();
		this.sectionTitle = entity.getSectionTitle();
		this.subsections = entity.getSubsections().stream()
			.map(CreateSubsectionResponseDto::new)
			.collect(Collectors.toList());
	}
}

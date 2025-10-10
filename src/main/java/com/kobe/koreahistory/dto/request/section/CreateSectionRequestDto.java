package com.kobe.koreahistory.dto.request.section;

import com.kobe.koreahistory.domain.entity.Section;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.section
 * fileName       : CreateSectionRequestDto
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
public class CreateSectionRequestDto {

	private Integer sectionNumber;
	private String sectionTitle;

	@Builder
	public CreateSectionRequestDto(Integer sectionNumber, String sectionTitle) {
		this.sectionNumber = sectionNumber;
		this.sectionTitle = sectionTitle;
	}

	// Request DTO의 핵심 역할: DTO -> Entity 변환
	public static Section toEntity(CreateSectionRequestDto requestDto) {
		return Section.builder()
			.sectionNumber(requestDto.getSectionNumber())
			.sectionTitle(requestDto.getSectionTitle())
			.build();
	}
}

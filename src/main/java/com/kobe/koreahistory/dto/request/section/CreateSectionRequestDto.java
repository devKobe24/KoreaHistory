package com.kobe.koreahistory.dto.request.section;

import com.kobe.koreahistory.dto.request.subsection.CreateSubsectionRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
	private List<CreateSubsectionRequestDto> subsections = new ArrayList<>();

	@Builder
	public CreateSectionRequestDto(Integer sectionNumber, String sectionTitle, List<CreateSubsectionRequestDto> subsections) {
		this.sectionNumber = sectionNumber;
		this.sectionTitle = sectionTitle;
		this.subsections = subsections;
	}
}

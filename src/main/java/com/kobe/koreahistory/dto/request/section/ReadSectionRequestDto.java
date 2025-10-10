package com.kobe.koreahistory.dto.request.section;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.section
 * fileName       : ReadSectionRequestDto
 * author         : kobe
 * date           : 2025. 10. 11.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 11.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class ReadSectionRequestDto {

	private Integer sectionNumber;
	private String sectionTitle;

	@Builder
	public ReadSectionRequestDto(Integer sectionNumber, String sectionTitle) {
		this.sectionNumber = sectionNumber;
		this.sectionTitle = sectionTitle;
	}
}

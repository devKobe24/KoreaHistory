package com.kobe.koreahistory.dto.request.section;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.section
 * fileName       : PatchSectionNumberRequestDto
 * author         : kobe
 * date           : 2025. 10. 16.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 16.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class PatchSectionNumberRequestDto {

	private Integer sectionNumber;

	@Builder
	public PatchSectionNumberRequestDto(Integer sectionNumber) {
		this.sectionNumber = sectionNumber;
	}
}

package com.kobe.koreahistory.dto.request.subsection;

import com.kobe.koreahistory.dto.response.section.SectionInfoResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.subsection
 * fileName       : SubsectionInfoRequestDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class SubsectionInfoRequestDto {
	private Integer subsectionNumber;
	private String subsectionTitle;
	private SectionInfoResponseDto section;

	public SubsectionInfoRequestDto(Integer subsectionNumber, String subsectionTitle, SectionInfoResponseDto section) {
		this.subsectionNumber = subsectionNumber;
		this.subsectionTitle = subsectionTitle;
		this.section = section;
	}
}
package com.kobe.koreahistory.dto.response.subsection;

import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.dto.response.section.SectionInfoResponseDto;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.subsection
 * fileName       : SubsectionInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    : Subsection 기본 정보를 담는 간단한 Response DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class SubsectionInfoResponseDto {
	private final Long id;
	private final Integer subsectionNumber;
	private final String subsectionTitle;
	private final SectionInfoResponseDto section;

	public SubsectionInfoResponseDto(Subsection entity) {
		this.id = entity.getId();
		this.subsectionNumber = entity.getSubsectionNumber();
		this.subsectionTitle = entity.getSubsectionTitle();
		this.section = entity.getSection() != null ? new SectionInfoResponseDto(entity.getSection()) : null;
	}
}
package com.kobe.koreahistory.dto.response.section;

import com.kobe.koreahistory.domain.entity.Section;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.section
 * fileName       : ReadSectionResponseDto
 * author         : kobe
 * date           : 2025. 10. 11.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 11.        kobe       최초 생성
 */
@Getter
public class ReadSectionResponseDto {
	private final Long id;
	private final Integer sectionNumber;
	private final String sectionTitle;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ReadSectionResponseDto(Section entity) {
		this.id = entity.getId();
		this.sectionNumber = entity.getSectionNumber();
		this.sectionTitle = entity.getSectionTitle();
	}
}

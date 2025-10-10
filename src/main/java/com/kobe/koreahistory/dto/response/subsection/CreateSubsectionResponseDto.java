package com.kobe.koreahistory.dto.response.subsection;

import com.kobe.koreahistory.domain.entity.Subsection;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.subsection
 * fileName       : CreateSubsectionResponseDto
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Getter
public class CreateSubsectionResponseDto {
	private final Long id;
	private final Integer subsectionNumber;
	private final String subsectionTitle;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public CreateSubsectionResponseDto(Subsection entity) {
		this.id = entity.getId();
		this.subsectionNumber = entity.getSubsectionNumber();
		this.subsectionTitle = entity.getSubsectionTitle();
	}
}

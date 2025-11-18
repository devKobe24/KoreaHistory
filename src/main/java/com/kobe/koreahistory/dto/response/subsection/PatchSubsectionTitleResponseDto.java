package com.kobe.koreahistory.dto.response.subsection;

import com.kobe.koreahistory.domain.entity.Subsection;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.subsection
 * fileName       : PatchSubsectionTitleResponseDto
 * author         : kobe
 * date           : 2025. 11. 02.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 02.        kobe       최초 생성
 */
@Getter
public class PatchSubsectionTitleResponseDto {
	private final Long id;
	private final String subsectionTitle;

	public PatchSubsectionTitleResponseDto(Subsection entity) {
		this.id = entity.getId();
		this.subsectionTitle = entity.getSubsectionTitle();
	}
}


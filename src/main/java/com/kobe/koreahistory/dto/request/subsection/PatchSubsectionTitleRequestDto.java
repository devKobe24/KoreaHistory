package com.kobe.koreahistory.dto.request.subsection;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.subsection
 * fileName       : PatchSubsectionTitleRequestDto
 * author         : kobe
 * date           : 2025. 11. 02.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 02.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class PatchSubsectionTitleRequestDto {

	private String subsectionTitle;

	@Builder
	public PatchSubsectionTitleRequestDto(String subsectionTitle) {
		this.subsectionTitle = subsectionTitle;
	}
}


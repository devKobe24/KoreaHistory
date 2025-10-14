package com.kobe.koreahistory.dto.request.content;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.content
 * fileName       : CreateContentRequestDto
 * author         : kobe
 * date           : 2025. 10. 14.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 14.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateContentRequestDto {
	private List<String> details;

	@Builder
	public CreateContentRequestDto(List<String> details) {
		this.details = details;
	}
}

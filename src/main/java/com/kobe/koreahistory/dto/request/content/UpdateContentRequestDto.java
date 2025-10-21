package com.kobe.koreahistory.dto.request.content;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request.content
 * fileName       : UpdateContentRequestDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class UpdateContentRequestDto {
	private List<String> details;

	public UpdateContentRequestDto(List<String> details) {
		this.details = details;
	}
}

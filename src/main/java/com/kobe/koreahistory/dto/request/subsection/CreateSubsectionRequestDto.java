package com.kobe.koreahistory.dto.request.subsection;

import com.kobe.koreahistory.domain.entity.Subsection;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request.subsection
 * fileName       : CreateSubsectionRequestDto
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateSubsectionRequestDto {
	private Integer subsectionNumber;
	private String subsectionTitle;

	@Builder
	public CreateSubsectionRequestDto(Integer subsectionNumber, String subsectionTitle) {
		this.subsectionNumber = subsectionNumber;
		this.subsectionTitle = subsectionTitle;
	}

	// Request DTO의 핵심 역할: DTO -> Entity 변환
	public static Subsection toEntity(CreateSubsectionRequestDto requestDto) {
		return Subsection.builder()
			.subsectionNumber(requestDto.getSubsectionNumber())
			.subsectionTitle(requestDto.getSubsectionTitle())
			.build();
	}
}

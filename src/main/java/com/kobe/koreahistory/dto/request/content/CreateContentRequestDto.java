package com.kobe.koreahistory.dto.request.content;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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
 * 2025. 10. 21.        kobe       수정
 */
@Getter
@NoArgsConstructor
public class CreateContentRequestDto {
	private Integer contentNumber;
	private String contentTitle;
	private List<String> details = new ArrayList<>();
	private String contentType; // "TEXT", "TABLE", "TIMELINE", "COMPARISON_TABLE", "HERITAGE", "IMAGE_GALLERY"
	private String blockData; // JSON 형태의 ContentBlock 데이터

	@Builder
	public CreateContentRequestDto(Integer contentNumber, String contentTitle, List<String> details, String contentType, String blockData) {
		this.contentNumber = contentNumber;
		this.contentTitle = contentTitle;
		this.details = details;
		this.contentType = contentType;
		this.blockData = blockData;
	}
}
package com.kobe.koreahistory.dto.response.keyword;

import com.kobe.koreahistory.domain.entity.Keyword;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.keyword
 * fileName       : DeleteKeywordResponseDto
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Getter
public class DeleteKeywordResponseDto {
	private Long id;
	private List<String> resultKeywords;
	private String message;

	public DeleteKeywordResponseDto(Keyword entity) {
		this.id = entity.getId();
		this.resultKeywords = entity.getKeywords();
		this.message = "성공적으로 삭제 되었습니다.";
	}
}

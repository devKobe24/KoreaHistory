package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.KeywordContent;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : KeywordContentSearchResponseDto
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Getter
public class KeywordContentSearchResponseDto {
	private final Long id;
	private String mainCategory;
	private String subCategory;
	private String detail;

	// Entity를 인자로 받는 단일 public 생성자
	public KeywordContentSearchResponseDto(KeywordContent entity) {
		this.id = entity.getId();

		entity.getContents().forEach(content -> {
			this.mainCategory = content.getMainCategory();
			this.subCategory = content.getSubCategory();
			this.detail = content.getDetail();
		});
	}

}

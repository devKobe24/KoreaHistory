package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : CreateDetailChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Getter
public class CreateDetailChapterResponseDto {
	private final Long id;
	private final Integer detailChapterNumber;
	private final String detailChapterTitle;

	// Entity를 인자로 받는 단인 생성자로 변환 로직을 캡슐화
	public CreateDetailChapterResponseDto(DetailChapter entity) {
		this.id = entity.getId();
		this.detailChapterNumber = entity.getNumber();
		this.detailChapterTitle = entity.getTitle();
	}
}

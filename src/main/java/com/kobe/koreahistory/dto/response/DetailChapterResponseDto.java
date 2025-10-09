package com.kobe.koreahistory.dto.response;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response
 * fileName       : DetailChapterResponseDto
 * author         : kobe
 * date           : 2025. 10. 6.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 6.        kobe       최초 생성
 */
@Getter
public class DetailChapterResponseDto {
	private Long id;
	private Integer number;
	private String title;

	// Entity를 인자로 받는 단일 public 생성자로 통일
	public DetailChapterResponseDto(DetailChapter entity) {
		this.id = entity.getId();
		this.number = entity.getNumber();
		this.title = entity.getTitle();
	}
}
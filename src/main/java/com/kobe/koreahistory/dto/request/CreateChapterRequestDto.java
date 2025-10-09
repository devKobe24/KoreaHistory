package com.kobe.koreahistory.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : CreateChapterRequestDto
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
public class CreateChapterRequestDto {
	private int chapterNumber;
	private String chapterTitle;
	private List<DetailChapterRequestDto> detailChapters;
}

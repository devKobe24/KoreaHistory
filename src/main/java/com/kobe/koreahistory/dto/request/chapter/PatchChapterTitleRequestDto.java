package com.kobe.koreahistory.dto.request.chapter;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.request
 * fileName       : ChapterTitlePatchRequestDto
 * author         : kobe
 * date           : 2025. 10. 8.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 8.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor // public 기본 생성자를 만들어줌.
public class PatchChapterTitleRequestDto {
	private String chapterTitle;
}

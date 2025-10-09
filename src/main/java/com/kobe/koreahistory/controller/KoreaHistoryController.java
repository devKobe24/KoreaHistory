package com.kobe.koreahistory.controller;

import com.kobe.koreahistory.dto.request.*;
import com.kobe.koreahistory.dto.response.*;
import com.kobe.koreahistory.service.ChapterService;
import com.kobe.koreahistory.service.DetailChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * packageName    : com.kobe.koreahistory.controller
 * fileName       : KoreaHistoryController
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class KoreaHistoryController {

	private final ChapterService chapterService;
	private final DetailChapterService detailChapterService;

	@PostMapping("/search/chapters")
	public ResponseEntity<ChapterResponseDto> searchChapters(
		@RequestBody ChapterSearchRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.findChapterWithDetails(requestDto.getChapterTitle()));
	}

	@PostMapping("/search/keywords")
	public ResponseEntity<KeywordSearchResponseDto> searchKeywords(
		@RequestBody KeywordSearchRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.findKeywordWithContents(requestDto.getKeyword()));
	}

	@PostMapping("/search/details")
	public ResponseEntity<KeywordContentSearchResponseDto> searchDetails(
		@RequestBody KeywordSearchRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.findKeywordContentWithKeyword(requestDto.getKeyword()));
	}

	@PostMapping("/create/chapter")
	public ResponseEntity<CreateChapterResponseDto> createChapter(
		@RequestBody CreateChapterRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.createChapter(requestDto));
	}

	@PostMapping("/chapters/{chapterId}/details")
	public ResponseEntity<CreateDetailChapterResponseDto> addDetailChapter(
		@PathVariable Long chapterId,
		@RequestBody CreateDetailChapterRequestDto requestDto
	) {
		CreateDetailChapterResponseDto responseDto = detailChapterService.createDetailChapter(chapterId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto); // 생성 성공을 의미하는 201 Created 응답.
	}

	@PatchMapping("/chapters/{id}/number")
	public ResponseEntity<PatchChapterNumberResponseDto> patchChapterNumber(
		@PathVariable Long id,
		@RequestBody PatchChapterNumberRequestDto requestDto
	) {
		PatchChapterNumberResponseDto responseDto = chapterService.updateChapterNumber(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@PatchMapping("/chapters/{id}/title")
	public ResponseEntity<PatchChapterTitleResponseDto> patchChapterTitle(
		@PathVariable Long id,
		@RequestBody PatchChapterTitleRequestDto requestDto
	) {
		PatchChapterTitleResponseDto responseDto = chapterService.updateChapterTitle(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@PatchMapping("/chapters/detail/{id}")
	public ResponseEntity<PatchChapterDetailTitleResponseDto> patchChapterDetail(
		@PathVariable Long id,
		@RequestBody PatchChapterDetailTitleRequestDto requestDto
	) {
		PatchChapterDetailTitleResponseDto responseDto = detailChapterService.updateChapterDetailTitle(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}
}

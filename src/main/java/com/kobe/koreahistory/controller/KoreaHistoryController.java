package com.kobe.koreahistory.controller;

import com.kobe.koreahistory.dto.request.*;
import com.kobe.koreahistory.dto.response.*;
import com.kobe.koreahistory.service.ChapterService;
import com.kobe.koreahistory.service.DetailChapterService;
import lombok.RequiredArgsConstructor;
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
	public ResponseEntity<ChapterCreateResponseDto> createChapter(
		@RequestBody CreateChapterRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.createChapter(requestDto));
	}

	@PatchMapping("/chapters/{id}/number")
	public ResponseEntity<ChapterNumberPatchResponseDto> patchChapterNumber(
		@PathVariable Long id,
		@RequestBody PatchChapterNumberRequestDto requestDto
	) {
		ChapterNumberPatchResponseDto responseDto = chapterService.updateChapterNumber(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}

	// TODO: - UPDATE CHAPTER TITLE
	@PatchMapping("/chapters/{id}/title")
	public ResponseEntity<ChapterTitlePatchResponseDto> patchChapterTitle(
		@PathVariable Long id,
		@RequestBody PatchChapterTitleRequestDto requestDto
	) {
		ChapterTitlePatchResponseDto responseDto = chapterService.updateChapterTitle(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}

	// TODO: - UPDATE DETAIL CHAPTERS
	@PatchMapping("/chapters/detail/{id}")
	public ResponseEntity<ChapterDetailTitlePatchResponseDto> patchChapterDetail(
		@PathVariable Long id,
		@RequestBody PatchChapterDetailTitleRequestDto requestDto
	) {
		ChapterDetailTitlePatchResponseDto responseDto = detailChapterService.updateChapterDetailTitle(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}
}

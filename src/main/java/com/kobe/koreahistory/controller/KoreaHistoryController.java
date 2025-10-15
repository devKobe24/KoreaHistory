package com.kobe.koreahistory.controller;

import com.kobe.koreahistory.dto.request.chapter.ChapterSearchRequestDto;
import com.kobe.koreahistory.dto.request.chapter.CreateChapterRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterNumberRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterTitleRequestDto;
import com.kobe.koreahistory.dto.request.keyword.CreateKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.DeleteKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.PatchKeywordRequestDto;
import com.kobe.koreahistory.dto.request.lesson.CreateLessonRequestDto;
import com.kobe.koreahistory.dto.request.lesson.PatchLessonNumberRequestDto;
import com.kobe.koreahistory.dto.request.lesson.PatchLessonTitleRequestDto;
import com.kobe.koreahistory.dto.request.section.CreateSectionRequestDto;
import com.kobe.koreahistory.dto.request.subsection.CreateSubsectionRequestDto;
import com.kobe.koreahistory.dto.response.chapter.ChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.CreateChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterNumberResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterTitleResponseDto;
import com.kobe.koreahistory.dto.response.keyword.CreateKeywordResponseDto;
import com.kobe.koreahistory.dto.response.keyword.DeleteKeywordResponseDto;
import com.kobe.koreahistory.dto.response.keyword.PatchKeywordResponseDto;
import com.kobe.koreahistory.dto.response.keyword.ReadKeywordResponseDto;
import com.kobe.koreahistory.dto.response.lesson.CreateLessonResponseDto;
import com.kobe.koreahistory.dto.response.lesson.PatchLessonNumberResponseDto;
import com.kobe.koreahistory.dto.response.lesson.PatchLessonTitleResponseDto;
import com.kobe.koreahistory.dto.response.lesson.ReadLessonResponseDto;
import com.kobe.koreahistory.dto.response.section.CreateSectionResponseDto;
import com.kobe.koreahistory.dto.response.section.ReadSectionResponseDto;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import com.kobe.koreahistory.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
	private final LessonService lessonService;
	private final SectionService sectionService;
	private final SubsectionService subsectionService;
	private final KeywordService keywordService;

	@GetMapping("/detail/search")
	public ResponseEntity<List<ReadLessonResponseDto>> searchLesson(
		@RequestParam(required = false) Integer lessonNumber,
		@RequestParam(required = false) String lessonTitle
	) {
		List<ReadLessonResponseDto> response = lessonService.readDetailChapter(lessonNumber, lessonTitle);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/chapters/search/all")
	public ResponseEntity<List<ChapterResponseDto>> searchAllChapters() {
		List<ChapterResponseDto> response = chapterService.findAll();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/section/{sectionId}")
	public ResponseEntity<ReadSectionResponseDto> searchSection(
		@PathVariable Long sectionId
	) {
		ReadSectionResponseDto responseDto = sectionService.readSection(sectionId);

		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/search/keywords")
	public ResponseEntity<List<ReadKeywordResponseDto>> searchKeyword(
		@RequestParam String keyword
	) {
		List<ReadKeywordResponseDto> response = keywordService.searchKeywords(keyword);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/create/keyword")
	public ResponseEntity<CreateKeywordResponseDto> createKeyword(
		@RequestParam String topicTitle,
		@RequestBody CreateKeywordRequestDto requestDto
	) {

		CreateKeywordResponseDto response = keywordService.createKeyword(topicTitle, requestDto);

		return ResponseEntity.ok(response);
	}

	@PostMapping("/search/chapters")
	public ResponseEntity<ChapterResponseDto> searchChapters(
		@RequestBody ChapterSearchRequestDto requestDto
	) {
		return ResponseEntity.ok(chapterService.findChapterWithDetails(requestDto.getChapterTitle()));
	}

	@PostMapping("/create/chapter")
	public ResponseEntity<List<CreateChapterResponseDto>> createChapter(
		@RequestBody List<CreateChapterRequestDto> requestDtos
	) {
		List<CreateChapterResponseDto> response = chapterService.createChapters(requestDtos);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/chapters/{chapterId}/details")
	public ResponseEntity<CreateLessonResponseDto> addLesson(
		@PathVariable Long chapterId,
		@RequestBody CreateLessonRequestDto requestDto
	) {
		CreateLessonResponseDto responseDto = lessonService.createLesson(chapterId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto); // 생성 성공을 의미하는 201 Created 응답.
	}

	@PatchMapping("/keyword/update/{keywordId}")
	public ResponseEntity<PatchKeywordResponseDto> updateKeyword(
		@PathVariable Long keywordId,
		@RequestBody PatchKeywordRequestDto requestDto
	) {
		PatchKeywordResponseDto response = keywordService.updateKeyword(keywordId, requestDto);
		return ResponseEntity.ok(response);
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

	@PatchMapping("/chapter/lesson/{id}/title")
	public ResponseEntity<PatchLessonTitleResponseDto> patchLessonTitle(
		@PathVariable Long id,
		@RequestBody PatchLessonTitleRequestDto requestDto
	) {
		PatchLessonTitleResponseDto responseDto = lessonService.updateLessonTitle(id, requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@PatchMapping("/chapter/lesson/{id}/number")
	public ResponseEntity<PatchLessonNumberResponseDto> patchLessonNumber(
		@PathVariable Long id,
		@RequestBody PatchLessonNumberRequestDto requestDto
	) {
		PatchLessonNumberResponseDto response = lessonService.updateLessonNumber(id, requestDto);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/create/section/{lessonId}")
	public ResponseEntity<CreateSectionResponseDto> createSection(
		@PathVariable Long lessonId,
		@RequestBody CreateSectionRequestDto requestDto
	) {
		CreateSectionResponseDto response = sectionService.createSection(lessonId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/create/subsection/{sectionId}")
	public ResponseEntity<CreateSubsectionResponseDto> createSubsection(
		@PathVariable Long sectionId,
		@RequestBody CreateSubsectionRequestDto requestDto
	) {
		CreateSubsectionResponseDto response = subsectionService.createSubsection(sectionId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/chapters/{id}")
	public ResponseEntity<Void> deleteChapter(
		@PathVariable Long id) {
		chapterService.deleteChapter(id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@DeleteMapping("/delete/keyword/{keywordId}")
	public ResponseEntity<DeleteKeywordResponseDto> deleteKeyword(
		@PathVariable Long keywordId,
		@RequestBody DeleteKeywordRequestDto requestDto
	) {
		DeleteKeywordResponseDto response = keywordService.deleteKeyword(keywordId, requestDto);
		return ResponseEntity.ok(response);
	}
}

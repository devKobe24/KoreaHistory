package com.kobe.koreahistory.controller;

import com.kobe.koreahistory.dto.request.chapter.ChapterSearchRequestDto;
import com.kobe.koreahistory.dto.request.chapter.CreateChapterRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterNumberRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterTitleRequestDto;
import com.kobe.koreahistory.dto.request.keyword.CreateKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.DeleteKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.PatchKeywordNumberRequestDto;
import com.kobe.koreahistory.dto.request.keyword.PatchKeywordRequestDto;
import com.kobe.koreahistory.dto.request.lesson.CreateLessonRequestDto;
import com.kobe.koreahistory.dto.request.lesson.PatchLessonNumberRequestDto;
import com.kobe.koreahistory.dto.request.lesson.PatchLessonTitleRequestDto;
import com.kobe.koreahistory.dto.request.section.CreateSectionRequestDto;
import com.kobe.koreahistory.dto.request.section.PatchSectionNumberRequestDto;
import com.kobe.koreahistory.dto.request.section.PatchSectionTitleRequestDto;
import com.kobe.koreahistory.dto.request.subsection.CreateSubsectionRequestDto;
import com.kobe.koreahistory.dto.request.subsection.PatchSubsectionNumberRequestDto;
import com.kobe.koreahistory.dto.request.subsection.PatchSubsectionTitleRequestDto;
import com.kobe.koreahistory.dto.request.topic.CreateTopicRequestDto;
import com.kobe.koreahistory.dto.request.topic.PatchTopicTitleRequestDto;
import com.kobe.koreahistory.dto.request.topic.PatchTopicNumberRequestDto;
import com.kobe.koreahistory.dto.response.chapter.ChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.CreateChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterNumberResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterTitleResponseDto;
import com.kobe.koreahistory.dto.response.keyword.*;
import com.kobe.koreahistory.dto.response.lesson.*;
import com.kobe.koreahistory.dto.response.section.CreateSectionResponseDto;
import com.kobe.koreahistory.dto.response.section.PatchSectionNumberResponseDto;
import com.kobe.koreahistory.dto.response.section.PatchSectionTitleResponseDto;
import com.kobe.koreahistory.dto.response.section.ReadSectionResponseDto;
import com.kobe.koreahistory.dto.response.subsection.ReadSubsectionResponseDto;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import com.kobe.koreahistory.dto.response.subsection.PatchSubsectionNumberResponseDto;
import com.kobe.koreahistory.dto.response.subsection.PatchSubsectionTitleResponseDto;
import com.kobe.koreahistory.dto.response.topic.ReadTopicResponseDto;
import com.kobe.koreahistory.dto.response.topic.CreateTopicResponseDto;
import com.kobe.koreahistory.dto.response.topic.PatchTopicTitleResponseDto;
import com.kobe.koreahistory.dto.response.topic.PatchTopicNumberResponseDto;
import com.kobe.koreahistory.dto.request.content.CreateContentRequestDto;
import com.kobe.koreahistory.dto.request.content.UpdateContentRequestDto;
import com.kobe.koreahistory.dto.response.content.ReadContentResponseDto;
import com.kobe.koreahistory.dto.response.content.CreateContentResponseDto;
import com.kobe.koreahistory.dto.response.content.UpdateContentResponseDto;
import com.kobe.koreahistory.dto.response.content.LearningPageResponseDto;
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
	private final TopicService topicService;
	private final ContentService contentService;

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

	@GetMapping("/sections/search/all")
	public ResponseEntity<List<ReadSectionResponseDto>> searchAllSections() {
		List<ReadSectionResponseDto> response = sectionService.findAllSections();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/subsections/search/all")
	public ResponseEntity<List<ReadSubsectionResponseDto>> searchAllSubsections() {
		List<ReadSubsectionResponseDto> response = subsectionService.findAllSubsections();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/subsection/{subsectionId}")
	public ResponseEntity<ReadSubsectionResponseDto> searchSubsection(
		@PathVariable Long subsectionId
	) {
		ReadSubsectionResponseDto responseDto = subsectionService.readSubsection(subsectionId);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/topics/search/all")
	public ResponseEntity<List<ReadTopicResponseDto>> searchAllTopics() {
		List<ReadTopicResponseDto> response = topicService.findAllTopics();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/topic/{topicId}")
	public ResponseEntity<ReadTopicResponseDto> searchTopic(
		@PathVariable Long topicId
	) {
		ReadTopicResponseDto responseDto = topicService.readTopic(topicId);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/search/keywords")
	public ResponseEntity<List<ReadKeywordResponseDto>> searchKeyword(
		@RequestParam String keyword
	) {
		List<ReadKeywordResponseDto> response = keywordService.searchKeywords(keyword);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/chapters")
	public ResponseEntity<List<ChapterResponseDto>> searchChaptersByTitle(
		@RequestParam String title
	) {
		List<ChapterResponseDto> response = chapterService.searchChaptersByTitle(title);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/contents")
	public ResponseEntity<List<ReadContentResponseDto>> searchContentsByDetail(
		@RequestParam String detail
	) {
		List<ReadContentResponseDto> response = contentService.searchContentsByDetail(detail);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/lessons")
	public ResponseEntity<List<ReadLessonResponseDto>> searchLessonsByTitle(
		@RequestParam String title
	) {
		List<ReadLessonResponseDto> response = lessonService.searchLessonsByTitle(title);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/sections")
	public ResponseEntity<List<ReadSectionResponseDto>> searchSectionsByTitle(
		@RequestParam String title
	) {
		List<ReadSectionResponseDto> response = sectionService.searchSectionsByTitle(title);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/subsections")
	public ResponseEntity<List<ReadSubsectionResponseDto>> searchSubsectionsByTitle(
		@RequestParam String title
	) {
		List<ReadSubsectionResponseDto> response = subsectionService.searchSubsectionsByTitle(title);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/topics")
	public ResponseEntity<List<ReadTopicResponseDto>> searchTopicsByTitle(
		@RequestParam String title
	) {
		List<ReadTopicResponseDto> response = topicService.searchTopicsByTitle(title);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/keywords/combination")
	public ResponseEntity<List<ReadKeywordResponseDto>> searchKeywordCombination(
		@RequestParam List<String> keywords
	) {
		List<ReadKeywordResponseDto> response = keywordService.searchKeywordsByCombination(keywords);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/keywords/search/all")
	public ResponseEntity<List<ReadKeywordResponseDto>> searchAllKeywords() {
		List<ReadKeywordResponseDto> response = keywordService.findAllKeywords();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/lessons/search/all")
	public ResponseEntity<List<ReadLessonResponseDto>> searchAllLessons() {
		List<ReadLessonResponseDto> response = lessonService.findAllLessons();
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

	@PatchMapping("/keywords/{keywordId}/update")
	public ResponseEntity<PatchKeywordResponseDto> updateKeyword(
		@PathVariable Long keywordId,
		@RequestBody PatchKeywordRequestDto requestDto
	) {
		PatchKeywordResponseDto response = keywordService.updateKeyword(keywordId, requestDto);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/keyword/number/{keywordId}/update")
	public ResponseEntity<PatchKeywordNumberResponseDto> updateKeywordNumber(
		@PathVariable Long keywordId,
		@RequestBody PatchKeywordNumberRequestDto requestDto
	) {
		PatchKeywordNumberResponseDto response = keywordService.updateKeywordNumber(keywordId, requestDto);
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

	@PatchMapping("/section/{sectionId}/number")
	public ResponseEntity<PatchSectionNumberResponseDto> patchSectionNumber(
		@PathVariable Long sectionId,
		@RequestBody PatchSectionNumberRequestDto requestDto
	) {
		PatchSectionNumberResponseDto response = sectionService.updateSectionNumber(sectionId, requestDto);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/section/{sectionId}/title")
	public ResponseEntity<PatchSectionTitleResponseDto> patchSectionTitle(
		@PathVariable Long sectionId,
		@RequestBody PatchSectionTitleRequestDto requestDto
	) {
		PatchSectionTitleResponseDto response = sectionService.updateSectionTitle(sectionId, requestDto);
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

	@PostMapping("/create/topic/{subsectionId}")
	public ResponseEntity<CreateTopicResponseDto> createTopic(
		@PathVariable Long subsectionId,
		@RequestBody CreateTopicRequestDto requestDto
	) {
		CreateTopicResponseDto response = topicService.createTopic(subsectionId, requestDto);
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

	@DeleteMapping("/lesson/{lessonId}")
	public ResponseEntity<Void> deleteLesson(
		@PathVariable Long lessonId
	) {
		lessonService.deleteLesson(lessonId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@DeleteMapping("/keyword/group/{id}")
	public ResponseEntity<Void> deleteKeywordGroup(
		@PathVariable Long id
	) {
		keywordService.deleteKeywordGroup(id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@DeleteMapping("/section/{sectionId}")
	public ResponseEntity<Void> deleteSection(
		@PathVariable Long sectionId
	) {
		sectionService.deleteSection(sectionId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@PatchMapping("/topic/{topicId}/title")
	public ResponseEntity<PatchTopicTitleResponseDto> patchTopicTitle(
		@PathVariable Long topicId,
		@RequestBody PatchTopicTitleRequestDto requestDto
	) {
		PatchTopicTitleResponseDto response = topicService.updateTopicTitle(topicId, requestDto);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/topic/{topicId}/number")
	public ResponseEntity<PatchTopicNumberResponseDto> patchTopicNumber(
		@PathVariable Long topicId,
		@RequestBody PatchTopicNumberRequestDto requestDto
	) {
		PatchTopicNumberResponseDto response = topicService.updateTopicNumber(topicId, requestDto);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/subsection/{subsectionId}/number")
	public ResponseEntity<PatchSubsectionNumberResponseDto> patchSubsectionNumber(
		@PathVariable Long subsectionId,
		@RequestBody PatchSubsectionNumberRequestDto requestDto
	) {
		PatchSubsectionNumberResponseDto response = subsectionService.updateSubsectionNumber(subsectionId, requestDto);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/subsection/{subsectionId}/title")
	public ResponseEntity<PatchSubsectionTitleResponseDto> patchSubsectionTitle(
		@PathVariable Long subsectionId,
		@RequestBody PatchSubsectionTitleRequestDto requestDto
	) {
		PatchSubsectionTitleResponseDto response = subsectionService.updateSubsectionTitle(subsectionId, requestDto);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/subsection/{subsectionId}")
	public ResponseEntity<Void> deleteSubsection(
		@PathVariable Long subsectionId
	) {
		subsectionService.deleteSubsection(subsectionId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@DeleteMapping("/topic/{topicId}")
	public ResponseEntity<Void> deleteTopic(
		@PathVariable Long topicId
	) {
		topicService.deleteTopic(topicId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@GetMapping("/contents/search/all")
	public ResponseEntity<List<ReadContentResponseDto>> searchAllContents() {
		List<ReadContentResponseDto> response = contentService.findAllContents();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/content/{contentId}")
	public ResponseEntity<ReadContentResponseDto> searchContent(
		@PathVariable Long contentId
	) {
		ReadContentResponseDto responseDto = contentService.readContent(contentId);
		return ResponseEntity.ok(responseDto);
	}

	@PostMapping("/create/content/{keywordId}")
	public ResponseEntity<CreateContentResponseDto> createContent(
		@PathVariable Long keywordId,
		@RequestBody CreateContentRequestDto requestDto
	) {
		CreateContentResponseDto response = contentService.createContent(keywordId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PatchMapping("/content/{contentId}")
	public ResponseEntity<UpdateContentResponseDto> updateContent(
		@PathVariable Long contentId,
		@RequestBody UpdateContentRequestDto requestDto
	) {
		UpdateContentResponseDto response = contentService.updateContent(contentId, requestDto);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/content/{contentId}")
	public ResponseEntity<Void> deleteContent(
		@PathVariable Long contentId
	) {
		contentService.deleteContent(contentId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@GetMapping("/learning/topic/{topicId}")
	public ResponseEntity<LearningPageResponseDto> getLearningPageByTopic(
		@PathVariable Long topicId
	) {
		LearningPageResponseDto response = contentService.getLearningPageByTopicId(topicId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/learning/subsection/{subsectionId}")
	public ResponseEntity<LearningPageResponseDto> getLearningPageBySubsection(
		@PathVariable Long subsectionId
	) {
		LearningPageResponseDto response = contentService.getLearningPageBySubsectionId(subsectionId);
		return ResponseEntity.ok(response);
	}
}

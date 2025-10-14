package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.*;
import com.kobe.koreahistory.dto.request.chapter.CreateChapterRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterNumberRequestDto;
import com.kobe.koreahistory.dto.request.chapter.PatchChapterTitleRequestDto;
import com.kobe.koreahistory.dto.response.chapter.ChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.CreateChapterResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterNumberResponseDto;
import com.kobe.koreahistory.dto.response.chapter.PatchChapterTitleResponseDto;
import com.kobe.koreahistory.repository.ChapterRepository;
import com.kobe.koreahistory.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : ChapterService
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자 자동 주입
public class ChapterService {

	private final ChapterRepository chapterRepository;
	private final KeywordRepository keywordRepository;

	@Transactional(readOnly = true)
	public List<ChapterResponseDto> findAll() {
		List<Chapter> results = chapterRepository.findAll();

		return results.stream()
			.map(ChapterResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public ChapterResponseDto findChapterWithDetails(String chapterTitle) {
		Chapter chapter = chapterRepository.findByChapterTitleWithDetails(chapterTitle)
			.orElseThrow(() -> new IllegalArgumentException("해당 챕터를 찾을 수 없습니다. name =" + chapterTitle));
		// ChapterResponseDto가 LessonResponseDto를,
		// LessonResponseDto가 SectionResponseDto를 연쇄적으로 호출하여 반환을 완료합니다.
		return new ChapterResponseDto(chapter);
	}

	@Transactional
	public List<CreateChapterResponseDto> createChapters(List<CreateChapterRequestDto> requestDtos) {
		// 1. DTO로부터 새로운 Chapter Entity를 생성합니다.
		List<Chapter> chapters = requestDtos.stream()
			.map(chapterDto -> {
				// Chapter 생성
				Chapter newChapter = Chapter.builder()
					.chapterNumber(chapterDto.getChapterNumber())
					.chapterTitle(chapterDto.getChapterTitle())
					.build();

				// Chapter에 속한 Lesson들 생성
				List<Lesson> lessons = chapterDto.getLessons().stream()
					.map(lessonDto -> {
						// Lesson 생성 (부모 Chapter 설정)
						Lesson newLesson = Lesson.builder()
							.lessonNumber(lessonDto.getLessonNumber())
							.lessonTitle(lessonDto.getLessonTitle())
							.chapter(newChapter)
							.build();

						// Lesson에 속한 Section들 생성
						List<Section> sections = lessonDto.getSections().stream()
							.map(sectionDto -> {
								// Section 생성 (부모 Lesson 설정)
								Section newSection = Section.builder()
									.sectionNumber(sectionDto.getSectionNumber())
									.sectionTitle(sectionDto.getSectionTitle())
									.lesson(newLesson)
									.build();

								// Section에 속한 Subsection들 생성
								List<Subsection> subsections = sectionDto.getSubsections().stream()
									.map(subsectionDto -> {
										// Subsection 생성 (부모 Section 설정)
										Subsection newSubsection = Subsection.builder()
											.subsectionNumber(subsectionDto.getSubsectionNumber())
											.subsectionTitle(subsectionDto.getSubsectionTitle())
											.section(newSection)
											.build();

										// Subsection에 속한 Topic들 생성
										List<Topic> topics = subsectionDto.getTopics().stream()
											.map(topicDto -> {
												// Topic 생성 (부모 Subsection 설정)
												Topic newTopic = Topic.builder()
													.topicNumber(topicDto.getTopicNumber())
													.topicTitle(topicDto.getTopicTitle())
													.subsection(newSubsection)
													.build();

												// Topic에 속한 Keyword들 생성
												List<Keyword> keywords = topicDto.getKeywords().stream()
													.map(keywordDto -> Keyword.builder()
														.keywordNumber(keywordDto.getKeywordNumber())
														.keywords(keywordDto.getKeywords())
														.topic(newTopic)
														.build())
													.collect(Collectors.toList());

												// Topic에 Keyword 리스트 추가
												newTopic.getKeywords().addAll(keywords);
												return newTopic;
											})
											.collect(Collectors.toList());

										// Subsection에 Topic 리스트 추가
										newSubsection.getTopics().addAll(topics);
										return newSubsection;
									})
									.collect(Collectors.toList());

								// Section에 Subsection 리스트 추가
								newSection.getSubsections().addAll(subsections);
								return newSection;
							})
							.collect(Collectors.toList());

						// Lesson에 Section 리스트 추가
						newLesson.getSections().addAll(sections);
						return newLesson;
					})
					.collect(Collectors.toList());

				// Chapter에 Lesson 리스트 추가
				newChapter.getLessons().addAll(lessons);
				return newChapter;
			})
			.collect(Collectors.toList());

		// 2. Repository를 통해 모든 Chapter들을 한 번에 저장합니다.
		// Cascade 설정에 의해 하위의 Lesson과 Section들도 모두 함께 저장됩니다.
		List<Chapter> savedChapters = chapterRepository.saveAll(chapters);

		// 3. 저장된 결과를 Response DTO 리스트로 변환하여 변환합니다.
		return savedChapters.stream()
			.map(CreateChapterResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional
	public PatchChapterNumberResponseDto updateChapterNumber(Long chapterId, PatchChapterNumberRequestDto requestDto) {
		// 1. ID로 수정할 Chapter를 조회
		Chapter chapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("해당 챕터를 찾을 수 없습니다."));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		chapter.updateChapterNumber(requestDto.getChapterNumber());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환
		return new PatchChapterNumberResponseDto(chapter);
	}

	@Transactional
	public PatchChapterTitleResponseDto updateChapterTitle(Long chapterId, PatchChapterTitleRequestDto requestDto) {
		// 1. ID로 수정할 Chapter 조회
		Chapter chapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("chapter not found"));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		chapter.updateChapterTitle(requestDto.getChapterTitle());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환.
		return new PatchChapterTitleResponseDto(chapter);
	}

	@Transactional
	public void deleteChapter(Long chapterId) {
		chapterRepository.deleteById(chapterId);
	}
}

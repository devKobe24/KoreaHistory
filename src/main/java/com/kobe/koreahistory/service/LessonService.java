package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.dto.request.CreateLessonRequestDto;
import com.kobe.koreahistory.dto.request.PatchLessonTitleRequestDto;
import com.kobe.koreahistory.dto.response.CreateLessonResponseDto;
import com.kobe.koreahistory.dto.response.PatchLessonTitleResponseDto;
import com.kobe.koreahistory.dto.response.ReadLessonResponseDto;
import com.kobe.koreahistory.repository.ChapterRepository;
import com.kobe.koreahistory.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : DetailChapterService
 * author         : kobe
 * date           : 2025. 10. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 9.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor
public class LessonService {

	private final ChapterRepository chapterRepository;
	private final LessonRepository lessonRepository;

	@Transactional
	public CreateLessonResponseDto createLesson(Long chapterId, CreateLessonRequestDto requestDto) {
		// 1. 부모 Chapter를 ID로 조회합니다.
		Chapter parentChapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("해당 대분류 챕터를 찾을 수 없습니다."));

		// 2. DTO와 부모 Chapter를 사용하여 새로운 DetailChapter Entity를 생성합니다.
		Lesson newLesson = Lesson.builder()
			.lessonNumber(requestDto.getLessonNumber())
			.lessonTitle(requestDto.getLessonTitle())
			.chapter(parentChapter) // 연관관계 설정
			.build();

		// 3. 생성된 DetailChapter를 저장합니다.
		Lesson savedLesson = lessonRepository.save(newLesson);

		// 4. 저장된 결과를 DTO로 변환하여 반환합니다.
		return new CreateLessonResponseDto(savedLesson);
	}

	@Transactional
	public PatchLessonTitleResponseDto updateLessonTitle(Long lessonId, PatchLessonTitleRequestDto requestDto) {
		// 1. ID로 수정할 Chapter 조회
		Lesson lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new IllegalArgumentException("소분류 챕터를 찾을 수 없습니다."));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		lesson.updateLesson(requestDto.getToChangeLessonTitle());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환.
		return new PatchLessonTitleResponseDto(lesson);
	}

	@Transactional(readOnly = true)
	public List<ReadLessonResponseDto> readDetailChapter(Integer lessonNumber, String lessonTitle) {
		List<Lesson> result = lessonRepository.searchByNumberOrTitle(lessonNumber, lessonTitle);

		return result.stream()
			.map(ReadLessonResponseDto::new)
			.collect(Collectors.toList());
	}
}

package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.dto.request.section.CreateSectionRequestDto;
import com.kobe.koreahistory.dto.request.section.PatchSectionNumberRequestDto;
import com.kobe.koreahistory.dto.request.section.PatchSectionTitleRequestDto;
import com.kobe.koreahistory.dto.response.section.CreateSectionResponseDto;
import com.kobe.koreahistory.dto.response.section.PatchSectionNumberResponseDto;
import com.kobe.koreahistory.dto.response.section.PatchSectionTitleResponseDto;
import com.kobe.koreahistory.dto.response.section.ReadSectionResponseDto;
import com.kobe.koreahistory.repository.LessonRepository;
import com.kobe.koreahistory.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : SectionService
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor
public class SectionService {
	private final LessonRepository lessonRepository;
	private final SectionRepository sectionRepository;

	@Transactional
	public CreateSectionResponseDto createSection(Long lessonId, CreateSectionRequestDto requestDto) {
		// 1. 부모 Lesson을 ID로 조회합니다.
		Lesson parentLesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new IllegalArgumentException("lesson not found"));

		// 2. DTO와 부모 Lesson을 사용하여 새로운 Section Entity를 생성합니다.
		Section newSection = Section.builder()
			.sectionNumber(requestDto.getSectionNumber())
			.sectionTitle(requestDto.getSectionTitle())
			.lesson(parentLesson)
			.build();

		// 3. 생성된 Section를 저장.
		Section savedSection = sectionRepository.save(newSection);

		// 4. 저장된 결과 DTO로 변환하여 반환
		return new CreateSectionResponseDto(savedSection);
	}

	@Transactional(readOnly = true)
	public ReadSectionResponseDto readSection(Long sectionId) {
		Section section = sectionRepository.findById(sectionId)
			.orElseThrow(() -> new IllegalArgumentException("section not found"));

		return new ReadSectionResponseDto(section);
	}

	@Transactional
	public PatchSectionNumberResponseDto updateSectionNumber(Long sectionId, PatchSectionNumberRequestDto requestDto) {
		Section section = sectionRepository.findById(sectionId)
			.orElseThrow(() -> new IllegalArgumentException("section not found"));

		section.updateSectionNumber(requestDto.getSectionNumber());

		return new PatchSectionNumberResponseDto(section);
	}

	@Transactional
	public PatchSectionTitleResponseDto updateSectionTitle(Long sectionId, PatchSectionTitleRequestDto requestDto) {
		Section section = sectionRepository.findById(sectionId)
			.orElseThrow(() -> new IllegalArgumentException("section not found"));

		section.updateSectionTitle(requestDto.getSectionTitle());

		return new PatchSectionTitleResponseDto(section);
	}

	@Transactional
	public void deleteSection(Long sectionId) {
		sectionRepository.deleteById(sectionId);
	}
}

package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.dto.request.subsection.CreateSubsectionRequestDto;
import com.kobe.koreahistory.dto.request.subsection.PatchSubsectionNumberRequestDto;
import com.kobe.koreahistory.dto.request.subsection.PatchSubsectionTitleRequestDto;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import com.kobe.koreahistory.dto.response.subsection.PatchSubsectionNumberResponseDto;
import com.kobe.koreahistory.dto.response.subsection.PatchSubsectionTitleResponseDto;
import com.kobe.koreahistory.dto.response.subsection.ReadSubsectionResponseDto;
import com.kobe.koreahistory.repository.SectionRepository;
import com.kobe.koreahistory.repository.SubsectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : SubsectionService
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
public class SubsectionService {

	private final SectionRepository sectionRepository;
	private final SubsectionRepository subsectionRepository;

	@Transactional
	public CreateSubsectionResponseDto createSubsection(Long sectionId, CreateSubsectionRequestDto requestDto) {
		Section parentSection = sectionRepository.findById(sectionId)
			.orElseThrow(() -> new IllegalArgumentException("section not found"));

		Subsection newSubsection = Subsection.builder()
			.subsectionNumber(requestDto.getSubsectionNumber())
			.subsectionTitle(requestDto.getSubsectionTitle())
			.section(parentSection)
			.build();

		Subsection savedSubsection = subsectionRepository.save(newSubsection);

		return new CreateSubsectionResponseDto(savedSubsection);
	}

	@Transactional(readOnly = true)
	public List<ReadSubsectionResponseDto> findAllSubsections() {
		List<Subsection> subsections = subsectionRepository.findAllWithSectionAndLesson();
		return subsections.stream()
			.map(ReadSubsectionResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public ReadSubsectionResponseDto readSubsection(Long subsectionId) {
		Subsection subsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		return new ReadSubsectionResponseDto(subsection);
	}

	@Transactional(readOnly = true)
	public List<ReadSubsectionResponseDto> searchSubsectionsByTitle(String title) {
		List<Subsection> subsections = subsectionRepository.findBySubsectionTitleContainingIgnoreCase(title);
		return subsections.stream()
			.map(ReadSubsectionResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional
	public PatchSubsectionNumberResponseDto updateSubsectionNumber(Long subsectionId, PatchSubsectionNumberRequestDto requestDto) {
		Subsection subsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		subsection.updateSubsectionNumber(requestDto.getSubsectionNumber());

		return new PatchSubsectionNumberResponseDto(subsection);
	}

	@Transactional
	public PatchSubsectionTitleResponseDto updateSubsectionTitle(Long subsectionId, PatchSubsectionTitleRequestDto requestDto) {
		Subsection subsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		subsection.updateSubsectionTitle(requestDto.getSubsectionTitle());

		return new PatchSubsectionTitleResponseDto(subsection);
	}

	@Transactional
	public void deleteSubsection(Long subsectionId) {
		Subsection subsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		subsectionRepository.delete(subsection);
	}
}

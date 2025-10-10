package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.dto.request.subsection.CreateSubsectionRequestDto;
import com.kobe.koreahistory.dto.response.subsection.CreateSubsectionResponseDto;
import com.kobe.koreahistory.repository.SectionRepository;
import com.kobe.koreahistory.repository.SubsectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}

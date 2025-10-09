package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.DetailChapter;
import com.kobe.koreahistory.dto.request.CreateDetailChapterRequestDto;
import com.kobe.koreahistory.dto.request.PatchChapterDetailTitleRequestDto;
import com.kobe.koreahistory.dto.response.ChapterDetailTitlePatchResponseDto;
import com.kobe.koreahistory.dto.response.CreateDetailChapterResponseDto;
import com.kobe.koreahistory.repository.DetailChapterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class DetailChapterService {

	private final DetailChapterRepository detailChapterRepository;

	@Transactional
	public CreateDetailChapterResponseDto createDetailChapter(CreateDetailChapterRequestDto requestDto) {
		DetailChapter newDetailChapter = DetailChapter.builder()
			.number(requestDto.getDetailChapterNumber())
			.title(requestDto.getDetailChapterTitle())
			.build();

		DetailChapter savedDetailChapter = detailChapterRepository.save(newDetailChapter);

		return new CreateDetailChapterResponseDto(savedDetailChapter);
	}

	@Transactional
	public ChapterDetailTitlePatchResponseDto updateChapterDetailTitle(Long detailChapterId, PatchChapterDetailTitleRequestDto requestDto) {
		// 1. ID로 수정할 Chapter 조회
		DetailChapter detailChapter = detailChapterRepository.findById(detailChapterId)
			.orElseThrow(() -> new IllegalArgumentException("소분류 챕터를 찾을 수 없습니다."));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		detailChapter.updateChapterDetail(requestDto.getToChangeDetailTitle());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환.
		return new ChapterDetailTitlePatchResponseDto(detailChapter);
	}
}

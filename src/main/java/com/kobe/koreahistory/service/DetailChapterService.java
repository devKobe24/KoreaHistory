package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.DetailChapter;
import com.kobe.koreahistory.dto.request.CreateDetailChapterRequestDto;
import com.kobe.koreahistory.dto.request.PatchChapterDetailTitleRequestDto;
import com.kobe.koreahistory.dto.response.CreateDetailChapterResponseDto;
import com.kobe.koreahistory.dto.response.PatchChapterDetailTitleResponseDto;
import com.kobe.koreahistory.dto.response.ReadDetailChapterResponseDto;
import com.kobe.koreahistory.repository.ChapterRepository;
import com.kobe.koreahistory.repository.DetailChapterRepository;
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
public class DetailChapterService {

	private final ChapterRepository chapterRepository;
	private final DetailChapterRepository detailChapterRepository;

	@Transactional
	public CreateDetailChapterResponseDto createDetailChapter(Long chapterId, CreateDetailChapterRequestDto requestDto) {
		// 1. 부모 Chapter를 ID로 조회합니다.
		Chapter parentChapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("해당 대분류 챕터를 찾을 수 없습니다."));

		// 2. DTO와 부모 Chapter를 사용하여 새로운 DetailChapter Entity를 생성합니다.
		DetailChapter newDetailChapter = DetailChapter.builder()
			.number(requestDto.getDetailChapterNumber())
			.title(requestDto.getDetailChapterTitle())
			.chapter(parentChapter) // 연관관계 설정
			.build();

		// 3. 생성된 DetailChapter를 저장합니다.
		DetailChapter savedDetailChapter = detailChapterRepository.save(newDetailChapter);

		// 4. 저장된 결과를 DTO로 변환하여 반환합니다.
		return new CreateDetailChapterResponseDto(savedDetailChapter);
	}

	@Transactional
	public PatchChapterDetailTitleResponseDto updateChapterDetailTitle(Long detailChapterId, PatchChapterDetailTitleRequestDto requestDto) {
		// 1. ID로 수정할 Chapter 조회
		DetailChapter detailChapter = detailChapterRepository.findById(detailChapterId)
			.orElseThrow(() -> new IllegalArgumentException("소분류 챕터를 찾을 수 없습니다."));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		detailChapter.updateChapterDetail(requestDto.getToChangeDetailTitle());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환.
		return new PatchChapterDetailTitleResponseDto(detailChapter);
	}

	@Transactional(readOnly = true)
	public List<ReadDetailChapterResponseDto> readDetailChapter(Integer detailChapterNumber, String detailChapterTitle) {
		List<DetailChapter> result = detailChapterRepository.searchByNumberOrTitle(detailChapterNumber, detailChapterTitle);

		return result.stream()
			.map(ReadDetailChapterResponseDto::new)
			.collect(Collectors.toList());
	}
}

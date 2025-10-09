package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.DetailChapter;
import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.KeywordContent;
import com.kobe.koreahistory.dto.request.CreateChapterRequestDto;
import com.kobe.koreahistory.dto.request.PatchChapterNumberRequestDto;
import com.kobe.koreahistory.dto.request.PatchChapterTitleRequestDto;
import com.kobe.koreahistory.dto.response.*;
import com.kobe.koreahistory.repository.ChapterRepository;
import com.kobe.koreahistory.repository.KeywordContentRepository;
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
	private final KeywordContentRepository keywordContentRepository;


	@Transactional(readOnly = true)
	public ChapterResponseDto findChapterWithDetails(String chapterName) {
		Chapter chapter = chapterRepository.findByChapterTitle(chapterName)
			.orElseThrow(() -> new IllegalArgumentException("chapter not found"));

		return new ChapterResponseDto(chapter);
	}

	@Transactional(readOnly = true)
	public KeywordSearchResponseDto findKeywordWithContents(String searchKeyword) {
		Keyword keyword = keywordRepository.findByKeyword(searchKeyword)
			.orElseThrow(() -> new IllegalArgumentException("keyword not found"));

		return new KeywordSearchResponseDto(keyword);
	}

	@Transactional(readOnly = true)
	public KeywordContentSearchResponseDto findKeywordContentWithKeyword(String searchKeyword) {
		Keyword keyword = keywordRepository.findByKeyword(searchKeyword)
			.orElseThrow(() -> new IllegalArgumentException("keyword not found"));

		KeywordContent keywordAndContent = keywordContentRepository.findByKeyword(keyword)
			.orElseThrow(() -> new IllegalArgumentException("keyword and content not found"));

		return new KeywordContentSearchResponseDto(keywordAndContent);
	}

	@Transactional
	public ChapterCreateResponseDto createChapter(CreateChapterRequestDto requestDto) {
		// 1. DTO로부터 새로운 Chapter Entity를 생성합니다.
		Chapter newChapter = Chapter.builder()
			.chapterNumber(requestDto.getChapterNumber())
			.chapterTitle(requestDto.getChapterTitle())
			.build();

		// 2. DTO에 포함된 DetailChapter 정보들도 Entity로 변환합니다.
		// 이때, 각 DetailChapter가 부모인 newChapter를 참조하도록 설정합니다 (양방향 연관관계 편의 메서드 권장)
		List<DetailChapter> detailChapters = requestDto.getDetailChapters().stream()
			.map(detailDto -> DetailChapter.builder()
				.number(detailDto.getNumber())
				.title(detailDto.getTitle())
				.chapter(newChapter) // 부모(Chapter)를 설정
				.build())
			.collect(Collectors.toList());

		// 3. Chapter에 DetailChapter 리스트를 추가합니다.
		//    Cascade 설정에 의해 Chapter만 저장해도 DetailChapter들이 함께 저장됩니다.
		newChapter.getDetailChapters().addAll(detailChapters);

		// 4. Repository를 통해 Chapter를 저장합니다.
		Chapter savedChapter = chapterRepository.save(newChapter);

		// 5. 저장된 결과를 Response DTO로 변환하여 반환합니다.
		return new ChapterCreateResponseDto(savedChapter);
	}

	@Transactional
	public ChapterNumberPatchResponseDto updateChapterNumber(Long chapterId, PatchChapterNumberRequestDto requestDto) {
		// 1. ID로 수정할 Chapter를 조회
		Chapter chapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("해당 챕터를 찾을 수 없습니다."));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		chapter.updateChapterNumber(requestDto.getChapterNumber());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환
		return new ChapterNumberPatchResponseDto(chapter);
	}

	@Transactional
	public ChapterTitlePatchResponseDto updateChapterTitle(Long chapterId, PatchChapterTitleRequestDto requestDto) {
		// 1. ID로 수정할 Chapter 조회
		Chapter chapter = chapterRepository.findById(chapterId)
			.orElseThrow(() -> new IllegalArgumentException("chapter not found"));

		// 2. Entity의 비즈니스 메서드를 호출하여 상태를 변경함.
		chapter.updateChapterTitle(requestDto.getChapterTitle());

		// 3. 변경된 chapter 엔티티를 DTO로 변환하여 반환.
		return new ChapterTitlePatchResponseDto(chapter);
	}
}

package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.Topic;
import com.kobe.koreahistory.dto.request.keyword.CreateKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.DeleteKeywordRequestDto;
import com.kobe.koreahistory.dto.request.keyword.PatchKeywordNumberRequestDto;
import com.kobe.koreahistory.dto.request.keyword.PatchKeywordRequestDto;
import com.kobe.koreahistory.dto.response.keyword.*;
import com.kobe.koreahistory.repository.KeywordRepository;
import com.kobe.koreahistory.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : KeywordService
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor
public class KeywordService {

	private final KeywordRepository keywordRepository;
	private final TopicRepository topicRepository;

	@Transactional
	public CreateKeywordResponseDto createKeyword(String topicTitle, CreateKeywordRequestDto requestDto) {
		Topic parentTopic = topicRepository.findByTopicTitle(topicTitle)
			.orElseThrow(() -> new IllegalArgumentException("해당 Topic을 찾을 수 없습니다"));

		Keyword newKeyword = Keyword.builder()
			.keywordNumber(requestDto.getKeywordNumber())
			.keywords(requestDto.getKeywords())
			.topic(parentTopic)
			.build();

		Keyword result = keywordRepository.save(newKeyword);

		return new CreateKeywordResponseDto(result);
	}

	@Transactional(readOnly = true)
	public List<ReadKeywordResponseDto> searchKeywords(String keyword) {
		List<Keyword> result = keywordRepository.findByKeywordsContaining(keyword)
			.orElseThrow(() -> new IllegalArgumentException("해당 Keywords를 찾을 수 없습니다."));

		return result.stream()
			.map(ReadKeywordResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<ReadKeywordResponseDto> searchKeywordsByCombination(List<String> keywords) {
		// 각 키워드에 대해 검색 수행
		List<Keyword> allResults = new ArrayList<>();
		Set<Long> seenIds = new HashSet<>();
		
		for (String keyword : keywords) {
			List<Keyword> results = keywordRepository.findByKeywordsContaining(keyword)
				.orElse(new ArrayList<>());
			
			for (Keyword result : results) {
				if (!seenIds.contains(result.getId())) {
					allResults.add(result);
					seenIds.add(result.getId());
				}
			}
		}
		
		// 조합 검색: 모든 키워드가 포함된 결과만 필터링
		List<Keyword> combinationResults = allResults.stream()
			.filter(keyword -> {
				if (keyword.getKeywords() == null || keyword.getKeywords().isEmpty()) {
					return false;
				}
				
				// 모든 검색 키워드가 포함되어 있는지 확인
				return keywords.stream().allMatch(searchKeyword ->
					keyword.getKeywords().stream().anyMatch(keywordItem ->
						keywordItem.toLowerCase().contains(searchKeyword.toLowerCase())
					)
				);
			})
			.collect(Collectors.toList());
		
		// 조합 검색 결과가 있으면 반환, 없으면 개별 검색 결과 반환
		List<Keyword> finalResults = combinationResults.isEmpty() ? allResults : combinationResults;
		
		return finalResults.stream()
			.map(ReadKeywordResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional
	public PatchKeywordResponseDto updateKeyword(Long keywordId, PatchKeywordRequestDto requestDto) {
		// ID로 Update할 Keyword 조회
		Keyword keyword = keywordRepository.findById(keywordId)
			.orElseThrow(() -> new IllegalArgumentException("해당 Keyword를 찾을 수 없습니다."));

		// Entity의 비즈니스 메서드를 호출하여 상태 변경
		keyword.updateKeywords(requestDto.getKeywords());

		// 변경된 Keyword 엔티티를 DTO로 변환하여 반환
		return new PatchKeywordResponseDto(keyword);
	}

	@Transactional
	public PatchKeywordNumberResponseDto updateKeywordNumber(Long keywordId, PatchKeywordNumberRequestDto requestDto) {
		Keyword keyword = keywordRepository.findById(keywordId)
			.orElseThrow(() -> new IllegalArgumentException("해당 Keyword를 찾을 수 없습니다."));

		keyword.updateKeywordNumber(requestDto.getKeywordNumber());

		return new PatchKeywordNumberResponseDto(keyword);
	}

	@Transactional
	public DeleteKeywordResponseDto deleteKeyword(Long keywordId, DeleteKeywordRequestDto requestDto) {
		Keyword keyword = keywordRepository.findById(keywordId)
			.orElseThrow(() -> new IllegalArgumentException("해당 Keyword를 찾읗 수 없습니다."));

		keyword.deleteKeyword(requestDto.getTargetKeyword());

		return new DeleteKeywordResponseDto(keyword);
	}

	@Transactional
	public void deleteKeywordGroup(Long id) {
		keywordRepository.deleteById(id);
	}

	@Transactional(readOnly = true)
	public List<ReadKeywordResponseDto> findAllKeywords() {
		List<Keyword> keywords = keywordRepository.findAllWithTopic();
		return keywords.stream()
			.map(ReadKeywordResponseDto::new)
			.collect(Collectors.toList());
	}
}

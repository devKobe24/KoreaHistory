package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Content;
import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.dto.request.content.CreateContentRequestDto;
import com.kobe.koreahistory.dto.request.content.UpdateContentRequestDto;
import com.kobe.koreahistory.dto.response.content.CreateContentResponseDto;
import com.kobe.koreahistory.dto.response.content.ReadContentResponseDto;
import com.kobe.koreahistory.dto.response.content.UpdateContentResponseDto;
import com.kobe.koreahistory.repository.ContentRepository;
import com.kobe.koreahistory.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : ContentService
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Service
@RequiredArgsConstructor
public class ContentService {

	private final ContentRepository contentRepository;
	private final KeywordRepository keywordRepository;

	@Transactional
	public CreateContentResponseDto createContent(Long keywordId, CreateContentRequestDto requestDto) {
		Keyword parentKeyword = keywordRepository.findById(keywordId)
			.orElseThrow(() -> new IllegalArgumentException("keyword not found"));

		Content newContent = Content.builder()
			.details(requestDto.getDetails())
			.keyword(parentKeyword)
			.build();

		Content savedContent = contentRepository.save(newContent);

		return new CreateContentResponseDto(savedContent);
	}

	@Transactional(readOnly = true)
	public List<ReadContentResponseDto> findAllContents() {
		List<Content> contents = contentRepository.findAllWithKeywordAndTopic();
		return contents.stream()
			.map(ReadContentResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public ReadContentResponseDto readContent(Long contentId) {
		Content content = contentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));

		return new ReadContentResponseDto(content);
	}

	@Transactional
	public UpdateContentResponseDto updateContent(Long contentId, UpdateContentRequestDto requestDto) {
		Content content = contentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));

		content.updateDetails(requestDto.getDetails());
		Content savedContent = contentRepository.save(content);

		return new UpdateContentResponseDto(savedContent);
	}

	@Transactional
	public void deleteContent(Long contentId) {
		Content content = contentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));
		
		contentRepository.delete(content);
	}
}

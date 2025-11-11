package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.Content;
import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.domain.entity.Topic;
import com.kobe.koreahistory.dto.request.content.CreateContentRequestDto;
import com.kobe.koreahistory.dto.request.content.UpdateContentRequestDto;
import com.kobe.koreahistory.dto.response.content.ContentBlock;
import com.kobe.koreahistory.dto.response.content.CreateContentResponseDto;
import com.kobe.koreahistory.dto.response.content.LearningPageResponseDto;
import com.kobe.koreahistory.dto.response.content.ReadContentResponseDto;
import com.kobe.koreahistory.dto.response.content.UpdateContentResponseDto;
import com.kobe.koreahistory.dto.response.hierarchy.HierarchyResponseDto;
import com.kobe.koreahistory.repository.ContentRepository;
import com.kobe.koreahistory.repository.KeywordRepository;
import com.kobe.koreahistory.repository.SubsectionRepository;
import com.kobe.koreahistory.repository.TopicRepository;
import com.kobe.koreahistory.util.ContentBlockUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
	private final TopicRepository topicRepository;
	private final SubsectionRepository subsectionRepository;

	@Transactional
	public CreateContentResponseDto createContent(Long keywordId, CreateContentRequestDto requestDto) {
		Keyword parentKeyword = keywordRepository.findById(keywordId)
			.orElseThrow(() -> new IllegalArgumentException("keyword not found"));

		// 디버깅: 받은 데이터 확인
		System.out.println("=== Content 생성 디버깅 ===");
		System.out.println("keywordId: " + keywordId);
		System.out.println("requestDto.getContentNumber(): " + requestDto.getContentNumber());
		System.out.println("requestDto.getContentTitle(): " + requestDto.getContentTitle());
		System.out.println("requestDto.getDetails(): " + requestDto.getDetails());
		System.out.println("requestDto.getContentType(): " + requestDto.getContentType());
		System.out.println("requestDto.getBlockData(): " + requestDto.getBlockData());
		System.out.println("===========================");

		// 필수 필드 검증
		if (requestDto.getContentNumber() == null) {
			throw new IllegalArgumentException("Content 번호는 필수입니다. 받은 값: " + requestDto.getContentNumber());
		}
		if (requestDto.getContentTitle() == null || requestDto.getContentTitle().trim().isEmpty()) {
			throw new IllegalArgumentException("Content 제목은 필수입니다.");
		}

		Content newContent = Content.builder()
			.contentNumber(requestDto.getContentNumber())
			.contentTitle(requestDto.getContentTitle().trim())
			.details(requestDto.getDetails() != null ? requestDto.getDetails() : new ArrayList<>())
			.contentType(requestDto.getContentType())
			.blockData(requestDto.getBlockData())
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

	@Transactional(readOnly = true)
	public List<ReadContentResponseDto> searchContentsByDetail(String detail) {
		List<Content> contents = contentRepository.findByDetailsContainingIgnoreCase(detail);
		return contents.stream()
			.map(ReadContentResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional
	public UpdateContentResponseDto updateContent(Long contentId, UpdateContentRequestDto requestDto) {
		Content content = contentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));

		if (requestDto.getContentNumber() != null) {
			content.updateContentNumber(requestDto.getContentNumber());
		}
		if (requestDto.getContentTitle() != null && !requestDto.getContentTitle().trim().isEmpty()) {
			content.updateContentTitle(requestDto.getContentTitle());
		}
		if (requestDto.getDetails() != null) {
			content.updateDetails(requestDto.getDetails());
		}
		if (requestDto.getContentType() != null) {
			content.updateContentType(requestDto.getContentType());
		}
		if (requestDto.getBlockData() != null) {
			content.updateBlockData(requestDto.getBlockData());
		}
		
		Content savedContent = contentRepository.save(content);

		return new UpdateContentResponseDto(savedContent);
	}

	@Transactional
	public void deleteContent(Long contentId) {
		Content content = contentRepository.findById(contentId)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));
		
		contentRepository.delete(content);
	}

	@Transactional(readOnly = true)
	public LearningPageResponseDto getLearningPageByTopicId(Long topicId) {
		com.kobe.koreahistory.domain.entity.Topic topic = topicRepository.findById(topicId)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));

		List<Content> contents = contentRepository.findByTopicId(topicId);
		List<ContentBlock> blocks = convertToContentBlocks(contents);

		return new LearningPageResponseDto(topic.getTopicTitle(), blocks);
	}

	@Transactional(readOnly = true)
	public LearningPageResponseDto getLearningPageBySubsectionId(Long subsectionId) {
		com.kobe.koreahistory.domain.entity.Subsection subsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		List<Content> contents = contentRepository.findBySubsectionId(subsectionId);
		List<ContentBlock> blocks = convertToContentBlocks(contents);

		return new LearningPageResponseDto(subsection.getSubsectionTitle(), blocks);
	}

	private List<ContentBlock> convertToContentBlocks(List<Content> contents) {
		if (contents == null || contents.isEmpty()) {
			return List.of();
		}

		List<ContentBlock> blocks = new ArrayList<>();
		for (Content content : contents) {
			// Content가 contentType과 blockData를 가지고 있으면 변환
			if (content.getContentType() != null && content.getBlockData() != null) {
				try {
					ContentBlock block = ContentBlockUtil.fromJsonWithType(
						content.getBlockData(),
						content.getContentType()
					);
					blocks.add(block);
				} catch (Exception e) {
					// JSON 파싱 실패 시 빈 블록이나 기본 텍스트 블록으로 대체
					blocks.add(new com.kobe.koreahistory.dto.response.content.TextBlock(
						content.getContentTitle(),
						content.getDetails() != null && !content.getDetails().isEmpty() 
							? String.join(" ", content.getDetails()) 
							: ""
					));
				}
			} else if (content.getDetails() != null && !content.getDetails().isEmpty()) {
				// 기존 details 데이터를 TextBlock으로 변환 (마이그레이션 지원)
				blocks.add(new com.kobe.koreahistory.dto.response.content.TextBlock(
					content.getContentTitle(),
					String.join(" ", content.getDetails())
				));
			}
		}
		return blocks;
	}

	@Transactional(readOnly = true)
	public HierarchyResponseDto findContentHierarchyByTitle(String title) {
		Content content = contentRepository.findFirstByContentTitleIgnoreCase(title)
			.orElseThrow(() -> new IllegalArgumentException("content not found"));
		initializeContentHierarchy(content);
		return HierarchyResponseDto.fromContent(content);
	}

	private void initializeContentHierarchy(Content content) {
		if (content == null) {
			return;
		}

		Keyword keyword = content.getKeyword();
		if (keyword != null) {
			keyword.getKeywordTitle();

			Topic topic = keyword.getTopic();
			if (topic != null) {
				topic.getTopicTitle();

				Subsection subsection = topic.getSubsection();
				if (subsection != null) {
					subsection.getSubsectionTitle();

					Section section = subsection.getSection();
					if (section != null) {
						section.getSectionTitle();

						Lesson lesson = section.getLesson();
						if (lesson != null) {
							lesson.getLessonTitle();

							Chapter chapter = lesson.getChapter();
							if (chapter != null) {
								chapter.getChapterTitle();
							}
						}
					}
				}
			}
		}
	}
}

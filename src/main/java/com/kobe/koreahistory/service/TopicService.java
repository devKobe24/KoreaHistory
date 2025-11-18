package com.kobe.koreahistory.service;

import com.kobe.koreahistory.domain.entity.Chapter;
import com.kobe.koreahistory.domain.entity.Content;
import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.domain.entity.Lesson;
import com.kobe.koreahistory.domain.entity.Section;
import com.kobe.koreahistory.domain.entity.Subsection;
import com.kobe.koreahistory.domain.entity.Topic;
import com.kobe.koreahistory.dto.request.topic.CreateTopicRequestDto;
import com.kobe.koreahistory.dto.request.topic.PatchTopicNumberRequestDto;
import com.kobe.koreahistory.dto.request.topic.PatchTopicTitleRequestDto;
import com.kobe.koreahistory.dto.response.hierarchy.HierarchyResponseDto;
import com.kobe.koreahistory.dto.response.topic.CreateTopicResponseDto;
import com.kobe.koreahistory.dto.response.topic.PatchTopicNumberResponseDto;
import com.kobe.koreahistory.dto.response.topic.PatchTopicTitleResponseDto;
import com.kobe.koreahistory.dto.response.topic.ReadTopicResponseDto;
import com.kobe.koreahistory.repository.SubsectionRepository;
import com.kobe.koreahistory.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * packageName    : com.kobe.koreahistory.service
 * fileName       : TopicService
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
public class TopicService {

	private final SubsectionRepository subsectionRepository;
	private final TopicRepository topicRepository;

	@Transactional
	public CreateTopicResponseDto createTopic(Long subsectionId, CreateTopicRequestDto requestDto) {
		Subsection parentSubsection = subsectionRepository.findById(subsectionId)
			.orElseThrow(() -> new IllegalArgumentException("subsection not found"));

		Topic newTopic = Topic.builder()
			.topicNumber(requestDto.getTopicNumber())
			.topicTitle(requestDto.getTopicTitle())
			.subsection(parentSubsection)
			.build();

		Topic savedTopic = topicRepository.save(newTopic);

		return new CreateTopicResponseDto(savedTopic);
	}

	@Transactional(readOnly = true)
	public List<ReadTopicResponseDto> findAllTopics() {
		List<Topic> topics = topicRepository.findAllWithSubsectionAndSection();
		return topics.stream()
			.map(ReadTopicResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public ReadTopicResponseDto readTopic(Long topicId) {
		Topic topic = topicRepository.findById(topicId)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));

		return new ReadTopicResponseDto(topic);
	}

	@Transactional(readOnly = true)
	public List<ReadTopicResponseDto> searchTopicsByTitle(String title) {
		List<Topic> topics = topicRepository.findByTopicTitleContainingIgnoreCase(title);
		return topics.stream()
			.map(ReadTopicResponseDto::new)
			.collect(Collectors.toList());
	}

	@Transactional
	public void deleteTopic(Long topicId) {
		Topic topic = topicRepository.findById(topicId)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));
		
		topicRepository.delete(topic);
	}

	@Transactional
	public PatchTopicTitleResponseDto updateTopicTitle(Long topicId, PatchTopicTitleRequestDto requestDto) {
		Topic topic = topicRepository.findById(topicId)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));

		topic.updateTitle(requestDto.getTopicTitle());
		Topic savedTopic = topicRepository.save(topic);

		return new PatchTopicTitleResponseDto(savedTopic);
	}

	@Transactional
	public PatchTopicNumberResponseDto updateTopicNumber(Long topicId, PatchTopicNumberRequestDto requestDto) {
		Topic topic = topicRepository.findById(topicId)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));

		topic.updateNumber(requestDto.getTopicNumber());
		Topic savedTopic = topicRepository.save(topic);

		return new PatchTopicNumberResponseDto(savedTopic);
	}

	@Transactional(readOnly = true)
	public HierarchyResponseDto findTopicHierarchyByTitle(String title) {
		Topic topic = topicRepository.findFirstByTopicTitleIgnoreCase(title)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));
		initializeTopicHierarchy(topic);
		return HierarchyResponseDto.fromTopic(topic);
	}

	@Transactional(readOnly = true)
	public HierarchyResponseDto findTopicHierarchyById(Long id) {
		Topic topic = topicRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("topic not found"));
		initializeTopicHierarchy(topic);
		return HierarchyResponseDto.fromTopic(topic);
	}

	private void initializeTopicHierarchy(Topic topic) {
		if (topic == null) {
			return;
		}

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

		if (topic.getKeywords() != null) {
			topic.getKeywords().forEach(keyword -> {
				if (keyword.getContents() != null) {
					keyword.getContents().forEach(content -> content.getContentTitle());
				}
			});
		}
	}
}

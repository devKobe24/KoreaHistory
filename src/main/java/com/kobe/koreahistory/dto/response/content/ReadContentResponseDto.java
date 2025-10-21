package com.kobe.koreahistory.dto.response.content;

import com.kobe.koreahistory.domain.entity.Content;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ReadContentResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class ReadContentResponseDto {
	private final Long id;
	private final List<String> details;
	private final KeywordInfo keyword;

	public ReadContentResponseDto(Content entity) {
		this.id = entity.getId();
		this.details = entity.getDetails();
		this.keyword = entity.getKeyword() != null ? new KeywordInfo(entity.getKeyword()) : null;
	}

	@Getter
	public static class KeywordInfo {
		private final Long id;
		private final Integer keywordNumber;
		private final List<String> keywords;
		private final TopicInfo topic;

		public KeywordInfo(com.kobe.koreahistory.domain.entity.Keyword keyword) {
			this.id = keyword.getId();
			this.keywordNumber = keyword.getKeywordNumber();
			this.keywords = keyword.getKeywords();
			this.topic = keyword.getTopic() != null ? new TopicInfo(keyword.getTopic()) : null;
		}
	}

	@Getter
	public static class TopicInfo {
		private final Long id;
		private final Integer topicNumber;
		private final String topicTitle;
		private final SubsectionInfo subsection;

		public TopicInfo(com.kobe.koreahistory.domain.entity.Topic topic) {
			this.id = topic.getId();
			this.topicNumber = topic.getTopicNumber();
			this.topicTitle = topic.getTopicTitle();
			this.subsection = topic.getSubsection() != null ? new SubsectionInfo(topic.getSubsection()) : null;
		}
	}

	@Getter
	public static class SubsectionInfo {
		private final Long id;
		private final Integer subsectionNumber;
		private final String subsectionTitle;
		private final SectionInfo section;

		public SubsectionInfo(com.kobe.koreahistory.domain.entity.Subsection subsection) {
			this.id = subsection.getId();
			this.subsectionNumber = subsection.getSubsectionNumber();
			this.subsectionTitle = subsection.getSubsectionTitle();
			this.section = subsection.getSection() != null ? new SectionInfo(subsection.getSection()) : null;
		}
	}

	@Getter
	public static class SectionInfo {
		private final Long id;
		private final Integer sectionNumber;
		private final String sectionTitle;
		private final LessonInfo lesson;

		public SectionInfo(com.kobe.koreahistory.domain.entity.Section section) {
			this.id = section.getId();
			this.sectionNumber = section.getSectionNumber();
			this.sectionTitle = section.getSectionTitle();
			this.lesson = section.getLesson() != null ? new LessonInfo(section.getLesson()) : null;
		}
	}

	@Getter
	public static class LessonInfo {
		private final Long id;
		private final Integer lessonNumber;
		private final String lessonTitle;
		private final ChapterInfo chapter;

		public LessonInfo(com.kobe.koreahistory.domain.entity.Lesson lesson) {
			this.id = lesson.getId();
			this.lessonNumber = lesson.getLessonNumber();
			this.lessonTitle = lesson.getLessonTitle();
			this.chapter = lesson.getChapter() != null ? new ChapterInfo(lesson.getChapter()) : null;
		}
	}

	@Getter
	public static class ChapterInfo {
		private final Long id;
		private final Integer chapterNumber;
		private final String chapterTitle;

		public ChapterInfo(com.kobe.koreahistory.domain.entity.Chapter chapter) {
			this.id = chapter.getId();
			this.chapterNumber = chapter.getChapterNumber();
			this.chapterTitle = chapter.getChapterTitle();
		}
	}
}

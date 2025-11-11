package com.kobe.koreahistory.dto.response.hierarchy;

import com.kobe.koreahistory.domain.entity.*;
import lombok.Getter;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Getter
public class HierarchyResponseDto {
	private final String type;
	private final ChapterInfo chapter;
	private final LessonInfo lesson;
	private final SectionInfo section;
	private final SubsectionInfo subsection;
	private final TopicInfo topic;
	private final KeywordInfo keyword;
	private final ContentInfo content;

	private HierarchyResponseDto(
		String type,
		ChapterInfo chapter,
		LessonInfo lesson,
		SectionInfo section,
		SubsectionInfo subsection,
		TopicInfo topic,
		KeywordInfo keyword,
		ContentInfo content
	) {
		this.type = type;
		this.chapter = chapter;
		this.lesson = lesson;
		this.section = section;
		this.subsection = subsection;
		this.topic = topic;
		this.keyword = keyword;
		this.content = content;
	}

	public static HierarchyResponseDto fromChapter(Chapter chapter) {
		return new HierarchyResponseDto(
			"chapter",
			ChapterInfo.from(chapter),
			null,
			null,
			null,
			null,
			null,
			null
		);
	}

	public static HierarchyResponseDto fromLesson(Lesson lesson) {
		return new HierarchyResponseDto(
			"lesson",
			ChapterInfo.from(lesson.getChapter()),
			LessonInfo.from(lesson),
			null,
			null,
			null,
			null,
			null
		);
	}

	public static HierarchyResponseDto fromSection(Section section) {
		return new HierarchyResponseDto(
			"section",
			ChapterInfo.from(Optional.ofNullable(section.getLesson()).map(Lesson::getChapter).orElse(null)),
			LessonInfo.from(section.getLesson()),
			SectionInfo.from(section),
			null,
			null,
			null,
			null
		);
	}

	public static HierarchyResponseDto fromSubsection(Subsection subsection) {
		Section section = subsection.getSection();
		Lesson lesson = Optional.ofNullable(section).map(Section::getLesson).orElse(null);
		Chapter chapter = Optional.ofNullable(lesson).map(Lesson::getChapter).orElse(null);

		return new HierarchyResponseDto(
			"subsection",
			ChapterInfo.from(chapter),
			LessonInfo.from(lesson),
			SectionInfo.from(section),
			SubsectionInfo.from(subsection),
			null,
			null,
			null
		);
	}

	public static HierarchyResponseDto fromTopic(Topic topic) {
		Subsection subsection = topic.getSubsection();
		Section section = Optional.ofNullable(subsection).map(Subsection::getSection).orElse(null);
		Lesson lesson = Optional.ofNullable(section).map(Section::getLesson).orElse(null);
		Chapter chapter = Optional.ofNullable(lesson).map(Lesson::getChapter).orElse(null);

		return new HierarchyResponseDto(
			"topic",
			ChapterInfo.from(chapter),
			LessonInfo.from(lesson),
			SectionInfo.from(section),
			SubsectionInfo.from(subsection),
			TopicInfo.from(topic),
			null,
			null
		);
	}

	public static HierarchyResponseDto fromKeyword(Keyword keyword) {
		Topic topic = keyword.getTopic();
		Subsection subsection = Optional.ofNullable(topic).map(Topic::getSubsection).orElse(null);
		Section section = Optional.ofNullable(subsection).map(Subsection::getSection).orElse(null);
		Lesson lesson = Optional.ofNullable(section).map(Section::getLesson).orElse(null);
		Chapter chapter = Optional.ofNullable(lesson).map(Lesson::getChapter).orElse(null);

		return new HierarchyResponseDto(
			"keyword",
			ChapterInfo.from(chapter),
			LessonInfo.from(lesson),
			SectionInfo.from(section),
			SubsectionInfo.from(subsection),
			TopicInfo.from(topic),
			KeywordInfo.from(keyword),
			null
		);
	}

	public static HierarchyResponseDto fromContent(Content content) {
		Keyword keyword = content.getKeyword();
		Topic topic = Optional.ofNullable(keyword).map(Keyword::getTopic).orElse(null);
		Subsection subsection = Optional.ofNullable(topic).map(Topic::getSubsection).orElse(null);
		Section section = Optional.ofNullable(subsection).map(Subsection::getSection).orElse(null);
		Lesson lesson = Optional.ofNullable(section).map(Section::getLesson).orElse(null);
		Chapter chapter = Optional.ofNullable(lesson).map(Lesson::getChapter).orElse(null);

		return new HierarchyResponseDto(
			"content",
			ChapterInfo.from(chapter),
			LessonInfo.from(lesson),
			SectionInfo.from(section),
			SubsectionInfo.from(subsection),
			TopicInfo.from(topic),
			KeywordInfo.from(keyword),
			ContentInfo.from(content)
		);
	}

	@Getter
	public static class ChapterInfo {
		private final Long id;
		private final Integer chapterNumber;
		private final String chapterTitle;
		private final List<LessonSummary> lessons;

		private ChapterInfo(Long id, Integer chapterNumber, String chapterTitle, List<LessonSummary> lessons) {
			this.id = id;
			this.chapterNumber = chapterNumber;
			this.chapterTitle = chapterTitle;
			this.lessons = lessons;
		}

		public static ChapterInfo from(Chapter chapter) {
			if (chapter == null) {
				return null;
			}

			List<LessonSummary> lessonSummaries = Optional.ofNullable(chapter.getLessons())
				.orElse(Collections.emptyList())
				.stream()
				.map(LessonSummary::from)
				.collect(Collectors.toList());

			return new ChapterInfo(
				chapter.getId(),
				chapter.getChapterNumber(),
				chapter.getChapterTitle(),
				lessonSummaries
			);
		}
	}

	@Getter
	public static class LessonInfo {
		private final Long id;
		private final Integer lessonNumber;
		private final String lessonTitle;
		private final List<SectionSummary> sections;

		private LessonInfo(Long id, Integer lessonNumber, String lessonTitle, List<SectionSummary> sections) {
			this.id = id;
			this.lessonNumber = lessonNumber;
			this.lessonTitle = lessonTitle;
			this.sections = sections;
		}

		public static LessonInfo from(Lesson lesson) {
			if (lesson == null) {
				return null;
			}

			List<SectionSummary> sectionSummaries = Optional.ofNullable(lesson.getSections())
				.orElse(Collections.emptyList())
				.stream()
				.map(SectionSummary::from)
				.collect(Collectors.toList());

			return new LessonInfo(
				lesson.getId(),
				lesson.getLessonNumber(),
				lesson.getLessonTitle(),
				sectionSummaries
			);
		}
	}

	@Getter
	public static class SectionInfo {
		private final Long id;
		private final Integer sectionNumber;
		private final String sectionTitle;
		private final List<SubsectionSummary> subsections;

		private SectionInfo(Long id, Integer sectionNumber, String sectionTitle, List<SubsectionSummary> subsections) {
			this.id = id;
			this.sectionNumber = sectionNumber;
			this.sectionTitle = sectionTitle;
			this.subsections = subsections;
		}

		public static SectionInfo from(Section section) {
			if (section == null) {
				return null;
			}

			List<SubsectionSummary> subsectionSummaries = Optional.ofNullable(section.getSubsections())
				.orElse(Collections.emptyList())
				.stream()
				.map(SubsectionSummary::from)
				.collect(Collectors.toList());

			return new SectionInfo(
				section.getId(),
				section.getSectionNumber(),
				section.getSectionTitle(),
				subsectionSummaries
			);
		}
	}

	@Getter
	public static class SubsectionInfo {
		private final Long id;
		private final Integer subsectionNumber;
		private final String subsectionTitle;
		private final List<TopicSummary> topics;

		private SubsectionInfo(Long id, Integer subsectionNumber, String subsectionTitle, List<TopicSummary> topics) {
			this.id = id;
			this.subsectionNumber = subsectionNumber;
			this.subsectionTitle = subsectionTitle;
			this.topics = topics;
		}

		public static SubsectionInfo from(Subsection subsection) {
			if (subsection == null) {
				return null;
			}

			List<TopicSummary> topicSummaries = Optional.ofNullable(subsection.getTopics())
				.orElse(Collections.emptyList())
				.stream()
				.map(TopicSummary::from)
				.collect(Collectors.toList());

			return new SubsectionInfo(
				subsection.getId(),
				subsection.getSubsectionNumber(),
				subsection.getSubsectionTitle(),
				topicSummaries
			);
		}
	}

	@Getter
	public static class TopicInfo {
		private final Long id;
		private final Integer topicNumber;
		private final String topicTitle;
		private final List<KeywordSummary> keywords;

		private TopicInfo(Long id, Integer topicNumber, String topicTitle, List<KeywordSummary> keywords) {
			this.id = id;
			this.topicNumber = topicNumber;
			this.topicTitle = topicTitle;
			this.keywords = keywords;
		}

		public static TopicInfo from(Topic topic) {
			if (topic == null) {
				return null;
			}

			List<KeywordSummary> keywordSummaries = Optional.ofNullable(topic.getKeywords())
				.orElse(Collections.emptyList())
				.stream()
				.map(KeywordSummary::from)
				.collect(Collectors.toList());

			return new TopicInfo(
				topic.getId(),
				topic.getTopicNumber(),
				topic.getTopicTitle(),
				keywordSummaries
			);
		}
	}

	@Getter
	public static class KeywordInfo {
		private final Long id;
		private final Integer keywordNumber;
		private final String keywordTitle;
		private final List<String> keywords;
		private final List<ContentSummary> contents;

		private KeywordInfo(
			Long id,
			Integer keywordNumber,
			String keywordTitle,
			List<String> keywords,
			List<ContentSummary> contents
		) {
			this.id = id;
			this.keywordNumber = keywordNumber;
			this.keywordTitle = keywordTitle;
			this.keywords = keywords;
			this.contents = contents;
		}

		public static KeywordInfo from(Keyword keyword) {
			if (keyword == null) {
				return null;
			}

			List<ContentSummary> contentSummaries = Optional.ofNullable(keyword.getContents())
				.orElse(Collections.emptyList())
				.stream()
				.map(ContentSummary::from)
				.collect(Collectors.toList());

			return new KeywordInfo(
				keyword.getId(),
				keyword.getKeywordNumber(),
				keyword.getKeywordTitle(),
				Optional.ofNullable(keyword.getKeywords()).orElse(Collections.emptyList()),
				contentSummaries
			);
		}
	}

	@Getter
	public static class ContentInfo {
		private final Long id;
		private final Integer contentNumber;
		private final String contentTitle;
		private final String contentType;

		private ContentInfo(Long id, Integer contentNumber, String contentTitle, String contentType) {
			this.id = id;
			this.contentNumber = contentNumber;
			this.contentTitle = contentTitle;
			this.contentType = contentType;
		}

		public static ContentInfo from(Content content) {
			if (content == null) {
				return null;
			}

			return new ContentInfo(
				content.getId(),
				content.getContentNumber(),
				content.getContentTitle(),
				content.getContentType()
			);
		}
	}

	@Getter
	public static class LessonSummary {
		private final Long id;
		private final Integer lessonNumber;
		private final String lessonTitle;

		private LessonSummary(Long id, Integer lessonNumber, String lessonTitle) {
			this.id = id;
			this.lessonNumber = lessonNumber;
			this.lessonTitle = lessonTitle;
		}

		public static LessonSummary from(Lesson lesson) {
			return new LessonSummary(
				lesson.getId(),
				lesson.getLessonNumber(),
				lesson.getLessonTitle()
			);
		}
	}

	@Getter
	public static class SectionSummary {
		private final Long id;
		private final Integer sectionNumber;
		private final String sectionTitle;

		private SectionSummary(Long id, Integer sectionNumber, String sectionTitle) {
			this.id = id;
			this.sectionNumber = sectionNumber;
			this.sectionTitle = sectionTitle;
		}

		public static SectionSummary from(Section section) {
			return new SectionSummary(
				section.getId(),
				section.getSectionNumber(),
				section.getSectionTitle()
			);
		}
	}

	@Getter
	public static class SubsectionSummary {
		private final Long id;
		private final Integer subsectionNumber;
		private final String subsectionTitle;

		private SubsectionSummary(Long id, Integer subsectionNumber, String subsectionTitle) {
			this.id = id;
			this.subsectionNumber = subsectionNumber;
			this.subsectionTitle = subsectionTitle;
		}

		public static SubsectionSummary from(Subsection subsection) {
			return new SubsectionSummary(
				subsection.getId(),
				subsection.getSubsectionNumber(),
				subsection.getSubsectionTitle()
			);
		}
	}

	@Getter
	public static class TopicSummary {
		private final Long id;
		private final Integer topicNumber;
		private final String topicTitle;

		private TopicSummary(Long id, Integer topicNumber, String topicTitle) {
			this.id = id;
			this.topicNumber = topicNumber;
			this.topicTitle = topicTitle;
		}

		public static TopicSummary from(Topic topic) {
			return new TopicSummary(
				topic.getId(),
				topic.getTopicNumber(),
				topic.getTopicTitle()
			);
		}
	}

	@Getter
	public static class KeywordSummary {
		private final Long id;
		private final Integer keywordNumber;
		private final String keywordTitle;

		private KeywordSummary(Long id, Integer keywordNumber, String keywordTitle) {
			this.id = id;
			this.keywordNumber = keywordNumber;
			this.keywordTitle = keywordTitle;
		}

		public static KeywordSummary from(Keyword keyword) {
			return new KeywordSummary(
				keyword.getId(),
				keyword.getKeywordNumber(),
				keyword.getKeywordTitle()
			);
		}
	}

	@Getter
	public static class ContentSummary {
		private final Long id;
		private final Integer contentNumber;
		private final String contentTitle;
		private final String contentType;

		private ContentSummary(Long id, Integer contentNumber, String contentTitle, String contentType) {
			this.id = id;
			this.contentNumber = contentNumber;
			this.contentTitle = contentTitle;
			this.contentType = contentType;
		}

		public static ContentSummary from(Content content) {
			return new ContentSummary(
				content.getId(),
				content.getContentNumber(),
				content.getContentTitle(),
				content.getContentType()
			);
		}
	}
}


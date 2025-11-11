package com.kobe.koreahistory.dto.response.topic;

import com.kobe.koreahistory.domain.entity.Topic;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.topic
 * fileName       : ReadTopicResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class ReadTopicResponseDto {
	private final Long id;
	private final Integer topicNumber;
	private final String topicTitle;
	private final Long subsectionId;
	private final Integer subsectionNumber;
	private final String subsectionTitle;
	private final SubsectionInfo subsection;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ReadTopicResponseDto(Topic entity) {
		this.id = entity.getId();
		this.topicNumber = entity.getTopicNumber();
		this.topicTitle = entity.getTopicTitle();
		if (entity.getSubsection() != null) {
			this.subsectionId = entity.getSubsection().getId();
			this.subsectionNumber = entity.getSubsection().getSubsectionNumber();
			this.subsectionTitle = entity.getSubsection().getSubsectionTitle();
			this.subsection = new SubsectionInfo(entity.getSubsection());
		} else {
			this.subsectionId = null;
			this.subsectionNumber = null;
			this.subsectionTitle = null;
			this.subsection = null;
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

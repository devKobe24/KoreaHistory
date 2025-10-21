package com.kobe.koreahistory.dto.response.subsection;

import com.kobe.koreahistory.domain.entity.Subsection;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.subsection
 * fileName       : ReadSubsectionResponseDto
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Getter
public class ReadSubsectionResponseDto {
	private final Long id;
	private final Integer subsectionNumber;
	private final String subsectionTitle;
	private final SectionInfo section;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ReadSubsectionResponseDto(Subsection entity) {
		this.id = entity.getId();
		this.subsectionNumber = entity.getSubsectionNumber();
		this.subsectionTitle = entity.getSubsectionTitle();
		this.section = entity.getSection() != null ? new SectionInfo(entity.getSection()) : null;
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

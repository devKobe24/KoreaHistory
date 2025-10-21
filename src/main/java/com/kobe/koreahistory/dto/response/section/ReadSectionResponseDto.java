package com.kobe.koreahistory.dto.response.section;

import com.kobe.koreahistory.domain.entity.Section;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.section
 * fileName       : ReadSectionResponseDto
 * author         : kobe
 * date           : 2025. 10. 11.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 11.        kobe       최초 생성
 */
@Getter
public class ReadSectionResponseDto {
	private final Long id;
	private final Integer sectionNumber;
	private final String sectionTitle;
	private final LessonInfo lesson;

	// Entity를 인자로 받은 단일 생성자로 변환 로직을 캡슐화
	public ReadSectionResponseDto(Section entity) {
		this.id = entity.getId();
		this.sectionNumber = entity.getSectionNumber();
		this.sectionTitle = entity.getSectionTitle();
		this.lesson = entity.getLesson() != null ? new LessonInfo(entity.getLesson()) : null;
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

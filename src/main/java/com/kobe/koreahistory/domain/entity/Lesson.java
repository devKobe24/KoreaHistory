package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : DetailChapter
 * author         : kobe
 * date           : 2025. 10. 6.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 6.        kobe       최초 생성
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Lesson {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer lessonNumber;

	@Column(nullable = false)
	private String lessonTitle;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chapter_id")
	private Chapter chapter;

	@OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Section> sections = new ArrayList<>();

	@Builder
	public Lesson(Integer lessonNumber, String lessonTitle, Chapter chapter) {
		this.lessonNumber = lessonNumber;
		this.lessonTitle = lessonTitle;
		this.chapter = chapter;
	}

	public void updateLessonNumber(Integer lessonNumber) {
		this.lessonNumber = lessonNumber;
	}

	public void updateLessonTitle(String newLessonTitle) {
		if (newLessonTitle == null || newLessonTitle.trim().isEmpty()) {
			throw new IllegalArgumentException("Lesson 제목은 null이거나 빈 문자열일 수 없습니다.");
		}
		this.lessonTitle = newLessonTitle;
	}
}

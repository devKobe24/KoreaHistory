package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : Section
 * author         : kobe
 * date           : 2025. 10. 10.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 10.        kobe       최초 생성
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Section {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer sectionNumber;

	@Column(nullable = false)
	private String sectionTitle;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lesson_id")
	private Lesson lesson;

	@OneToMany(mappedBy = "section", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Subsection> subsections;

	@Builder
	public Section(Integer sectionNumber, String sectionTitle, Lesson lesson) {
		this.sectionNumber = sectionNumber;
		this.sectionTitle = sectionTitle;
		this.lesson = lesson;
	}
}

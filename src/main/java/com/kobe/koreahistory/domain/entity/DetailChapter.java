package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
public class DetailChapter {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer number;

	@Column(nullable = false)
	private String title;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chapter_id")
	private Chapter chapter;

	@OneToMany(mappedBy = "detailChapter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Keyword> keywords;

	@Builder
	public DetailChapter(Integer number, String title, Chapter chapter) {
		this.number = number;
		this.title = title;
		this.chapter = chapter;
	}

	public void updateChapterDetail(String newChapterTitle) {
		this.title = newChapterTitle;
	}
}

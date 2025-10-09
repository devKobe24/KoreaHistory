package com.kobe.koreahistory.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : Chapter
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
public class Chapter {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer chapterNumber;

	@Column(nullable = false)
	private String chapterTitle;

	@OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<DetailChapter> detailChapters = new ArrayList<>();

	@Builder
	public Chapter(Integer chapterNumber, String chapterTitle) {
		this.chapterNumber = chapterNumber;
		this.chapterTitle = chapterTitle;
	}

	public void updateChapterNumber(int newChapterNumber) {
		this.chapterNumber = newChapterNumber;
	}

	public void updateChapterTitle(String newChapterTitle) {
		this.chapterTitle = newChapterTitle;
	}
}

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
 * fileName       : Keyword
 * author         : kobe
 * date           : 2025. 10. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 7.        kobe       최초 생성
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Keyword {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String keyword;

	// N : 1 = Keyword(N) : DetailChapter(1)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "detail_chapter_id")
	private DetailChapter detailChapter;

	@OneToOne(mappedBy = "keyword", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private KeywordContent keywordContent;

	@Builder
	public Keyword(String keyword, DetailChapter detailChapter) {
		this.keyword = keyword;
		this.detailChapter = detailChapter;
	}
}

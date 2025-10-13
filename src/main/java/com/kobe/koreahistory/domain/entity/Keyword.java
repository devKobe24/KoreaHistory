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
	private Integer keywordNumber;

	@Column(nullable = false)
	private String keyword;

	@OneToMany(mappedBy = "keyword", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Content> contents = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "topic_id")
	private Topic topic;

	@Builder
	public Keyword(Integer keywordNumber, String keyword, Topic topic) {
		this.keywordNumber = keywordNumber;
		this.keyword = keyword;
		this.topic = topic;
	}
}

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
	private String keywordTitle;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "keywords", // 키워드 문자열을 저장할 테이블 이름
		joinColumns = @JoinColumn(name = "keywords_id") // 이 테이블이 참조할 외래 키
	)
	@Column(name = "keywords_value") // 실제 키워드 값이 저장될 컬럼 이름
	private List<String> keywords = new ArrayList<>();

	@OneToMany(mappedBy = "keyword", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Content> contents = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "topic_id")
	private Topic topic;

	@Builder
	public Keyword(Integer keywordNumber, String keywordTitle, List<String> keywords, Topic topic) {
		this.keywordNumber = keywordNumber;
		this.keywordTitle = keywordTitle;
		this.keywords = keywords;
		this.topic = topic;
	}

	public void updateKeywordNumber(Integer newKeywordNumber) {
		this.keywordNumber = newKeywordNumber;
	}

	public void updateKeywordTitle(String newKeywordTitle) {
		this.keywordTitle = newKeywordTitle;
	}

	public void updateKeywords(List<String> newKeywords) {
		this.keywords.clear();
		this.keywords.addAll(newKeywords);
	}

	public void updateKeyword(String newKeyword) {
		this.keywords.add(newKeyword);
	}

	public void deleteKeyword(String targetKeyword) {
		this.keywords.remove(targetKeyword);
	}
}

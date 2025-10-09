package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : Content
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
public class Content {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String mainCategory;

	@Column(nullable = false)
	private String subCategory;

	@Column(nullable = false)
	private String detail;

	@ManyToMany(mappedBy = "contents", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<KeywordContent> keywordContents;

	@Builder
	public Content(String mainCategory, String subCategory, String detail) {
		this.mainCategory = mainCategory;
		this.subCategory = subCategory;
		this.detail = detail;
	}
}

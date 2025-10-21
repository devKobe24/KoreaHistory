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

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "details", // 키워드 문자열을 저장할 테이블 이름
		joinColumns = @JoinColumn(name = "detail_id") // 이 테이블이 참조할 외래 키
	)
	@Column(name = "detail_value") // 실제 콘텐츠 타이틀 값이 저장될 컬럼 이름
	private List<String> details = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "keyword_id")
	private Keyword keyword;

	@Builder
	public Content(List<String> details, Keyword keyword) {
		this.details = details;
		this.keyword = keyword;
	}

	public void updateDetails(List<String> details) {
		this.details = details;
	}
}

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

	@Column(nullable = false)
	private Integer contentNumber;

	@Column(nullable = false)
	private String contentTitle;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "details", // 키워드 문자열을 저장할 테이블 이름
		joinColumns = @JoinColumn(name = "detail_id") // 이 테이블이 참조할 외래 키
	)
	@Column(name = "detail_value") // 실제 콘텐츠 타이틀 값이 저장될 컬럼 이름
	private List<String> details = new ArrayList<>();

	// ContentBlock을 위한 새로운 필드들
	@Column(name = "content_type")
	private String contentType; // "TEXT", "TABLE", "TIMELINE", "COMPARISON_TABLE", "HERITAGE", "IMAGE_GALLERY"

	@Lob
	@Column(name = "block_data", columnDefinition = "TEXT")
	private String blockData; // JSON 형태의 ContentBlock 데이터

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "keyword_id")
	private Keyword keyword;

	@Builder
	public Content(Integer contentNumber, String contentTitle, List<String> details, Keyword keyword, String contentType, String blockData) {
		this.contentNumber = contentNumber;
		this.contentTitle = contentTitle;
		this.details = details;
		this.keyword = keyword;
		this.contentType = contentType;
		this.blockData = blockData;
	}

	public void updateContentNumber(Integer contentNumber) {
		this.contentNumber = contentNumber;
	}

	public void updateContentTitle(String newContentTitle) {
		if (newContentTitle == null || newContentTitle.trim().isEmpty()) {
			throw new IllegalArgumentException("Content의 Title은 null이거나 빈 문자열일 수 없습니다.");
		}
		this.contentTitle = newContentTitle;
	}

	public void updateDetails(List<String> details) {
		this.details = details;
	}

	public void updateContentType(String contentType) {
		this.contentType = contentType;
	}

	public void updateBlockData(String blockData) {
		this.blockData = blockData;
	}
}

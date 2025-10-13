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
 * fileName       : Topic
 * author         : kobe
 * date           : 2025. 10. 12.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 12.        kobe       최초 생성
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Topic {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer topicNumber;

	@Column(nullable = false)
	private String topicTitle;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subsection_id")
	private Subsection subsection;

	@OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Keyword> keywords = new ArrayList<>();

	@Builder
	public Topic(Integer topicNumber, String topicTitle, Subsection subsection) {
		this.topicNumber = topicNumber;
		this.topicTitle = topicTitle;
		this.subsection = subsection;
	}
}

package com.kobe.koreahistory.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.domain.entity
 * fileName       : Subsection
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
public class Subsection {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer subsectionNumber;

	@Column(nullable = false)
	private String subsectionTitle;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "section_id")
	private Section section;

	@Builder
	public Subsection(Integer subsectionNumber, String subsectionTitle, Section section) {
		this.subsectionNumber = subsectionNumber;
		this.subsectionTitle = subsectionTitle;
		this.section = section;
	}
}

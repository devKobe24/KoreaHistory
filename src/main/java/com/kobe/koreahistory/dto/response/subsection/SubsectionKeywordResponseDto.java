package com.kobe.koreahistory.dto.response.subsection;

import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.subsection
 * fileName       : SubsectionKeywordResponseDto
 * author         : kobe
 * date           : 2025. 1. X.
 * description    : Subsection과 Keywords의 관계를 반환하는 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 1. X.        kobe       최초 생성
 */
@Getter
public class SubsectionKeywordResponseDto {
    private final String subsectionTitle;
    private final Long keywordId;
    private final Integer keywordNumber;
    private final String keywordTitle;
    private final String keywordsValue;

    public SubsectionKeywordResponseDto(String subsectionTitle, Long keywordId, Integer keywordNumber, String keywordTitle, String keywordsValue) {
        this.subsectionTitle = subsectionTitle;
        this.keywordId = keywordId;
        this.keywordNumber = keywordNumber;
        this.keywordTitle = keywordTitle;
        this.keywordsValue = keywordsValue;
    }
}


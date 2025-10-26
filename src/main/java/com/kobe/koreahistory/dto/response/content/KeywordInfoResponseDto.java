package com.kobe.koreahistory.dto.response.content;

import com.kobe.koreahistory.domain.entity.Keyword;
import com.kobe.koreahistory.dto.response.topic.TopicInfoResponseDto;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : KeywordInfoResponseDto
 * author         : kobe
 * date           : 2025. 10. 23.
 * description    : Content 조회 시 Keyword 정보를 포함한 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 23.        kobe       최초 생성
 */
@Getter
public class KeywordInfoResponseDto {
    private final Long id;
    private final Integer keywordNumber;
    private final List<String> keywords;
    private final TopicInfoResponseDto topic;

    public KeywordInfoResponseDto(Keyword entity) {
        this.id = entity.getId();
        this.keywordNumber = entity.getKeywordNumber();
        this.keywords = entity.getKeywords();
        this.topic = entity.getTopic() != null ? new TopicInfoResponseDto(entity.getTopic()) : null;
    }
}

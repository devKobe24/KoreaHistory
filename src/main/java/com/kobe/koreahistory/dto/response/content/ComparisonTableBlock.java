package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ComparisonTableBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

// 이 클래스가 ContentBlock의 구체적인 구현체(자식 클래스)가 됩니다.
@Getter
public class ComparisonTableBlock extends ContentBlock {

    private List<String> headers;
    private List<ComparisonRow> rows;

    @JsonCreator
    public ComparisonTableBlock(@JsonProperty("title") String title, @JsonProperty("headers") List<String> headers, @JsonProperty("rows") List<ComparisonRow> rows) {
        super(title); // 부여, 고구려
        this.headers = headers;
        this.rows = rows;
    }
}

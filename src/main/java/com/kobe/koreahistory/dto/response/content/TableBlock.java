package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TableBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Getter
public class TableBlock extends ContentBlock {

    // 테이블의 '행(가로, Row)' 데이터를 담을 리스트
    private List<TableRow> rows;

    @JsonCreator
    public TableBlock(@JsonProperty("title") String title, @JsonProperty("rows") List<TableRow> rows) {
        super(title);
        this.rows = rows;
    }
}

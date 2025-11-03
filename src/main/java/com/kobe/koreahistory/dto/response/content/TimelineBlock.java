package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TimelineBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Getter
public class TimelineBlock extends ContentBlock {

    private List<TimelineRow> rows;

    @JsonCreator
    public TimelineBlock(@JsonProperty("title") String title, @JsonProperty("rows") List<TimelineRow> rows) {
        super(title);
        this.rows = rows;
    }
}

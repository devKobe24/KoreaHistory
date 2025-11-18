package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : HeritageBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
// ContentBlock의 구체적인 구현체(자식 클래스)
@Getter
public class HeritageBlock extends ContentBlock {

    private List<HeritageCategory> categories;

    @JsonCreator
    public HeritageBlock(@JsonProperty("title") String title, @JsonProperty("categories") List<HeritageCategory> categories) {
        super(title);
        this.categories = categories;
    }
}

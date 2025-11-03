package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TextBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Getter
public class TextBlock extends ContentBlock {

    private String text; // "1. 뗀석기: 돌을 깨뜨리고 떼어 내어 날을 만든 도구인 뗀석기를 주로 사용하였다."

    // Jackson 역직렬화를 위한 생성자
    @JsonCreator
    public TextBlock(@JsonProperty("title") String title, @JsonProperty("text") String text) {
        super(title);
        this.text = text;
    }
}

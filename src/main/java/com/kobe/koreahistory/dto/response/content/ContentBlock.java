package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ContentBlock
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

/**
 * 프론트엔드로 내려보낼 콘텐츠 블록의 최상위 추상 클래스입니다.
 *  * @JsonTypeInfo:
 *  - use = JsonTypeInfo.Id.NAME: 'type' 필드의 값을 보고 어떤 클래스인지 결정합니다.
 *  - property = "type": JSON 객체에 'type'이라는 이름의 필드를 포함시킵니다.
 *
 *  * @JsonSubTypes:
 *  - 'types' 필드의 값에 따라 매핑될 자식 클래스를 정의합니다.
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TextBlock.class, name = "TEXT"),
        @JsonSubTypes.Type(value = TableBlock.class, name = "TABLE"),
        @JsonSubTypes.Type(value = ComparisonTableBlock.class, name = "COMPARISON_TABLE"),
        @JsonSubTypes.Type(value = TimelineBlock.class, name = "TIMELINE"),
        @JsonSubTypes.Type(value = HeritageBlock.class, name = "HERITAGE"),
        @JsonSubTypes.Type(value = ImageGalleryBlock.class, name = "IMAGE_GALLERY")
})
@Getter
public abstract class ContentBlock {

    private String title; // "도구", "시기와 영역", "정치 체제" 등

    // Getter, Constructor 등
    public ContentBlock(String title) {
        this.title = title;
    }
}

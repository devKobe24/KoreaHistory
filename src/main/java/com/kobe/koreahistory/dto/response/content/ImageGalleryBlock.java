package com.kobe.koreahistory.dto.response.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ImageGalleryBlock
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
public class ImageGalleryBlock extends ContentBlock {

    private List<GalleryItem> items;

    @JsonCreator
    public ImageGalleryBlock(@JsonProperty("title") String title, @JsonProperty("items") List<GalleryItem> items) {
        super(title);
        this.items = items;
    }
}

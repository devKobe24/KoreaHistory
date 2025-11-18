package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : GalleryItem
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

// ImageGalleryBlock이 사용할 '갤러리 아이템' DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor // 혹은 @Builder
public class GalleryItem {
    private String name;
    private String imageUrl;
    private String style; // 예: "DEFAULT", "ORANGE", "GREEN", "YELLOW"
}

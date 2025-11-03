package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : HeritageItem
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
// 카테고리가 사용할 유물 아이템 DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor // 혹은 @Builder
public class HeritageItem {
    private String name;
    private String imageUrl; // ex) "https://s3:.../armor.png
}

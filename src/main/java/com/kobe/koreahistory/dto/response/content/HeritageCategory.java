package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : HeritageCategory
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
// HeritageBlock이 사용할 '카테고리' DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor // 혹은 @Builder
public class HeritageCategory {
    private String categoryTitle;
    private List<HeritageItem> items;
}

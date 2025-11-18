package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : ComparisonRow
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

// ComparisonTableBlock이 사용할 '행(가로, Row)' DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor // 간결함을 위하여 @Builder 대신 사용
public class ComparisonRow {
    private String category;
    private List<CellContent> items;
}

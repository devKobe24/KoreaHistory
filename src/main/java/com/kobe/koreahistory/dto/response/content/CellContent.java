package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : CellContent
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

// '행(가로, Row)'이 사용할 '셀' DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CellContent {
    // 셀 내부의 내용을 리스트로 관리 (글머리 기호 대응)
    private List<String> details;
}

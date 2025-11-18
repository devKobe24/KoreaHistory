package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TableRow
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor // Jackson 역직렬화를 위해 필수
@AllArgsConstructor // (key, value)를 받는 생성자
public class TableRow {
    private String key; // "불교 수용", "율령 반포",...등
    private String value; // "중국의 전진과 수교하고, 승려인...", "국가 통치의 기본법인 율령을..."등
}

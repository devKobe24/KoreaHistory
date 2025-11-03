package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TimelineRow
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TimelineRow {
    // 한 줄에 표시될 이벤트들의 리스트
    private List<TimelineEvent> events;
}

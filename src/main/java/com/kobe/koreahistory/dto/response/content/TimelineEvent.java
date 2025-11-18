package com.kobe.koreahistory.dto.response.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : TimelineEvent
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
public class TimelineEvent {
    private String title;
    private String subtitle;
    private List<String> details; // 여러 줄의 설명이나 하위 흐름을 처리
    private String style; // "GRAY", "YELLOW", "PURPLE" 등
}

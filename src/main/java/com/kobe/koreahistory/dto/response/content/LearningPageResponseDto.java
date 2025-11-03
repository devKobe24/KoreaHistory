package com.kobe.koreahistory.dto.response.content;

import lombok.Getter;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.dto.response.content
 * fileName       : LearningPageResponseDto
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */

// 페이지 전체 응답 - 학습 페이지에 표시될 콘텐츠 블록들을 담는 최종 응답 DTO
@Getter
public class LearningPageResponseDto {

    private String title; // "부여와 고구려", "(5) 소수림왕" 등...
    private List<ContentBlock> blocks; // 순서대로 정렬된 콘텐츠 블록 리스트

    public LearningPageResponseDto(String title, List<ContentBlock> blocks) {
        this.title = title;
        this.blocks = blocks;
    }
}

package com.kobe.koreahistory.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.kobe.koreahistory.dto.response.content.ContentBlock;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * packageName    : com.kobe.koreahistory.util
 * fileName       : ContentBlockUtil
 * author         : kobe
 * date           : 2025. 11. 2.
 * description    : ContentBlock JSON 직렬화/역직렬화 유틸리티
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 2.        kobe       최초 생성
 */
@Slf4j
public class ContentBlockUtil {

	private static final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * ContentBlock을 JSON 문자열로 변환
	 */
	public static String toJson(ContentBlock block) {
		if (block == null) {
			return null;
		}
		try {
			return objectMapper.writeValueAsString(block);
		} catch (JsonProcessingException e) {
			log.error("ContentBlock JSON 직렬화 실패", e);
			throw new RuntimeException("ContentBlock을 JSON으로 변환하는데 실패했습니다.", e);
		}
	}

	/**
	 * JSON 문자열을 ContentBlock으로 변환
	 */
	public static ContentBlock fromJson(String json) {
		if (json == null || json.trim().isEmpty()) {
			return null;
		}
		try {
			return objectMapper.readValue(json, ContentBlock.class);
		} catch (JsonProcessingException e) {
			log.error("ContentBlock JSON 역직렬화 실패: {}", json, e);
			throw new RuntimeException("JSON을 ContentBlock으로 변환하는데 실패했습니다.", e);
		}
	}

	/**
	 * JSON 문자열과 contentType을 받아 ContentBlock으로 변환
	 * contentType을 JSON에 type 필드로 추가하여 역직렬화
	 */
	public static ContentBlock fromJsonWithType(String json, String contentType) {
		if (json == null || json.trim().isEmpty()) {
			return null;
		}
		if (contentType == null || contentType.trim().isEmpty()) {
			return fromJson(json); // 타입이 없으면 기본 방식 사용
		}
		
		try {
			// JSON에 type 필드를 동적으로 추가
			JsonNode jsonNode = objectMapper.readTree(json);
			((ObjectNode) jsonNode).put("type", contentType);
			
			return objectMapper.treeToValue(jsonNode, ContentBlock.class);
		} catch (Exception e) {
			log.error("ContentBlock JSON 역직렬화 실패 (with type): {}", json, e);
			throw new RuntimeException("JSON을 ContentBlock으로 변환하는데 실패했습니다.", e);
		}
	}

	/**
	 * List<ContentBlock>을 JSON 문자열로 변환
	 */
	public static String toJson(List<ContentBlock> blocks) {
		if (blocks == null || blocks.isEmpty()) {
			return null;
		}
		try {
			return objectMapper.writeValueAsString(blocks);
		} catch (JsonProcessingException e) {
			log.error("ContentBlock 리스트 JSON 직렬화 실패", e);
			throw new RuntimeException("ContentBlock 리스트를 JSON으로 변환하는데 실패했습니다.", e);
		}
	}

	/**
	 * JSON 문자열을 List<ContentBlock>으로 변환
	 */
	public static List<ContentBlock> fromJsonList(String json) {
		if (json == null || json.trim().isEmpty()) {
			return List.of();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<ContentBlock>>() {});
		} catch (JsonProcessingException e) {
			log.error("ContentBlock 리스트 JSON 역직렬화 실패: {}", json, e);
			throw new RuntimeException("JSON을 ContentBlock 리스트로 변환하는데 실패했습니다.", e);
		}
	}
}


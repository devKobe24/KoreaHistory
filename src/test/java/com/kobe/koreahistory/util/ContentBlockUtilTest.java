package com.kobe.koreahistory.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kobe.koreahistory.dto.response.content.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

/**
 * ContentBlockUtil JSON 직렬화/역직렬화 테스트
 */
class ContentBlockUtilTest {

	@Test
	@DisplayName("TextBlock 직렬화/역직렬화")
	void testTextBlockSerialization() throws JsonProcessingException {
		TextBlock original = new TextBlock("제목", "내용");
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(TextBlock.class);
		TextBlock result = (TextBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("제목");
		assertThat(result.getText()).isEqualTo("내용");
	}

	@Test
	@DisplayName("TableBlock 직렬화/역직렬화")
	void testTableBlockSerialization() throws JsonProcessingException {
		TableRow row1 = new TableRow("항목1", "내용1");
		TableRow row2 = new TableRow("항목2", "내용2");
		TableBlock original = new TableBlock("테이블 제목", Arrays.asList(row1, row2));
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(TableBlock.class);
		TableBlock result = (TableBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("테이블 제목");
		assertThat(result.getRows()).hasSize(2);
		assertThat(result.getRows().get(0).getKey()).isEqualTo("항목1");
		assertThat(result.getRows().get(0).getValue()).isEqualTo("내용1");
	}

	@Test
	@DisplayName("fromJsonWithType - contentType으로 type 추가")
	void testFromJsonWithType() throws JsonProcessingException {
		String jsonWithoutType = "{\"title\":\"제목\",\"text\":\"내용\"}";
		String contentType = "TEXT";
		
		ContentBlock result = ContentBlockUtil.fromJsonWithType(jsonWithoutType, contentType);
		
		assertThat(result).isInstanceOf(TextBlock.class);
		TextBlock textBlock = (TextBlock) result;
		assertThat(textBlock.getTitle()).isEqualTo("제목");
		assertThat(textBlock.getText()).isEqualTo("내용");
	}

	@Test
	@DisplayName("ComparisonTableBlock 직렬화/역직렬화")
	void testComparisonTableBlockSerialization() throws JsonProcessingException {
		CellContent cell1 = new CellContent(Arrays.asList("내용1-1", "내용1-2"));
		CellContent cell2 = new CellContent(Arrays.asList("내용2-1"));
		ComparisonRow row = new ComparisonRow("구분", Arrays.asList(cell1, cell2));
		
		ComparisonTableBlock original = new ComparisonTableBlock(
			"비교 테이블",
			Arrays.asList("비교1", "비교2"),
			Arrays.asList(row)
		);
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(ComparisonTableBlock.class);
		ComparisonTableBlock result = (ComparisonTableBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("비교 테이블");
		assertThat(result.getHeaders()).hasSize(2);
		assertThat(result.getRows()).hasSize(1);
	}

	@Test
	@DisplayName("TimelineBlock 직렬화/역직렬화")
	void testTimelineBlockSerialization() throws JsonProcessingException {
		TimelineEvent event1 = new TimelineEvent("이벤트1", "부제목1", Arrays.asList("상세1"), "GRAY");
		TimelineEvent event2 = new TimelineEvent("이벤트2", "부제목2", Arrays.asList("상세2"), "YELLOW");
		TimelineRow row = new TimelineRow(Arrays.asList(event1, event2));
		
		TimelineBlock original = new TimelineBlock("타임라인", Arrays.asList(row));
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(TimelineBlock.class);
		TimelineBlock result = (TimelineBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("타임라인");
		assertThat(result.getRows()).hasSize(1);
		assertThat(result.getRows().get(0).getEvents()).hasSize(2);
	}

	@Test
	@DisplayName("HeritageBlock 직렬화/역직렬화")
	void testHeritageBlockSerialization() throws JsonProcessingException {
		HeritageItem item1 = new HeritageItem("문화재1", "https://example.com/image1.png");
		HeritageItem item2 = new HeritageItem("문화재2", "https://example.com/image2.png");
		HeritageCategory category = new HeritageCategory("카테고리", Arrays.asList(item1, item2));
		
		HeritageBlock original = new HeritageBlock("문화재", Arrays.asList(category));
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(HeritageBlock.class);
		HeritageBlock result = (HeritageBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("문화재");
		assertThat(result.getCategories()).hasSize(1);
		assertThat(result.getCategories().get(0).getItems()).hasSize(2);
	}

	@Test
	@DisplayName("ImageGalleryBlock 직렬화/역직렬화")
	void testImageGalleryBlockSerialization() throws JsonProcessingException {
		GalleryItem item1 = new GalleryItem("이미지1", "https://example.com/img1.png", "DEFAULT");
		GalleryItem item2 = new GalleryItem("이미지2", "https://example.com/img2.png", "ORANGE");
		
		ImageGalleryBlock original = new ImageGalleryBlock("갤러리", Arrays.asList(item1, item2));
		
		String json = ContentBlockUtil.toJson(original);
		ContentBlock deserialized = ContentBlockUtil.fromJson(json);
		
		assertThat(deserialized).isInstanceOf(ImageGalleryBlock.class);
		ImageGalleryBlock result = (ImageGalleryBlock) deserialized;
		assertThat(result.getTitle()).isEqualTo("갤러리");
		assertThat(result.getItems()).hasSize(2);
		assertThat(result.getItems().get(0).getName()).isEqualTo("이미지1");
		assertThat(result.getItems().get(1).getStyle()).isEqualTo("ORANGE");
	}
}


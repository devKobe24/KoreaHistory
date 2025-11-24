-- =====================================================================
-- KoreaHistory 초기 스키마 (MySQL 8.x 기준)
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Chapter (대분류)
CREATE TABLE chapter (
                         id BIGINT NOT NULL AUTO_INCREMENT,
                         chapter_number INT NOT NULL,
                         chapter_title VARCHAR(255) NOT NULL,
                         PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 2. Lesson (중분류) - Chapter에 종속
CREATE TABLE lesson (
                        id BIGINT NOT NULL AUTO_INCREMENT,
                        lesson_number INT NOT NULL,
                        lesson_title VARCHAR(255) NOT NULL,
                        chapter_id BIGINT,
                        PRIMARY KEY (id),
                        KEY idx_lesson_chapter (chapter_id),
                        CONSTRAINT fk_lesson_to_chapter
                            FOREIGN KEY (chapter_id)
                                REFERENCES chapter (id)
                                ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 3. Section (소분류) - Lesson에 종속
CREATE TABLE section (
                         id BIGINT NOT NULL AUTO_INCREMENT,
                         section_number INT NOT NULL,
                         section_title VARCHAR(255) NOT NULL,
                         lesson_id BIGINT,
                         PRIMARY KEY (id),
                         KEY idx_section_lesson (lesson_id),
                         CONSTRAINT fk_section_to_lesson
                             FOREIGN KEY (lesson_id)
                                 REFERENCES lesson (id)
                                 ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 4. Subsection (상세분류) - Section에 종속
CREATE TABLE subsection (
                            id BIGINT NOT NULL AUTO_INCREMENT,
                            subsection_number INT NOT NULL,
                            subsection_title VARCHAR(255) NOT NULL,
                            section_id BIGINT,
                            PRIMARY KEY (id),
                            KEY idx_subsection_section (section_id),
                            CONSTRAINT fk_subsection_to_section
                                FOREIGN KEY (section_id)
                                    REFERENCES section (id)
                                    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 5. Topic (주제) - Subsection에 종속
CREATE TABLE topic (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       topic_number INT NOT NULL,
                       topic_title VARCHAR(255) NOT NULL,
                       subsection_id BIGINT,
                       PRIMARY KEY (id),
                       KEY idx_topic_subsection (subsection_id),
                       CONSTRAINT fk_topic_to_subsection
                           FOREIGN KEY (subsection_id)
                               REFERENCES subsection (id)
                               ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 6. Keyword (키워드 그룹) - Topic에 종속
CREATE TABLE keyword (
                         id BIGINT NOT NULL AUTO_INCREMENT,
                         keyword_number INT NOT NULL,
                         topic_id BIGINT,
                         PRIMARY KEY (id),
                         KEY idx_keyword_topic (topic_id),
                         CONSTRAINT fk_keyword_to_topic
                             FOREIGN KEY (topic_id)
                                 REFERENCES topic (id)
                                 ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 7. keywords (Keyword의 @ElementCollection) - Keyword에 종속
CREATE TABLE keywords (
                          keywords_id BIGINT NOT NULL,
                          keywords_value VARCHAR(255),
                          KEY idx_keywords_keyword (keywords_id),
                          CONSTRAINT fk_keywords_to_keyword
                              FOREIGN KEY (keywords_id)
                                  REFERENCES keyword (id)
                                  ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 8. Content (상세 내용) - Keyword에 종속
CREATE TABLE content (
                         id BIGINT NOT NULL AUTO_INCREMENT,
                         content_number INT NOT NULL,
                         content_title VARCHAR(255) NOT NULL,
                         keyword_id BIGINT,
                         PRIMARY KEY (id),
                         KEY idx_content_keyword (keyword_id),
                         CONSTRAINT fk_content_to_keyword
                             FOREIGN KEY (keyword_id)
                                 REFERENCES keyword (id)
                                 ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 9. details (Content의 @ElementCollection) - Content에 종속
CREATE TABLE details (
                         detail_id BIGINT NOT NULL,
                         detail_value JSON,
                         KEY idx_details_content (detail_id),
                         CONSTRAINT fk_details_to_content
                             FOREIGN KEY (detail_id)
                                 REFERENCES content (id)
                                 ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Admin 테이블 생성
CREATE TABLE admin (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       admin_id VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       PRIMARY KEY (id),
                       UNIQUE KEY uk_admin_id (admin_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- =====================================================================
-- 초기 데이터 (관리자 계정)
-- =====================================================================
INSERT INTO admin (admin_id, password) VALUES ('admin', 'admin123');
INSERT INTO admin (admin_id, password) VALUES ('kobe', 'kobe123');

-- =====================================================================
-- ContentBlock 기능을 위한 컬럼 추가
-- =====================================================================
-- content_type: ContentBlock 타입 ("TEXT", "TABLE", "TIMELINE",
--                "COMPARISON_TABLE", "HERITAGE", "IMAGE_GALLERY" 등)
-- block_data  : JSON 형태의 ContentBlock 데이터 (현재는 TEXT 사용)

ALTER TABLE content
    ADD COLUMN content_type VARCHAR(50);

ALTER TABLE content
    ADD COLUMN block_data TEXT;
-- MySQL 8 JSON 타입을 쓰고 싶다면: block_data JSON; 로 변경 가능

-- =====================================================================
-- Keyword Title 추가 (H2 & MySQL 호환)
-- =====================================================================
ALTER TABLE keyword
    ADD COLUMN keyword_title VARCHAR(255) NOT NULL DEFAULT 'Untitled'
    AFTER keyword_number;

SET FOREIGN_KEY_CHECKS = 1;
-- 1. Chapter (대분류)
CREATE TABLE chapter (
    id BIGINT NOT NULL AUTO_INCREMENT,
    chapter_number INTEGER NOT NULL,
    chapter_title VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Lesson (중분류) - Chapter에 종속
CREATE TABLE lesson (
    id BIGINT NOT NULL AUTO_INCREMENT,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    chapter_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_lesson_chapter (chapter_id),
    CONSTRAINT fk_lesson_to_chapter
                    FOREIGN KEY (chapter_id)
                    REFERENCES chapter (id)
                    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Section (소분류) -Lesson에 종속
CREATE TABLE section (
    id BIGINT NOT NULL AUTO_INCREMENT,
    section_number INTEGER NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    lesson_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_section_lesson (lesson_id),
    CONSTRAINT fk_section_to_lesson
                     FOREIGN KEY (lesson_id)
                     REFERENCES lesson (id)
                     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Subsection (상세분류) - Section에 종속
CREATE TABLE subsection (
    id BIGINT NOT NULL AUTO_INCREMENT,
    subsection_number INTEGER NOT NULL,
    subsection_title VARCHAR(255) NOT NULL,
    section_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_subsection_section (section_id),
    CONSTRAINT fk_subsection_to_section
                        FOREIGN KEY (section_id)
                        REFERENCES section (id)
                        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Topic (주제) - Subsection에 종속
CREATE TABLE topic (
    id BIGINT NOT NULL AUTO_INCREMENT,
    topic_number INTEGER NOT NULL,
    topic_title VARCHAR(255) NOT NULL,
    subsection_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_topic_subsection (subsection_id),
    CONSTRAINT fk_topic_to_subsection
                   FOREIGN KEY (subsection_id)
                   REFERENCES subsection (id)
                   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Keyword (키워드 그룹) - Topic에 종속
CREATE TABLE keyword (
    id BIGINT NOT NULL AUTO_INCREMENT,
    keyword_number INTEGER NOT NULL,
    topic_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_keyword_topic (topic_id),
    CONSTRAINT fk_keyword_to_topic
                     FOREIGN KEY (topic_id)
                     REFERENCES topic (id)
                     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. keywords (Keyword의 @ElementCollection) - Keyword에 종속
CREATE TABLE keywords (
                          keywords_id BIGINT NOT NULL,
                          keywords_value VARCHAR(255),
                          KEY idx_keywords_keyword (keywords_id),
                          CONSTRAINT fk_keywords_to_keyword
                              FOREIGN KEY (keywords_id)
                                  REFERENCES keyword (id)
                                  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Content (상세 내용) - Keyword에 종속
CREATE TABLE content (
    id BIGINT NOT NULL AUTO_INCREMENT,
    keyword_id BIGINT,
    PRIMARY KEY (id),
    KEY idx_content_keyword (keyword_id),
    CONSTRAINT fk_content_to_keyword
                     FOREIGN KEY (keyword_id)
                     REFERENCES keyword (id)
                     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. details (Content의 @ElementCollection) - Content에 종속
CREATE TABLE details (
    detail_id BIGINT NOT NULL,
    detail_value TEXT, -- 상세 설명이므로 VARCHAR(255) 대신 TEXT를 사용
    KEY idx_details_content (detail_id),
    CONSTRAINT fk_details_to_content
                     FOREIGN KEY (detail_id)
                     REFERENCES content (id)
                     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
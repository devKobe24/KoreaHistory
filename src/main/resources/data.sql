-- ########## 1. Chapter (대분류) 생성 ##########
INSERT INTO chapter (chapter_number, chapter_title) VALUES (1, '선사시대');
INSERT INTO chapter (chapter_number, chapter_title) VALUES (2, '고대');

-- ########## 2. Lesson (중분류) 생성 ##########
INSERT INTO lesson (lesson_number, lesson_title, chapter_id) VALUES (1, '구석기 시대 ~ 철기 시대', (SELECT id FROM chapter WHERE chapter_title = '선사시대'));
INSERT INTO lesson (lesson_number, lesson_title, chapter_id) VALUES (2, '고조선과 여러 나라의 성장', (SELECT id FROM chapter WHERE chapter_title = '선사시대'));

-- ########## 3. Section (소분류) 생성 ##########
INSERT INTO section (section_number, section_title, lesson_id) VALUES (1, '구석기 시대와 신석기 시대', (SELECT id FROM lesson WHERE lesson_title = '구석기 시대 ~ 철기 시대'));
INSERT INTO section (section_number, section_title, lesson_id) VALUES (2, '청동기 시대와 철기 시대', (SELECT id FROM lesson WHERE lesson_title = '구석기 시대 ~ 철기 시대'));

-- ########## 4. Subsection 생성 ##########
INSERT INTO subsection (subsection_number, subsection_title, section_id) VALUES (1, '구석기 시대의 생활', (SELECT id FROM section WHERE section_title = '구석기 시대와 신석기 시대'));

-- ########## 5. Topic 생성 ##########
INSERT INTO topic (topic_number, topic_title, subsection_id) VALUES (1, '도구의 사용', (SELECT id FROM subsection WHERE subsection_title = '구석기 시대의 생활'));

-- ########## 6. Keyword 생성 (lesson_id -> topic_id로 변경) ##########
INSERT INTO keyword (keyword_number, keyword, topic_id) VALUES (1, '뗀석기', (SELECT id FROM topic WHERE topic_title = '도구의 사용'));
INSERT INTO keyword (keyword_number, keyword, topic_id) VALUES (2, '숨베찌르개', (SELECT id FROM topic WHERE topic_title = '도구의 사용'));
INSERT INTO keyword (keyword_number, keyword, topic_id) VALUES (3, '주요 뗀석기', (SELECT id FROM topic WHERE topic_title = '도구의 사용'));

-- ########## 7. Content 생성 ##########
INSERT INTO content (detail, keyword_id) VALUES ('돌을 깨뜨리고 떼어내어 날을 만든 도구인 뗀석기를 주로 사용하였다.', (SELECT id FROM keyword WHERE keyword = '뗀석기'));
INSERT INTO content (detail, keyword_id) VALUES ('숨베(뾰족하고 긴 부분)를 나무에 꽂아 창과 같은 용도로 사용한 뗀석기', (SELECT id FROM keyword WHERE keyword = '숨베찌르개'));
INSERT INTO content (detail, keyword_id) VALUES ('주먹도끼, 찍개, 숨베찌르개, 찌르개, 밀개, 긁개 등이 있다', (SELECT id FROM keyword WHERE keyword = '주요 뗀석기'));
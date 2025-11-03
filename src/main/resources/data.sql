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
INSERT INTO subsection (subsection_number, subsection_title, section_id) VALUES (1, '구석기 시대', (SELECT id FROM section WHERE section_title = '구석기 시대와 신석기 시대'));

-- ########## 5. Topic 생성 ##########
INSERT INTO topic (topic_number, topic_title, subsection_id) VALUES (1, '도구', (SELECT id FROM subsection WHERE subsection_title = '구석기 시대'));
INSERT INTO topic (topic_number, topic_title, subsection_id) VALUES (2, '생활 모습', (SELECT id FROM subsection WHERE subsection_title = '구석기 시대'));
INSERT INTO topic (topic_number, topic_title, subsection_id) VALUES (3, '사회', (SELECT id FROM subsection WHERE subsection_title = '구석기 시대'));
INSERT INTO topic (topic_number, topic_title, subsection_id) VALUES (4, '주요 유적', (SELECT id FROM subsection WHERE subsection_title = '구석기 시대'));

-- ########## 6. Keyword (부모) 생성 ##########
INSERT INTO keyword (keyword_number, topic_id) VALUES (1, (SELECT id FROM topic WHERE topic_title = '도구'));
INSERT INTO keyword (keyword_number, topic_id) VALUES (2, (SELECT id FROM topic WHERE topic_title = '도구'));
INSERT INTO keyword (keyword_number, topic_id) VALUES (3, (SELECT id FROM topic WHERE topic_title = '생활 모습'));
INSERT INTO keyword (keyword_number, topic_id) VALUES (4, (SELECT id FROM topic WHERE topic_title = '생활 모습'));
INSERT INTO keyword (keyword_number, topic_id) VALUES (5, (SELECT id FROM topic WHERE topic_title = '사회'));
INSERT INTO keyword (keyword_number, topic_id) VALUES (6, (SELECT id FROM topic WHERE topic_title = '주요 유적'));

-- ########## 6-1. Keywords (자식) 생성 ##########
-- [추가] 위에서 생성한 Keyword 그룹에 실제 키워드 문자열들을 추가합니다.
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 1), '뗀석기');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '주요 뗀석기');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '주먹 도끼');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '찍개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '슴베찌르개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '찌르개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '밀개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 2), '긁개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '경제');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '사냥');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '채집');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '어로');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '물고기잡이');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 3), '식량');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '주거');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '이동 생활');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '식량');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '동굴');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '강가');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '막집');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 4), '거주');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 5), '사회');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 5), '계급');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 5), '평등');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 5), '공동체 생활');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '공주');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '석장리');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '공주 석장리');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '공주 석장리 유적');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '연천');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '전곡리');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '연천 전곡리');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '연천 전곡리 유적');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '딘양');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '수양개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '단양 수양개');
INSERT INTO keywords (keywords_id, keywords_value) VALUES ((SELECT id FROM keyword WHERE keyword_number = 6), '단양 수양개 유적');

-- ########## 7. Content(부모) 생성 ##########
INSERT INTO content (content_number, content_title, keyword_id) VALUES (1, '뗀석기', 1);
INSERT INTO content (content_number, content_title, keyword_id) VALUES (2, '주요 뗀석기', 2);
INSERT INTO content (content_number, content_title, keyword_id) VALUES (3, 'Content 3', 3);
INSERT INTO content (content_number, content_title, keyword_id) VALUES (4, 'Content 4', 4);
INSERT INTO content (content_number, content_title, keyword_id) VALUES (5, 'Content 5', 5);
INSERT INTO content (content_number, content_title, keyword_id) VALUES (6, 'Content 6', 6);

-- ########## 7-1. Details (자식) 생성 ##########
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 1), '뗀석기 : 돌을 깨뜨리고 떼어내러 날을 만든 도구인 뗀석기를 주로 사용하였다.');
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 2), '주요 뗀석기 : 주먹 도끼, 찍개, 슴베찌르개, 찌르개, 밀개, 긁개, 등이 있다.');
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 3), '경제 : 사냥과 채집, 어로(물고기잡이) 활동을 통해 식량을 구하였다.');
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 4), '주거 : 식량을 찾아 이동 생활을 하며 주로 동굴이나 강가의 막집에서 거주하였다.');
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 5), '사회 : 계급이 없는 평등한 공동체 생활을 하였다.');
INSERT INTO details (detail_id, detail_value) VALUES ((SELECT id FROM content WHERE keyword_id = 6), '주요 유적 : 공주 석장리 유적, 연천 전곡리 유적, 딘양 수양개 유적 등이 있다.');
-- "대분류" 생성
INSERT INTO chapter (chapter_number, chapter_title) VALUES ('1', '선사시대');

-- "소분류" 생성
INSERT INTO lesson (lesson_number, lesson_title, chapter_id) VALUES (1, '구석기 시대 ~ 철기 시대', (SELECT id FROM chapter WHERE chapter_number = 1 LIMIT 1));
INSERT INTO lesson (lesson_number, lesson_title, chapter_id) VALUES (2, '고조선과 여러 나라의 성장', (SELECT id FROM chapter WHERE chapter_number = 1 LIMIT 1));

-- "키워드" 생성
INSERT INTO keyword (keyword, lesson_id) VALUES ('뗀석기', (SELECT ls.id FROM lesson ls JOIN chapter c ON c.id = ls.chapter_id WHERE c.chapter_number = 1 AND ls.lesson_number = 1 LIMIT 1));
INSERT INTO keyword (keyword, lesson_id) VALUES ('숨베찌르개', (SELECT ls.id FROM lesson ls JOIN chapter c ON c.id = ls.chapter_id WHERE c.chapter_number = 1 AND ls.lesson_number = 1 LIMIT 1));
INSERT INTO keyword (keyword, lesson_id) VALUES ('주요 뗀석기', (SELECT ls.id FROM lesson ls JOIN chapter c ON c.id = ls.chapter_id WHERE c.chapter_number = 1 AND ls.lesson_number = 1 LIMIT 1));

-- "콘텐츠" 생성
INSERT INTO content (main_category, sub_category, detail) VALUES ('1. 구석기 시대', '(1) 도구', '① 뗀석기: 돌을 깨뜨리고 떼어 내어 날을 만든 도구인 "뗀석기를 주로 사용"하였다.');
INSERT INTO content (main_category, sub_category, detail) VALUES ('1. 구석기 시대', '(1) 도구', '숨베(뾰족하고 긴 부분)를 나무레 꽂아 창과 같은 용도로 사용한 뗀석기');
INSERT INTO content (main_category, sub_category, detail) VALUES ('1. 구석기 시대', '(1) 도구', '② 주요 뗀석기: "주먹도끼", "찍개", "슴베찌르개", 찌르개, 밀개, 긁개 등이 있다.');

-- "키워트 콘텐츠" 생성
INSERT INTO keyword_content (keyword_id) VALUES ((SELECT id FROM keyword WHERE keyword = '뗀석기' LIMIT 1));
INSERT INTO keyword_content (keyword_id) VALUES ((SELECT id FROM keyword WHERE keyword = '숨베찌르개' LIMIT 1));
INSERT INTO keyword_content (keyword_id) VALUES ((SELECT id FROM keyword WHERE keyword = '주요 뗀석기' LIMIT 1));

-- "키워드 콘텐츠의 콘텐츠" 생성
INSERT INTO keyword_content_contents (keyword_content_id, content_id) VALUES ((SELECT id FROM keyword_content WHERE keyword_id = (SELECT id FROM keyword WHERE keyword='뗀석기' LIMIT 1)), (SELECT id FROM content WHERE main_category='1. 구석기 시대' AND sub_category='(1) 도구' AND detail='① 뗀석기: 돌을 깨뜨리고 떼어 내어 날을 만든 도구인 "뗀석기를 주로 사용"하였다.'));
INSERT INTO keyword_content_contents (keyword_content_id, content_id) VALUES ((SELECT id FROM keyword_content WHERE keyword_id = (SELECT id FROM keyword WHERE keyword='숨베찌르개' LIMIT 1)), (SELECT id FROM content WHERE main_category='1. 구석기 시대' AND sub_category='(1) 도구' AND detail='숨베(뾰족하고 긴 부분)를 나무레 꽂아 창과 같은 용도로 사용한 뗀석기'));
INSERT INTO keyword_content_contents (keyword_content_id, content_id) VALUES ((SELECT id FROM keyword_content WHERE keyword_id = (SELECT id FROM keyword WHERE keyword='주요 뗀석기' LIMIT 1)), (SELECT id FROM content WHERE main_category='1. 구석기 시대' AND sub_category='(1) 도구' AND detail='② 주요 뗀석기: "주먹도끼", "찍개", "슴베찌르개", 찌르개, 밀개, 긁개 등이 있다.'));
-- ============================================================
-- V4__Migrate_Details_To_ContentBlocks.sql
-- 기존 details 데이터를 ContentBlock으로 마이그레이션
-- ============================================================

-- **주의**: 이 마이그레이션은 수동으로 실행해야 합니다.
-- 기존 details 데이터가 있는 Content를 찾아서 ContentBlock (TEXT 타입)으로 변환합니다.

-- 마이그레이션 전략:
-- 1. details에 데이터가 있고 contentType/blockData가 NULL인 경우만 마이그레이션
-- 2. details를 TextBlock JSON 형식으로 변환
-- 3. content_type을 'TEXT'로 설정

-- 예시 마이그레이션 쿼리 (실제 사용 시 SQL 스크립트로 실행):
-- 
-- UPDATE content c
-- SET
--   c.content_type = 'TEXT',
--   c.block_data = CONCAT(
--     '{"title": "', 
--     REPLACE(c.content_title, '"', '\\"'), 
--     '", "text": "',
--     REPLACE(
--       (SELECT GROUP_CONCAT(detail_value SEPARATOR ' ') 
--        FROM details 
--        WHERE detail_id = c.id),
--       '"', '\\"'
--     ),
--     '"}'
--   )
-- WHERE 
--   c.id IN (
--     SELECT DISTINCT detail_id 
--     FROM details 
--     WHERE detail_id IN (SELECT id FROM content)
--   )
--   AND c.content_type IS NULL
--   AND c.block_data IS NULL;

-- **참고**: 실제 프로덕션 환경에서는 Spring Batch나 
--   별도의 Java 스크립트로 더 안전하게 마이그레이션하는 것을 권장합니다.


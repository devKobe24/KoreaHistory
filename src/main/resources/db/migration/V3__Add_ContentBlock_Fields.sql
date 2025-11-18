-- ContentBlock을 위한 새로운 필드 추가
-- contentType: ContentBlock 타입 ("TEXT", "TABLE", "TIMELINE", "COMPARISON_TABLE", "HERITAGE", "IMAGE_GALLERY")
-- blockData: JSON 형태의 ContentBlock 데이터

-- Content 테이블에 새로운 컬럼 추가
ALTER TABLE content ADD COLUMN content_type VARCHAR(50);
ALTER TABLE content ADD COLUMN block_data TEXT;

-- 기존 details 데이터를 유지하면서 새로운 필드는 NULL로 유지
-- (나중에 점진적으로 마이그레이션할 수 있도록)

-- 참고: 
-- - 기존 방식: details 컬럼에 문자열 배열 저장
-- - 새로운 방식: contentType과 blockData로 ContentBlock 구조화 데이터 저장
-- - 두 방식 모두 지원하여 하위 호환성 유지


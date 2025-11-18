-- Add keyword_title column to keyword table
-- H2와 MySQL 호환성을 위해 기본값을 'Untitled'로 설정
ALTER TABLE keyword 
ADD COLUMN keyword_title VARCHAR(255) NOT NULL DEFAULT 'Untitled' AFTER keyword_number;


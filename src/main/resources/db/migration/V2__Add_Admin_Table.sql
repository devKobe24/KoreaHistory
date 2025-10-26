-- Admin 테이블 생성
CREATE TABLE admin (
    id BIGINT NOT NULL AUTO_INCREMENT,
    admin_id VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_id (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ########## 0. Admin (관리자) 생성 ##########
INSERT INTO admin (admin_id, password) VALUES ('admin', 'admin123');
INSERT INTO admin (admin_id, password) VALUES ('kobe', 'kobe123');
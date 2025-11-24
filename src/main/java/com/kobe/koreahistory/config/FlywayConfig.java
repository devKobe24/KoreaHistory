package com.kobe.koreahistory.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

/**
 * packageName    : com.kobe.koreahistory.config
 * fileName       : FlywayConfig
 * author         : kobe
 * date           : 2025. 11. 23.
 * description    : Flyway 설정 - MySQL 데이터소스인 경우에만 활성화
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 11. 23.        kobe       최초 생성
 */
@Configuration
public class FlywayConfig {

    /**
     * 데이터소스가 MySQL인 경우에만 Flyway 마이그레이션 실행
     * AWS Secrets Manager 설정이 실패하여 H2 데이터소스가 사용되는 경우 마이그레이션을 건너뜁니다.
     */
    @Bean
    @ConditionalOnProperty(name = "spring.flyway.enabled", havingValue = "true", matchIfMissing = false)
    public FlywayMigrationStrategy flywayMigrationStrategy(@Autowired(required = false) DataSource dataSource) {
        return flyway -> {
            if (dataSource == null) {
                System.out.println("Flyway: 데이터소스가 설정되지 않았으므로 마이그레이션을 건너뜁니다.");
                return;
            }
            
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                String databaseProductName = metaData.getDatabaseProductName();
                String jdbcUrl = metaData.getURL();
                
                // MySQL인 경우에만 마이그레이션 실행
                if (databaseProductName != null && databaseProductName.toLowerCase().contains("mysql")) {
                    System.out.println("Flyway: MySQL 데이터소스 감지 - 마이그레이션을 실행합니다. (URL: " + jdbcUrl + ")");
                    flyway.migrate();
                } else {
                    System.out.println("Flyway: 데이터소스가 MySQL이 아니므로 마이그레이션을 건너뜁니다. (현재: " + databaseProductName + ", URL: " + jdbcUrl + ")");
                }
            } catch (Exception e) {
                // 데이터소스 연결 실패 시 마이그레이션을 건너뛰고 애플리케이션은 계속 실행
                String errorMessage = e.getMessage();
                if (errorMessage != null && errorMessage.contains("Communications link failure")) {
                    System.out.println("Flyway: MySQL 데이터베이스 서버에 연결할 수 없습니다. 마이그레이션을 건너뜁니다.");
                    System.out.println("Flyway: 네트워크 연결, 보안 그룹 설정, 또는 데이터베이스 서버 상태를 확인하세요.");
                } else {
                    System.out.println("Flyway: 데이터소스 확인 중 오류 발생 - " + errorMessage);
                }
                // 스택 트레이스는 출력하지 않음 (로그가 너무 길어짐)
            }
        };
    }
}


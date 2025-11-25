package com.kobe.koreahistory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * packageName    : com.kobe.koreahistory.config
 * fileName       : WebConfig
 * author         : kobe
 * date           : 2025. 10. 21.
 * description    : CORS 설정을 위한 WebMvcConfigurer 구현
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 21.        kobe       최초 생성
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "https://a-tti.com",
                        "https://www.a-tti.com",
                        "https://a-tti-admin.com",
                        "https://www.a-tti-admin.com",
                        "http://localhost:8080",
                        "http://127.0.0.1:8080"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /web/** 경로로 요청이 오면 classpath:/static/web/에서 정적 리소스를 찾음
        registry.addResourceHandler("/web/**")
                .addResourceLocations("classpath:/static/web/");
        
        // /admin/** 경로로 요청이 오면 classpath:/static/admin/에서 정적 리소스를 찾음
        registry.addResourceHandler("/admin/**")
                .addResourceLocations("classpath:/static/admin/");
        
        // forward:/index.html을 지원하기 위해 루트 경로의 정적 파일도 처리
        // 하지만 컨트롤러가 우선 처리되도록 순서 조정
        registry.addResourceHandler("/index.html", "/pages/**", "/css/**", "/js/**")
                .addResourceLocations("classpath:/static/web/");
    }
}

package sms.swp391.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import sms.swp391.security.JwtAuthenticationEntryPoint;
import sms.swp391.security.JwtAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CorsConfig corsConfig;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable) // Tắt bảo vệ CSRF
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/v1/auth/**").permitAll() // Cho phép tất cả các yêu cầu đến endpoint xác thực
                        .requestMatchers("/swagger-ui/**").permitAll() // Cho phép truy cập Swagger UI
                        .requestMatchers("/v3/api-docs/**").permitAll() // Cho phép truy cập tài liệu API
                        .requestMatchers("api/v1/test/**").permitAll()
                        .requestMatchers("/api/v1/OTP/**").permitAll()
                        .requestMatchers("/api/v1/mail/**").permitAll()


                        //user
                        .requestMatchers(HttpMethod.PUT, "/api/v1/user/change-password").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/user/forget-password").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/user/register").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/user/create").permitAll()


                        .anyRequest().authenticated() // Các yêu cầu khác đều cần xác thực
                ).cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không lưu trạng thái phiên
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint) // Xử lý lỗi xác thực
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    //            .cors(cors ->cors.disable()); // Thêm bộ lọc JWT
        return httpSecurity.build();
    }

}

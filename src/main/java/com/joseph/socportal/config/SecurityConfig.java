package com.joseph.socportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public InMemoryUserDetailsManager users(PasswordEncoder encoder) {

                UserDetails analyst = User.builder()
                                .username("analyst")
                                .password(encoder.encode("password"))
                                .roles("ANALYST")
                                .build();

                UserDetails isso = User.builder()
                                .username("isso")
                                .password(encoder.encode("password"))
                                .roles("ISSO")
                                .build();

                UserDetails admin = User.builder()
                                .username("admin")
                                .password(encoder.encode("password"))
                                .roles("ADMIN")
                                .build();

                return new InMemoryUserDetailsManager(analyst, isso, admin);
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers("/css/**", "/js/**", "/login").permitAll()

                                                .requestMatchers("/").hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/profile/**").hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/settings/**")
                                                .hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/access-denied")
                                                .hasAnyRole("ANALYST", "ISSO", "ADMIN")

                                                .requestMatchers("/alerts/**").hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/incidents/**").hasAnyRole("ANALYST", "ISSO", "ADMIN")

                                                .requestMatchers("/assets/**").hasAnyRole("ISSO", "ADMIN")
                                                .requestMatchers("/vulnerabilities/**").hasAnyRole("ISSO", "ADMIN")

                                                .requestMatchers("/api/alerts/**")
                                                .hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/api/incidents/**")
                                                .hasAnyRole("ANALYST", "ISSO", "ADMIN")
                                                .requestMatchers("/api/assets/**").hasAnyRole("ISSO", "ADMIN")
                                                .requestMatchers("/api/vulnerabilities/**").hasAnyRole("ISSO", "ADMIN")

                                                .anyRequest().authenticated())

                                .formLogin(form -> form
                                                .loginPage("/login")
                                                .defaultSuccessUrl("/", true)
                                                .failureUrl("/login?error")
                                                .permitAll())

                                .logout(logout -> logout
                                                .logoutSuccessUrl("/login?logout")
                                                .permitAll())

                                .exceptionHandling(exception -> exception
                                                .accessDeniedPage("/access-denied"));

                return http.build();
        }
}
package com.joseph.socportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;
    private String username;
    private String action;
    private String module;

    @Column(length = 1000)
    private String details;

    public AuditLog() {
    }

    public AuditLog(String username, String action, String module, String details) {
        this.timestamp = LocalDateTime.now();
        this.username = username;
        this.action = action;
        this.module = module;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getUsername() {
        return username;
    }

    public String getAction() {
        return action;
    }

    public String getModule() {
        return module;
    }

    public String getDetails() {
        return details;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
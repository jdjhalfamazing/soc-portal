package com.joseph.socportal.model;

import jakarta.persistence.*;

@Entity
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String severity;
    private String title;
    private String host;
    private String status;

    public Alert() {
    }

    public Alert(String severity, String title, String host, String status) {
        this.severity = severity;
        this.title = title;
        this.host = host;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
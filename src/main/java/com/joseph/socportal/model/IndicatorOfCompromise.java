package com.joseph.socportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "indicator_of_compromise")
public class IndicatorOfCompromise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String value;
    private String type;
    private String threatLevel;
    private String status;
    private String source;

    @Column(length = 1000)
    private String description;

    public IndicatorOfCompromise() {
    }

    public IndicatorOfCompromise(
            String value,
            String type,
            String threatLevel,
            String status,
            String source,
            String description) {

        this.value = value;
        this.type = type;
        this.threatLevel = threatLevel;
        this.status = status;
        this.source = source;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getThreatLevel() {
        return threatLevel;
    }

    public void setThreatLevel(String threatLevel) {
        this.threatLevel = threatLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
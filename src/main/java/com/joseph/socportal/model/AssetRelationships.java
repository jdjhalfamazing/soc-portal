package com.joseph.socportal.model;

import java.util.List;

public class AssetRelationships {

    private Asset asset;
    private List<Alert> alerts;
    private List<Vulnerability> vulnerabilities;
    private List<Incident> incidents;

    public AssetRelationships() {
    }

    public AssetRelationships(Asset asset,
            List<Alert> alerts,
            List<Vulnerability> vulnerabilities,
            List<Incident> incidents) {
        this.asset = asset;
        this.alerts = alerts;
        this.vulnerabilities = vulnerabilities;
        this.incidents = incidents;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }

    public List<Vulnerability> getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(List<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public List<Incident> getIncidents() {
        return incidents;
    }

    public void setIncidents(List<Incident> incidents) {
        this.incidents = incidents;
    }
}
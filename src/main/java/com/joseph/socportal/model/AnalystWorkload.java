package com.joseph.socportal.model;

public class AnalystWorkload {

    private String analyst;
    private int incidents;
    private int vulnerabilities;
    private int total;

    public AnalystWorkload() {
    }

    public AnalystWorkload(String analyst, int incidents, int vulnerabilities) {
        this.analyst = analyst;
        this.incidents = incidents;
        this.vulnerabilities = vulnerabilities;
        this.total = incidents + vulnerabilities;
    }

    public String getAnalyst() {
        return analyst;
    }

    public void setAnalyst(String analyst) {
        this.analyst = analyst;
    }

    public int getIncidents() {
        return incidents;
    }

    public void setIncidents(int incidents) {
        this.incidents = incidents;
        this.total = this.incidents + this.vulnerabilities;
    }

    public int getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(int vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
        this.total = this.incidents + this.vulnerabilities;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
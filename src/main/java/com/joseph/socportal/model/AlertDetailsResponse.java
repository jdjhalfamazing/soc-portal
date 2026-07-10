package com.joseph.socportal.model;

public class AlertDetailsResponse {

    private Alert alert;
    private Asset relatedAsset;

    public AlertDetailsResponse() {
    }

    public AlertDetailsResponse(Alert alert, Asset relatedAsset) {
        this.alert = alert;
        this.relatedAsset = relatedAsset;
    }

    public Alert getAlert() {
        return alert;
    }

    public void setAlert(Alert alert) {
        this.alert = alert;
    }

    public Asset getRelatedAsset() {
        return relatedAsset;
    }

    public void setRelatedAsset(Asset relatedAsset) {
        this.relatedAsset = relatedAsset;
    }
}
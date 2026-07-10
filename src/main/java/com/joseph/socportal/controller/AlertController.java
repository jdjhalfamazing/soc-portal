package com.joseph.socportal.controller;

import com.joseph.socportal.model.Alert;
import com.joseph.socportal.model.AlertDetailsResponse;
import com.joseph.socportal.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @GetMapping("/{id}")
    public Alert getAlertById(@PathVariable Long id) {
        return alertService.getAlertById(id);
    }

    @PostMapping
    public Alert createAlert(@RequestBody Alert alert) {
        return alertService.saveAlert(alert);
    }

    @PutMapping("/{id}/status")
    public Alert updateAlertStatus(@PathVariable Long id,
            @RequestBody Alert updatedAlert) {

        Alert alert = alertService.getAlertById(id);
        alert.setStatus(updatedAlert.getStatus());

        return alertService.saveAlert(alert);
    }

    @PutMapping("/{id}")
    public Alert updateAlert(@PathVariable Long id,
            @RequestBody Alert updatedAlert) {

        Alert alert = alertService.getAlertById(id);

        alert.setSeverity(updatedAlert.getSeverity());
        alert.setHost(updatedAlert.getHost());
        alert.setTitle(updatedAlert.getTitle());
        alert.setStatus(updatedAlert.getStatus());

        return alertService.saveAlert(alert);
    }

    @GetMapping("/{id}/details")
    public AlertDetailsResponse getAlertDetails(@PathVariable Long id) {
        return alertService.getAlertDetails(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
    }
}
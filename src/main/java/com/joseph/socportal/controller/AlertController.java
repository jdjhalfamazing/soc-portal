package com.joseph.socportal.controller;

import com.joseph.socportal.model.Alert;
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

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
    }
}
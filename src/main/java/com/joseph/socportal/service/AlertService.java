package com.joseph.socportal.service;

import com.joseph.socportal.model.Alert;
import com.joseph.socportal.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Alert saveAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert getAlertById(Long id) {
        return alertRepository.findById(id).orElseThrow();
    }

    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }

}
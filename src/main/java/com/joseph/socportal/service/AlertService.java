package com.joseph.socportal.service;

import com.joseph.socportal.model.Alert;
import com.joseph.socportal.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AlertService(AlertRepository alertRepository,
            NotificationService notificationService,
            AuditLogService auditLogService) {

        this.alertRepository = alertRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Alert saveAlert(Alert alert) {
        Alert savedAlert = alertRepository.save(alert);

        System.out.println("ALERT SAVED: " + savedAlert.getTitle());

        notificationService.addNotification(
                savedAlert.getSeverity() + " Alert",
                savedAlert.getTitle(),
                savedAlert.getSeverity().toLowerCase());

        System.out.println("NOTIFICATION COUNT: " + notificationService.getNotifications().size());
        auditLogService.log(
                "Joseph",
                "Created",
                "Alert",
                savedAlert.getSeverity() + " alert created on " + savedAlert.getHost());

        return savedAlert;
    }

    public Alert getAlertById(Long id) {
        return alertRepository.findById(id).orElseThrow();
    }

    public void deleteAlert(Long id) {

        Alert alert = getAlertById(id);

        auditLogService.log(
                "Joseph",
                "Deleted",
                "Alert",
                alert.getTitle());

        alertRepository.deleteById(id);
    }
}
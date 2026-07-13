package com.joseph.socportal.service;

import com.joseph.socportal.model.IndicatorOfCompromise;
import com.joseph.socportal.repository.IndicatorOfCompromiseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IndicatorOfCompromiseService {

    private final IndicatorOfCompromiseRepository iocRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public IndicatorOfCompromiseService(
            IndicatorOfCompromiseRepository iocRepository,
            NotificationService notificationService,
            AuditLogService auditLogService) {

        this.iocRepository = iocRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<IndicatorOfCompromise> getAllIndicators() {
        return iocRepository.findAll();
    }

    public IndicatorOfCompromise getIndicatorById(Long id) {
        return iocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IOC not found"));
    }

    public IndicatorOfCompromise saveIndicator(
            IndicatorOfCompromise indicator) {

        boolean isNew = indicator.getId() == null;

        IndicatorOfCompromise savedIndicator = iocRepository.save(indicator);

        if (isNew) {
            notificationService.addNotification(
                    savedIndicator.getThreatLevel() + " IOC Added",
                    savedIndicator.getType() + ": " + savedIndicator.getValue(),
                    savedIndicator.getThreatLevel().toLowerCase());
        }

        auditLogService.log(
                "Joseph",
                isNew ? "Created" : "Updated",
                "IOC",
                savedIndicator.getType() + " - " + savedIndicator.getValue());

        return savedIndicator;
    }

    public void deleteIndicator(Long id) {
        IndicatorOfCompromise indicator = getIndicatorById(id);

        auditLogService.log(
                "Joseph",
                "Deleted",
                "IOC",
                indicator.getType() + " - " + indicator.getValue());

        iocRepository.deleteById(id);
    }
}
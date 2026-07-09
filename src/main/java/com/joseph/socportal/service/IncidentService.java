package com.joseph.socportal.service;

import com.joseph.socportal.model.Incident;
import com.joseph.socportal.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public IncidentService(IncidentRepository incidentRepository,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.incidentRepository = incidentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident saveIncident(Incident incident) {

        Incident savedIncident = incidentRepository.save(incident);

        notificationService.addNotification(
                "New Incident",
                savedIncident.getIncidentNumber() + " - " + savedIncident.getTitle(),
                savedIncident.getPriority().toLowerCase());

        auditLogService.log(
                "Joseph",
                "Created/Updated",
                "Incident",
                savedIncident.getIncidentNumber() + " - " + savedIncident.getTitle());

        return savedIncident;
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id).orElseThrow();
    }

    public void deleteIncident(Long id) {

        Incident incident = getIncidentById(id);

        auditLogService.log(
                "Joseph",
                "Deleted",
                "Incident",
                incident.getIncidentNumber() + " - " + incident.getTitle());

        incidentRepository.deleteById(id);
    }
}
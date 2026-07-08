package com.joseph.socportal.service;

import com.joseph.socportal.model.Incident;
import com.joseph.socportal.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository,
            NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.notificationService = notificationService;
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

        return savedIncident;
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id).orElseThrow();
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
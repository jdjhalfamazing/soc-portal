package com.joseph.socportal.service;

import com.joseph.socportal.model.Incident;
import com.joseph.socportal.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id).orElseThrow();
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
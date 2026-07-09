package com.joseph.socportal.controller;

import com.joseph.socportal.model.Incident;
import com.joseph.socportal.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.saveIncident(incident);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id,
            @RequestBody Incident updatedIncident) {

        Incident incident = incidentService.getIncidentById(id);

        incident.setIncidentNumber(updatedIncident.getIncidentNumber());
        incident.setTitle(updatedIncident.getTitle());
        incident.setPriority(updatedIncident.getPriority());
        incident.setStatus(updatedIncident.getStatus());
        incident.setAssignedTo(updatedIncident.getAssignedTo());
        incident.setDescription(updatedIncident.getDescription());

        return incidentService.saveIncident(incident);
    }

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
    }

    @PutMapping("/{id}/status")
    public Incident updateIncidentStatus(@PathVariable Long id,
            @RequestBody Incident updatedIncident) {

        Incident incident = incidentService.getIncidentById(id);

        incident.setStatus(updatedIncident.getStatus());

        return incidentService.saveIncident(incident);
    }
}
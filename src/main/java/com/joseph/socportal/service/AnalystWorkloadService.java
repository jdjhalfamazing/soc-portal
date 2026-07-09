package com.joseph.socportal.service;

import com.joseph.socportal.model.AnalystWorkload;
import com.joseph.socportal.model.Incident;
import com.joseph.socportal.model.Vulnerability;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalystWorkloadService {

    private final IncidentService incidentService;
    private final VulnerabilityService vulnerabilityService;

    public AnalystWorkloadService(IncidentService incidentService,
            VulnerabilityService vulnerabilityService) {
        this.incidentService = incidentService;
        this.vulnerabilityService = vulnerabilityService;
    }

    public List<AnalystWorkload> getWorkload() {
        Map<String, AnalystWorkload> workloadMap = new HashMap<>();

        for (Incident incident : incidentService.getAllIncidents()) {
            String analyst = incident.getAssignedTo();

            if (analyst == null || analyst.isBlank()) {
                analyst = "Unassigned";
            }

            workloadMap.putIfAbsent(analyst, new AnalystWorkload(analyst, 0, 0));

            AnalystWorkload workload = workloadMap.get(analyst);
            workload.setIncidents(workload.getIncidents() + 1);
        }

        for (Vulnerability vulnerability : vulnerabilityService.getAllVulnerabilities()) {
            String analyst = vulnerability.getAssignedTo();

            if (analyst == null || analyst.isBlank()) {
                analyst = "Unassigned";
            }

            workloadMap.putIfAbsent(analyst, new AnalystWorkload(analyst, 0, 0));

            AnalystWorkload workload = workloadMap.get(analyst);
            workload.setVulnerabilities(workload.getVulnerabilities() + 1);
        }

        return new ArrayList<>(workloadMap.values());
    }
}
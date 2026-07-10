package com.joseph.socportal.service;

import com.joseph.socportal.model.Alert;
import com.joseph.socportal.model.Asset;
import com.joseph.socportal.model.AssetRelationships;
import com.joseph.socportal.model.Incident;
import com.joseph.socportal.model.Vulnerability;
import com.joseph.socportal.repository.AlertRepository;
import com.joseph.socportal.repository.AssetRepository;
import com.joseph.socportal.repository.IncidentRepository;
import com.joseph.socportal.repository.VulnerabilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final AlertRepository alertRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AssetService(
            AssetRepository assetRepository,
            AlertRepository alertRepository,
            VulnerabilityRepository vulnerabilityRepository,
            IncidentRepository incidentRepository,
            NotificationService notificationService,
            AuditLogService auditLogService) {

        this.assetRepository = assetRepository;
        this.alertRepository = alertRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.incidentRepository = incidentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset saveAsset(Asset asset) {
        boolean isNew = asset.getId() == null;

        Asset savedAsset = assetRepository.save(asset);

        if (isNew) {
            notificationService.addNotification(
                    "New Asset Added",
                    savedAsset.getHostname() + " has been added.",
                    "info");
        }

        auditLogService.log(
                "Joseph",
                isNew ? "Created" : "Updated",
                "Asset",
                savedAsset.getHostname() + " - " + savedAsset.getIpAddress());

        return savedAsset;
    }

    public void deleteAsset(Long id) {
        Asset asset = getAssetById(id);

        auditLogService.log(
                "Joseph",
                "Deleted",
                "Asset",
                asset.getHostname());

        assetRepository.deleteById(id);
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
    }

    public AssetRelationships getAssetRelationships(Long id) {
        Asset asset = getAssetById(id);

        List<Alert> alerts = alertRepository.findByHost(asset.getHostname());

        List<Vulnerability> vulnerabilities = vulnerabilityRepository.findByHostname(asset.getHostname());

        List<Incident> incidents = incidentRepository.findAll()
                .stream()
                .filter(incident -> incident.getDescription() != null &&
                        incident.getDescription()
                                .toLowerCase()
                                .contains(asset.getHostname().toLowerCase()))
                .toList();

        return new AssetRelationships(
                asset,
                alerts,
                vulnerabilities,
                incidents);
    }
}
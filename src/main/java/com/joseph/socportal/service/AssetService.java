package com.joseph.socportal.service;

import com.joseph.socportal.model.Asset;
import com.joseph.socportal.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final NotificationService notificationService;

    public AssetService(AssetRepository assetRepository,
            NotificationService notificationService) {
        this.assetRepository = assetRepository;
        this.notificationService = notificationService;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset saveAsset(Asset asset) {

        Asset savedAsset = assetRepository.save(asset);

        notificationService.addNotification(
                "New Asset Added",
                savedAsset.getHostname() + " has been added.",
                "info");

        return savedAsset;
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
    }
}
package com.joseph.socportal.controller;

import com.joseph.socportal.model.Asset;
import com.joseph.socportal.service.AssetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets();
    }

    @PostMapping
    public Asset createAsset(@RequestBody Asset asset) {
        return assetService.saveAsset(asset);
    }

    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable Long id,
            @RequestBody Asset updatedAsset) {

        Asset asset = assetService.getAssetById(id);

        asset.setHostname(updatedAsset.getHostname());
        asset.setIpAddress(updatedAsset.getIpAddress());
        asset.setOperatingSystem(updatedAsset.getOperatingSystem());
        asset.setOwner(updatedAsset.getOwner());
        asset.setCriticality(updatedAsset.getCriticality());
        asset.setStatus(updatedAsset.getStatus());

        return assetService.saveAsset(asset);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    @GetMapping("/{id}")
    public Asset getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }
}
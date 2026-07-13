package com.joseph.socportal.controller;

import com.joseph.socportal.model.IndicatorOfCompromise;
import com.joseph.socportal.service.IndicatorOfCompromiseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iocs")
public class IndicatorOfCompromiseController {

    private final IndicatorOfCompromiseService iocService;

    public IndicatorOfCompromiseController(
            IndicatorOfCompromiseService iocService) {
        this.iocService = iocService;
    }

    @GetMapping
    public List<IndicatorOfCompromise> getAllIndicators() {
        return iocService.getAllIndicators();
    }

    @GetMapping("/{id}")
    public IndicatorOfCompromise getIndicatorById(
            @PathVariable Long id) {
        return iocService.getIndicatorById(id);
    }

    @PostMapping
    public IndicatorOfCompromise createIndicator(
            @RequestBody IndicatorOfCompromise indicator) {
        return iocService.saveIndicator(indicator);
    }

    @PutMapping("/{id}")
    public IndicatorOfCompromise updateIndicator(
            @PathVariable Long id,
            @RequestBody IndicatorOfCompromise updatedIndicator) {

        IndicatorOfCompromise indicator = iocService.getIndicatorById(id);

        indicator.setValue(updatedIndicator.getValue());
        indicator.setType(updatedIndicator.getType());
        indicator.setThreatLevel(updatedIndicator.getThreatLevel());
        indicator.setStatus(updatedIndicator.getStatus());
        indicator.setSource(updatedIndicator.getSource());
        indicator.setDescription(updatedIndicator.getDescription());

        return iocService.saveIndicator(indicator);
    }

    @DeleteMapping("/{id}")
    public void deleteIndicator(@PathVariable Long id) {
        iocService.deleteIndicator(id);
    }
}
package com.joseph.socportal.controller;

import com.joseph.socportal.model.AnalystWorkload;
import com.joseph.socportal.service.AnalystWorkloadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyst-workload")
public class AnalystWorkloadController {

    private final AnalystWorkloadService analystWorkloadService;

    public AnalystWorkloadController(AnalystWorkloadService analystWorkloadService) {
        this.analystWorkloadService = analystWorkloadService;
    }

    @GetMapping
    public List<AnalystWorkload> getWorkload() {
        return analystWorkloadService.getWorkload();
    }
}
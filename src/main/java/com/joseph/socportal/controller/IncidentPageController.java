package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class IncidentPageController {

    @GetMapping("/incidents")
    public String incidents() {
        return "incidents";
    }

    @GetMapping("/incidents/{id}")
    public String incidentDetails(@PathVariable Long id, Model model) {

        model.addAttribute("incidentId", id);

        return "incident-details";
    }
}
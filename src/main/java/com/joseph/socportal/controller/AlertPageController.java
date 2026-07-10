package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AlertPageController {

    @GetMapping("/alerts")
    public String alerts() {
        return "alerts";
    }

    @GetMapping("/alerts/{id}")
    public String alertDetails(@PathVariable Long id, Model model) {

        model.addAttribute("alertId", id);

        return "alert-details";
    }
}
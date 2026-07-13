package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class IndicatorOfCompromisePageController {

    @GetMapping("/iocs")
    public String indicators() {
        return "iocs";
    }

    @GetMapping("/iocs/{id}")
    public String indicatorDetails(
            @PathVariable Long id,
            Model model) {

        model.addAttribute("iocId", id);

        return "ioc-details";
    }
}
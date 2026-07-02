package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AlertPageController {

    @GetMapping("/alerts")
    public String alerts() {
        return "alerts";
    }
}
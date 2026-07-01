package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IncidentPageController {

    @GetMapping("/incidents")
    public String incidents() {
        return "incidents";
    }

}
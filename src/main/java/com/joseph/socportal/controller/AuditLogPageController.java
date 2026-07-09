package com.joseph.socportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuditLogPageController {

    @GetMapping("/audit-log")
    public String auditLog() {
        return "audit-log";
    }

}
package com.joseph.socportal.controller;

import com.joseph.socportal.model.Notification;
import com.joseph.socportal.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getNotifications();
    }

    @DeleteMapping
    public void clearNotifications() {
        notificationService.clearNotifications();
    }
}
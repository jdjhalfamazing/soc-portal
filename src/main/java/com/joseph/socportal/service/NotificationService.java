package com.joseph.socportal.service;

import com.joseph.socportal.model.Notification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final List<Notification> notifications = new ArrayList<>();

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void addNotification(String title,
            String message,
            String type) {

        notifications.add(
                0,
                new Notification(title, message, type));

        if (notifications.size() > 20) {
            notifications.remove(notifications.size() - 1);
        }
    }

    public void clearNotifications() {
        notifications.clear();
    }

}
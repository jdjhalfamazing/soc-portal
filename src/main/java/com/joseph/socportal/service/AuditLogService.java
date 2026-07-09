package com.joseph.socportal.service;

import com.joseph.socportal.model.AuditLog;
import com.joseph.socportal.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public void log(String username, String action, String module, String details) {
        auditLogRepository.save(
                new AuditLog(username, action, module, details));
    }
}